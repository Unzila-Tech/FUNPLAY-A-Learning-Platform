
import { useLocation, useNavigate } from "react-router-dom";
import "../lessonResult.css";

function LessonResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    language = "English",
    xp = 0,
    hearts = 5,
  } = location.state || {};

  const handleContinue = () => {
    navigate("/learning-path");
  };

  return (
    <div className="result-page">

      <div className="result-card">

        <div className="result-icon">
          🎉
        </div>

        <h1>Lesson Complete!</h1>

        <p className="result-subtitle">
          Great job! You completed the {language} lesson.
        </p>

        {/* Stats */}
        <div className="result-stats">

          <div className="result-stat">
            <span>⭐</span>
            <h3>{xp}</h3>
            <p>XP Earned</p>
          </div>

          <div className="result-stat">
            <span>❤️</span>
            <h3>{hearts}</h3>
            <p>Hearts Left</p>
          </div>

          <div className="result-stat">
            <span>🎯</span>
            <h3>100%</h3>
            <p>Lesson Progress</p>
          </div>

        </div>

        {/* Progress */}
        <div className="result-progress">

          <div className="progress-title">
            <span>Course Progress</span>
            <span>25%</span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

        </div>

        {/* Button */}
        <button
          className="continue-learning-btn"
          onClick={handleContinue}
        >
          Continue Learning
        </button>

      </div>

    </div>
  );
}

export default LessonResult;