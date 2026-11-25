import { API_BASE_URL } from "../api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../learningPath.css";

const activities = [
  {
    id: "fillBlank",
    title: "Fill in the Blanks",
    description: "Complete the missing words",
    emoji: "✏️",
  },
  {
    id: "emojiGuess",
    title: "Emoji Guessing",
    description: "Guess words using emojis",
    emoji: "🎯",
  },
  {
    id: "vocabulary",
    title: "Vocabulary Game",
    description: "Practice words and meanings",
    emoji: "📚",
  },
  {
    id: "quiz",
    title: "Quick Quiz",
    description: "Test what you have learned",
    emoji: "🧠",
  },
];

const lessons = [
  {
    id: 1,
    title: "Basic Vocabulary",
    description: "Learn your first words",
    emoji: "🌱",
  },
  {
    id: 2,
    title: "Common Phrases",
    description: "Learn greetings and everyday expressions",
    emoji: "💬",
  },
  {
    id: 3,
    title: "Everyday Vocabulary",
    description: "Learn useful words for daily life",
    emoji: "🌍",
  },
];

function LearningPath() {
  const [progressRecords, setProgressRecords] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState("");
  const [expandedLesson, setExpandedLesson] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  const language = location.state?.language || "English";

  // Load the user's existing progress from MongoDB
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/progress/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load progress");
        }

        const records = await response.json();
        setProgressRecords(records);
      } catch (err) {
        console.error("Progress loading error:", err);
        setError("Unable to load your progress. Please try again.");
      } finally {
        setLoadingProgress(false);
      }
    };

    loadProgress();
  }, [navigate]);

  // Check whether one activity is completed
  const isActivityCompleted = (lessonId, activityId) => {
    return progressRecords.some(
      (record) =>
        record.language === language &&
        Number(record.lessonId) === lessonId &&
        record.activityId === activityId &&
        record.completed === true
    );
  };

  // Check whether all four activities are completed
  const isLessonCompleted = (lessonId) => {
    return activities.every((activity) =>
      isActivityCompleted(lessonId, activity.id)
    );
  };

  // Unlock the next lesson after completing the previous one
  const isLessonLocked = (lessonId) => {
    if (lessonId === 1) return false;
    return !isLessonCompleted(lessonId - 1);
  };

  const completedLessons = lessons.filter((lesson) =>
    isLessonCompleted(lesson.id)
  ).length;

  const completedActivities = lessons.reduce((total, lesson) => {
    return (
      total +
      activities.filter((activity) =>
        isActivityCompleted(lesson.id, activity.id)
      ).length
    );
  }, 0);

  const totalActivities = lessons.length * activities.length;

  const progress = Math.round(
    (completedActivities / totalActivities) * 100
  );

  // Open or close a lesson
  const handleLessonClick = (lessonId) => {
    if (isLessonLocked(lessonId)) return;

    setExpandedLesson((current) =>
      current === lessonId ? null : lessonId
    );
  };

  // Navigate to the existing Lesson page
  const startActivity = (lessonId, activityId) => {
    navigate("/lesson", {
      state: {
        language,
        lesson: lessonId,
        activity: activityId,
      },
    });
  };

  if (loadingProgress) {
    return (
      <div className="learning-loading">
        <div className="loading-spinner"></div>
        <h3>Preparing your learning journey...</h3>
        <p>✨ Just a moment!</p>
      </div>
    );
  }

  
