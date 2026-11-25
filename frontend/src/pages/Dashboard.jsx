import { API_BASE_URL } from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};


  const [progressRecords, setProgressRecords] = useState([]);

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
      } catch (error) {
        console.error("Dashboard progress error:", error);
      }
    };

    loadProgress();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const completedActivities = progressRecords.filter(
    (record) => record.completed
  ).length;

  const englishRecords = progressRecords.filter(
    (record) => record.language === "English"
  );

  const englishCompleted = new Set(
    englishRecords
      .filter((record) => record.completed)
      .map((record) => `${record.lessonId}-${record.activityId}`)
  ).size;

  const englishProgress = Math.round(
    (englishCompleted / 12) * 100
  );


  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">

        <div className="dashboard-title">
          <h1>Welcome to FunPlay 🎮</h1>
          <p>
            Hello, {user?.name || "Learner"}! Ready to learn?
          </p>
        </div>

        <div className="header-actions">

          {/* Profile */}
          <div
            className="profile-mini"
            onClick={() => navigate("/profile")}
          >
            <div className="profile-mini-avatar">
              {user?.avatar || "🐼"}
            </div>

            <div className="profile-mini-info">
              <strong>{user?.name || "Learner"}</strong>
              <span>View Profile</span>
            </div>
          </div>

          {/* Logout */}
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      {/* ================= STATS ================= */}
      
<div className="stats-container">

  {/* TOTAL XP */}
  <div className="stat-card xp-card">
    <div className="stat-top">
      <div className="stat-icon">⭐</div>
      <span className="stat-label">EXPERIENCE</span>
    </div>

    <h3>{user?.xp || 0}</h3>

    <p>Total XP Earned</p>

    <div className="stat-footer">
      <span>🚀 Keep learning!</span>
    </div>
  </div>


  {/* DAY STREAK */}
  <div className="stat-card streak-card">
    <div className="stat-top">
      <div className="stat-icon">🔥</div>
      <span className="stat-label">DAILY GOAL</span>
    </div>

    <h3>{user?.streak || 0}</h3>

    <p>Day Streak</p>

    <div className="stat-footer">
      <span>💪 Stay consistent!</span>
    </div>
  </div>


  {/* ACHIEVEMENTS */}
  <div className="stat-card achievement-card">
    <div className="stat-top">
      <div className="stat-icon">🏆</div>
      <span className="stat-label">MILESTONES</span>
    </div>

    <h3>
      {Array.isArray(user?.achievements)
        ? user.achievements.length
        : user?.achievements || 0}
    </h3>

    <p>Achievements Unlocked</p>

    <div className="stat-footer">
      <span>🎯 Unlock more rewards!</span>
    </div>
  </div>

</div>


      {/* ================= CONTINUE LEARNING ================= */}
      <div className="continue-section">

        {/* <div className="section-heading">
          <h2>Continue Learning 📚</h2>

          <p>
            Continue your language learning journey
          </p>
        </div> */}


      {/* add card progresss when need */}




      </div> 


      {/* ================= LANGUAGES ================= */}
      <div className="language-section">

        <div className="section-heading">

          <h2>What do you want to learn? 🌎</h2>

          <p>
            Choose a language and start your learning journey.
          </p>

        </div>


        
<div className="language-container">

  {/* ENGLISH */}
  <div className="language-card english-card">

    <div className="language-top">
      <span className="language-badge">POPULAR</span>
      <span className="language-icon">🇬🇧</span>
    </div>

    <h3>English</h3>

    <p>
      Improve your English vocabulary,
      phrases and speaking skills.
    </p>

    <div className="language-info">
      <span>📚 3 Lessons</span>
      <span>⭐ Beginner</span>
    </div>

    <button
      className="start-btn"
      onClick={() =>
        navigate("/learning-path", {
          state: { language: "English" }
        })
      }
    >
      Start Learning <span>→</span>
    </button>

  </div>


  {/* HINDI */}
  <div className="language-card hindi-card">

    <div className="language-top">
      <span className="language-badge">EXPLORE</span>
      <span className="language-icon">🇮🇳</span>
    </div>

    <h3>Hindi</h3>

    <p>
      Learn Hindi words, phrases
      and everyday conversations.
    </p>

    <div className="language-info">
      <span>📚 3 Lessons</span>
      <span>⭐ Beginner</span>
    </div>

    <button
      className="start-btn"
      onClick={() =>
        navigate("/learning-path", {
          state: { language: "Hindi" }
        })
      }
    >
      Start Learning <span>→</span>
    </button>

  </div>


  {/* ARABIC */}
  <div className="language-card arabic-card">

    <div className="language-top">
      <span className="language-badge">DISCOVER</span>
      <span className="language-icon">🇸🇦</span>
    </div>

    <h3>Arabic</h3>

    <p>
      Discover Arabic vocabulary,
      phrases and expressions.
    </p>

    <div className="language-info">
      <span>📚 3 Lessons</span>
      <span>⭐ Beginner</span>
    </div>

    <button
      className="start-btn"
      onClick={() =>
        navigate("/learning-path", {
          state: { language: "Arabic" }
        })
      }
    >
      Start Learning <span>→</span>
    </button>

  </div>

</div>

        {/* </div> */}

      </div>


      {/* ================= PROFILE BUTTON ================= */}
      <div className="profile-bottom-section">

        <button
          className="profile-btn"
          onClick={() => navigate("/profile")}
        >
          👤 View My Profile
        </button>

      </div>

    </div>
  );
}

export default Dashboard;