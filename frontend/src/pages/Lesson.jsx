import { API_BASE_URL } from "../api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Lesson.css";

const activityIds = ["fillBlank", "emojiGuess", "vocabulary", "quiz"];

const activityNames = {
  fillBlank: "Fill in the Blanks",
  emojiGuess: "Emoji Guessing",
  vocabulary: "Vocabulary Game",
  quiz: "Quick Quiz",
};

const normalizeLanguage = (value) => {
  const language = String(value || "").trim().toLowerCase();
  if (language === "hindi") return "Hindi";
  if (language === "arabic") return "Arabic";
  return "English";
};

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[.!?،؟]/g, "");

function Lesson() {
  const location = useLocation();
  const navigate = useNavigate();

  const language = normalizeLanguage(location.state?.language);
  const isArabic = language === "Arabic";
  const voiceLocale = language === "Hindi" ? "hi-IN" : language === "Arabic" ? "ar-SA" : "en-US";
  const lessonId = Number(location.state?.lesson || 1);
  const activityId = activityIds.includes(location.state?.activity)
    ? location.state.activity
    : "quiz";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);

  const [activeMatchIndex, setActiveMatchIndex] = useState(null);
  const [matchedItems, setMatchedItems] = useState([]);
  const [matchFeedback, setMatchFeedback] = useState("");
  const [matchWrong, setMatchWrong] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      setLoading(true);
      setLoadError("");
      setQuestions([]);
      setCurrentQuestion(0);
      setSelectedAnswer("");
      setIsAnswered(false);
      setMatchedItems([]);
      setActiveMatchIndex(null);
      setMatchFeedback("");
      setMatchWrong(false);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const query = new URLSearchParams({
          language,
          lessonId: String(lessonId),
          activityId,
        });

        const response = await fetch(
          `${API_BASE_URL}/api/questions?${query.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Questions load nahi ho paaye.");
        }
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Is activity ke liye questions available nahi hain.");
        }

        if (isMounted) setQuestions(data);
      } catch (error) {
        console.error("Question fetch error:", error);
        if (isMounted) {
          setLoadError(error.message || "Questions load karne mein error aaya.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQuestions();
    return () => {
      isMounted = false;
    };
  }, [language, lessonId, activityId, navigate]);

  const question = questions[currentQuestion];
  const isMatchingQuestion = ["emoji-basic", "emoji-match"].includes(
    question?.questionType
  );
  const matchingItems =
    question?.questionType === "emoji-basic" ? question?.cards : question?.pairs;
  const matchingOptions = question?.options?.length
    ? question.options
    : (matchingItems || []).map((item) => item.label);

  const difficulty =
    String(question?.difficulty || "").toLowerCase() ||
    (currentQuestion < 5 ? "easy" : currentQuestion < 10 ? "medium" : "hard");

  const progressPercent = questions.length
    ? ((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100
    : 0;

  const resetQuestionState = () => {
    setSelectedAnswer("");
    setIsAnswered(false);
    setActiveMatchIndex(null);
    setMatchedItems([]);
    setMatchFeedback("");
    setMatchWrong(false);
  };

  const handleAnswer = (answer) => {
    if (isAnswered || !answer || !question) return;

    const isCorrect = normalize(answer) === normalize(question.answer);
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (isCorrect) {
      setCorrectCount((count) => count + 1);
      setXp((value) => value + 10);
    } else {
      setHearts((value) => Math.max(value - 1, 0));
    }
  };

  const handleMatchOption = (label) => {
    if (
      isAnswered ||
      activeMatchIndex === null ||
      !question ||
      !matchingItems?.length
    ) {
      return;
    }

    const activeItem = matchingItems[activeMatchIndex];
    if (!activeItem) return;

    const expected = question.answerMap?.[activeItem.label] ?? activeItem.label;

    if (normalize(label) === normalize(expected)) {
      const nextMatched = [...matchedItems, activeMatchIndex];
      setMatchedItems(nextMatched);
      setMatchFeedback("Correct match!");
      setActiveMatchIndex(null);
      setMatchWrong(false);

      if (nextMatched.length === matchingItems.length) {
        setIsAnswered(true);
        setCorrectCount((count) => count + 1);
        setXp((value) => value + 10);
        setMatchFeedback("Amazing! All pairs matched.");
      }
    } else {
      setMatchFeedback("Not quite! Try another name.");
      setMatchWrong(true);
      setHearts((value) => Math.max(value - 1, 0));
      window.setTimeout(() => setMatchWrong(false), 500);
    }
  };

  const handleNext = async () => {
    if (!isAnswered) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      resetQuestionState();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/progress/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          language,
          lessonId,
          activityId,
          score: correctCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Progress save nahi hua.");

      const progressResponse = await fetch(`${API_BASE_URL}/api/progress/mine`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const progressData = await progressResponse.json();

      if (!progressResponse.ok) {
        throw new Error(progressData.message || "Progress fetch nahi hua.");
      }

      const allActivitiesCompleted = activityIds.every((id) =>
        progressData.some(
          (record) =>
            record.language === language &&
            Number(record.lessonId) === Number(lessonId) &&
            record.activityId === id &&
            record.completed === true
        )
      );

      navigate("/lesson-result", {
        state: {
          language,
          lesson: lessonId,
          activity: activityId,
          activityTitle: activityNames[activityId],
          xp,
          hearts,
          correctCount,
          totalQuestions: questions.length,
          lessonCompleted: allActivitiesCompleted,
        },
      });
    } catch (error) {
      console.error("Progress error:", error);
      alert(error.message || "Progress save karne mein error aaya.");
    }
  };

  const listenToWord = () => {
    const text = question?.voiceText || question?.question;
    if (!text) return;

    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLocale;
    window.speechSynthesis.speak(utterance);
  };

  const speakWord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLocale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      const expected = question?.voiceText || question?.question;

      if (normalize(spoken) === normalize(expected)) {
        alert(`Great pronunciation! You said: ${spoken}`);
      } else {
        alert(`You said: ${spoken}. Try saying: ${expected}`);
      }
    };

    recognition.onerror = () =>
      alert("Could not recognize your voice. Please try again.");

    recognition.start();
  };

  if (loading) {
    return (
      <main className="lesson-page lesson-state-page">
        <div className="lesson-state-card">
          <div className="loading-orbit">🧠</div>
          <h2>Preparing your challenge...</h2>
          <p>Getting your questions ready. Just a moment!</p>
        </div>
      </main>
    );
  }

  if (loadError || !question) {
    return (
      <main className="lesson-page lesson-state-page">
        <div className="lesson-state-card">
          <div className="state-emoji">📚</div>
          <h2>{loadError ? "Unable to load activity" : "No activity found"}</h2>
          <p>{loadError || `No questions are available for ${language}.`}</p>
          <button className="next-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const isCorrectAnswer =
    isAnswered &&
    (isMatchingQuestion ||
      normalize(selectedAnswer) === normalize(question.answer));

  return (
    <main className="lesson-page">
      <div className="lesson-shell">
        <header className="lesson-topbar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span aria-hidden="true">←</span> Back
          </button>

          <div className="top-progress">
            <span className="top-progress-label">
              Question {currentQuestion + 1} <span>/ {questions.length}</span>
            </span>
            <div
              className="top-progress-track"
              role="progressbar"
              aria-valuenow={Math.round(progressPercent)}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="top-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="lesson-stats">
            <span className="stat-pill heart-pill">❤️ {hearts}</span>
            <span className="stat-pill xp-pill">⭐ {xp} XP</span>
          </div>
        </header>

        <section className="activity-heading">
          <div className="activity-heading-copy">
            <span className="language-label">
              <span className="language-dot" /> Learning {language}
            </span>
            <h1>{activityNames[activityId]}</h1>
            <p>Learn, play and level up your language skills.</p>
          </div>
          <div className="heading-illustration" aria-hidden="true">
            {activityId === "quiz" ? "🧠" : activityId === "emojiGuess" ? "🎯" : activityId === "vocabulary" ? "📚" : "✏️"}
          </div>
        </section>

        <section className="question-card">
          <div className="question-card-top">
            <span className="challenge-label">YOUR CHALLENGE</span>
            <span className={`difficulty-badge difficulty-${difficulty}`}>
              {difficulty} level
            </span>
          </div>

          {question.questionType === "emoji-sentence" && (
            <div className="emoji-display">{question.emoji}</div>
          )}

          {question.questionType === "emoji-basic" && (
            <div className="emoji-card-grid" dir={isArabic ? "rtl" : "ltr"}>
              {(question.cards || []).map((card, index) => (
                <button
                  type="button"
                  key={`${card.emoji}-${index}`}
                  className={`emoji-match-card ${
                    activeMatchIndex === index ? "match-active" : ""
                  } ${matchedItems.includes(index) ? "match-done" : ""}`}
                  onClick={() =>
                    !matchedItems.includes(index) &&
                    !isAnswered &&
                    setActiveMatchIndex(index)
                  }
                  disabled={matchedItems.includes(index) || isAnswered}
                >
                  <span className="emoji-card-picture">{card.emoji}</span>
                  <span className="emoji-card-caption">
                    {matchedItems.includes(index) ? card.label : "Tap to select"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {question.questionType === "emoji-match" && (
            <div className="emoji-card-grid" dir={isArabic ? "rtl" : "ltr"}>
              {(question.pairs || []).map((pair, index) => (
                <button
                  type="button"
                  key={`${pair.emoji}-${index}`}
                  className={`emoji-match-card ${
                    activeMatchIndex === index ? "match-active" : ""
                  } ${matchedItems.includes(index) ? "match-done" : ""}`}
                  onClick={() =>
                    !matchedItems.includes(index) &&
                    !isAnswered &&
                    setActiveMatchIndex(index)
                  }
                  disabled={matchedItems.includes(index) || isAnswered}
                >
                  <span className="emoji-card-picture">{pair.emoji}</span>
                  <span className="emoji-card-caption">
                    {matchedItems.includes(index) ? pair.label : "Select emoji"}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="question-prompt" dir={isArabic ? "rtl" : "ltr"}>
            <span className="prompt-sparkle">✦</span>
            <h2 className="question-text">{question.question}</h2>
            {language === "English" && question.hindiTranslation && (
              <p className="question-hint" dir="ltr">{question.hindiTranslation}</p>
            )}
            {language === "Hindi" && question.englishTranslation && (
              <p className="question-hint" dir="ltr">{question.englishTranslation}</p>
            )}
            {language === "Arabic" && (
              <>
                {question.englishTranslation && (
                  <p className="question-hint" dir="ltr">{question.englishTranslation}</p>
                )}
                {question.hindiTranslation && (
                  <p className="question-hint" dir="ltr">{question.hindiTranslation}</p>
                )}
              </>
            )}
            {activityId === "fillBlank" && question.hint && (
              <p className="question-hint">💡 {question.hint}</p>
            )}
            {activityId === "vocabulary" && question.hindiMeaning && (
              <p className="question-hint">Meaning: {question.hindiMeaning}</p>
            )}
          </div>

          {activityId === "vocabulary" && (
            <div className="voice-actions">
              <button type="button" className="voice-btn" onClick={listenToWord}>
                <span>🔊</span> Listen to Word
              </button>
              <button type="button" className="voice-btn" onClick={speakWord}>
                <span>🎤</span> Speak the Word
              </button>
            </div>
          )}

          {isMatchingQuestion ? (
            <div className="answer-section" dir={isArabic ? "rtl" : "ltr"}>
              <div className="answer-section-heading">
                <h3>{language === "Hindi" ? "सही नाम का मिलान करें" : language === "Arabic" ? "طابق الاسم الصحيح" : "Match the correct name"}</h3>
                <span>
                  {matchedItems.length} / {matchingItems?.length || 0} matched
                </span>
              </div>

              <p className="instruction-text">
                {language === "Hindi"
                  ? "पहले एक इमोजी चुनें, फिर उसका सही नाम चुनें।"
                  : language === "Arabic"
                    ? "اختر رمزًا تعبيريًا أولاً، ثم اختر اسمه الصحيح."
                    : "First tap an emoji, then choose its correct English name."}
              </p>

              <div className={`answer-options ${matchWrong ? "match-shake" : ""}`}>
                {matchingOptions.map((option, index) => (
                  <button
                    type="button"
                    key={`${option}-${index}`}
                    className={`answer-option ${
                      matchedItems.some((itemIndex) => {
                        const item = matchingItems[itemIndex];
                        const expected =
                          question.answerMap?.[item?.label] ?? item?.label;
                        return normalize(expected) === normalize(option);
                      })
                        ? "correct"
                        : ""
                    }`}
                    onClick={() => handleMatchOption(option)}
                    disabled={
                      isAnswered ||
                      activeMatchIndex === null ||
                      matchedItems.length === matchingItems.length
                    }
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                    {matchedItems.some((itemIndex) => {
                      const item = matchingItems[itemIndex];
                      const expected =
                        question.answerMap?.[item?.label] ?? item?.label;
                      return normalize(expected) === normalize(option);
                    }) && <span className="option-check">✓</span>}
                  </button>
                ))}
              </div>

              {matchFeedback && (
                <p className={`match-feedback ${matchWrong ? "match-feedback-wrong" : ""}`}>
                  {matchFeedback}
                </p>
              )}
            </div>
          ) : (
            <div className="answer-section" dir={isArabic ? "rtl" : "ltr"}>
              <div className="answer-section-heading">
                <h3>Choose your answer</h3>
                <span>Pick one option</span>
              </div>

              <div className="answer-options">
                {(question.options || []).map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect =
                    isAnswered &&
                    normalize(option) === normalize(question.answer);
                  const isWrong = isAnswered && isSelected && !isCorrect;

                  return (
                    <button
                      type="button"
                      key={`${option}-${index}`}
                      className={`answer-option ${
                        isSelected ? "selected" : ""
                      } ${isCorrect ? "correct" : ""} ${
                        isWrong ? "wrong" : ""
                      }`}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="option-text">{option}</span>
                      {isCorrect && <span className="option-check">✓</span>}
                      {isWrong && <span className="option-cross">✕</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isAnswered && (
            <div
              className={`answer-feedback ${
                isCorrectAnswer ? "feedback-correct" : "feedback-wrong"
              }`}
              role="status"
            >
              <div className="feedback-icon">
                {isCorrectAnswer ? "🎉" : "💪"}
              </div>
              <div className="feedback-copy">
                <strong>
                  {isCorrectAnswer ? "Excellent! Correct answer." : "Good try! Keep going."}
                </strong>
                <span>
                  {isCorrectAnswer
                    ? "You earned 10 XP. Keep up the great work!"
                    : `Correct answer: ${question.answer}`}
                </span>
              </div>
              {isCorrectAnswer && <span className="feedback-xp">+10 XP</span>}
              {isCorrectAnswer && (
                <div className="confetti-burst" aria-hidden="true">
                  <i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i>
                </div>
              )}
            </div>
          )}

          <div className="question-footer">
            <span className="footer-tip">
              {isAnswered
                ? "Nice work! Ready for the next one?"
                : "Take your time. You can do it!"}
            </span>
            <button
              className="next-btn"
              onClick={handleNext}
              disabled={!isAnswered}
            >
              {currentQuestion < questions.length - 1
                ? "Continue"
                : "Finish Activity"}
              <span>→</span>
            </button>
          </div>
        </section>

        <p className="lesson-footer-note">
          Made for curious minds <span>✦</span> Keep learning every day!
        </p>
      </div>
    </main>
  );
}

export default Lesson;