return (
  <main className="learning-page">

    {/* HEADER */}
    <header className="learning-header">

      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Dashboard
      </button>

      <div className="learning-heading">
        <span className="heading-label">
          YOUR LEARNING ADVENTURE
        </span>

        <h1>{language} Learning Path 🌱</h1>

        <p>Learn step by step, one game at a time!</p>
      </div>

      <div className="learning-xp">
        ⭐ {completedActivities * 10} XP
      </div>

    </header>


    {/* ERROR MESSAGE */}
    {error && (
      <div className="learning-error">
        <p>{error}</p>

        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )}


    {/* COURSE PROGRESS */}
    <section className="course-progress">

      <div className="progress-info">
        <div>
          <h3>🌟 Your Progress</h3>
          <p>Keep going! Every activity makes you better.</p>
        </div>

        <strong>{progress}%</strong>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="progress-details">
        <span>
          {completedActivities} of {totalActivities} activities completed
        </span>

        <span>
          {completedLessons} of {lessons.length} lessons completed
        </span>
      </div>

    </section>


    {/* UNIT BANNER */}
    <section className="unit-card">

      <div className="unit-icon">🚀</div>

      <div>
        <span>UNIT 1</span>
        <h2>Let's Start Learning!</h2>
        <p>Build your language skills through fun activities.</p>
      </div>

    </section>


    {/* STICKER LEARNING ADVENTURE */}
    <section className="learning-map-section">

      <div className="map-heading">
        <span className="heading-label">YOUR JOURNEY</span>

        <h2>Explore Your Learning World 🗺️</h2>

        <p>
          Follow the path, collect stars and unlock new chapters!
        </p>
      </div>


      <div className="sticker-map">

        {lessons.map((lesson, index) => {

          const locked = isLessonLocked(lesson.id);
          const completed = isLessonCompleted(lesson.id);
          const expanded = expandedLesson === lesson.id;

          const lessonCompletedCount = activities.filter(
            (activity) =>
              isActivityCompleted(lesson.id, activity.id)
          ).length;

          const lessonProgress =
            (lessonCompletedCount / activities.length) * 100;

          return (

            <div
  className={`sticker-row ${
    index % 2 === 0 ? "sticker-left" : "sticker-right"
  } ${expanded ? "sticker-row-expanded" : ""}`}
  key={lesson.id}
>

              {/* CHAPTER STICKER */}
              <div className="sticker-container">

                <button
                  className={`chapter-sticker ${
                    locked ? "sticker-locked" : ""
                  } ${completed ? "sticker-completed" : ""} ${
                    expanded ? "sticker-active" : ""
                  }`}
                  disabled={locked}
                  onClick={() => handleLessonClick(lesson.id)}
                  aria-label={`Open ${lesson.title}`}
                >

                  <span className="sticker-decoration">
                    {locked ? "🔒" : completed ? "⭐" : "✨"}
                  </span>

                  <span className="sticker-emoji">
                    {locked ? "🔒" : lesson.emoji}
                  </span>

                  {completed && (
                    <span className="sticker-check">✓</span>
                  )}

                </button>


                {/* CHAPTER DETAILS */}
                <div className="sticker-caption">

                  <span className="chapter-number">
                    CHAPTER {index + 1}
                  </span>

                  <h3>{lesson.title}</h3>

                  <div className="chapter-progress">

                    <div className="chapter-progress-track">
                      <span
                        style={{ width: `${lessonProgress}%` }}
                      />
                    </div>

                    <small>
                      {lessonCompletedCount}/{activities.length} completed
                    </small>

                  </div>

                  {locked ? (

                    <small className="sticker-hint">
                      🔒 Complete previous chapter
                    </small>

                  ) : (

                    <button
                      className="sticker-explore"
                      onClick={() => handleLessonClick(lesson.id)}
                    >
                      {expanded
                        ? "Close ×"
                        : completed
                        ? "Play Again ↗"
                        : "Explore →"}
                    </button>

                  )}

                </div>

              </div>


              {/* MINI GAME PANEL */}
              {expanded && !locked && (

                <div className="sticker-activities">

                  <div className="activity-panel-heading">
                    <span>🎮</span>
                    <div>
                      <h4>Choose Your Game</h4>
                      <p>Complete activities to earn stars!</p>
                    </div>
                  </div>

                  <div className="activity-stickers">

                    {activities.map((activity, activityIndex) => {

                      const done = isActivityCompleted(
                        lesson.id,
                        activity.id
                      );

                      return (

                        <button
                          key={activity.id}
                          className={`mini-game-sticker ${
                            done ? "mini-game-done" : ""
                          }`}
                          onClick={() =>
                            startActivity(lesson.id, activity.id)
                          }
                          title={activity.title}
                          aria-label={activity.title}
                        >

                          <span>{activity.emoji}</span>

                          <small>
                            {done ? "✓" : activityIndex + 1}
                          </small>

                        </button>

                      );

                    })}

                  </div>

                  <p className="activity-panel-footer">
                    ✨ Pick a game and start learning!
                  </p>

                </div>

              )}

            </div>

          );

        })}

      </div>


      {/* FINISH SECTION */}
      <div className="journey-finish">

        <div className="finish-icon">🏆</div>

        <h3>Keep Going, Language Explorer!</h3>

        <p>
          Complete all chapters and become a language champion.
        </p>

        <div className="finish-stars">
          ⭐ ⭐ ⭐
        </div>

      </div>

    </section>

  </main>
);

}

export default LearningPath;
