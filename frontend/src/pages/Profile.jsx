import { API_BASE_URL } from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../profile.css";

function Profile() {

  const navigate = useNavigate();

  const oldUser =
    JSON.parse(localStorage.getItem("user")) || {};

  const [user, setUser] = useState(oldUser);

  const [showAvatars, setShowAvatars] =
    useState(false);

  const [bio, setBio] =
    useState(oldUser.bio || "");

  const avatars = [
    "🐼",
    "🦊",
    "🐸",
    "🐱",
    "🐰",
    "🐨",
    "🦄",
    "🐻",
    "🐯",
    "🐶",
    "🐵",
    "🦁"
  ];


// Change avatar
const selectAvatar = async (avatar) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    const response = await fetch(
     `${API_BASE_URL}/api/profile/avatar`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Avatar update failed");
    }

    const updatedUser = {
      ...user,
      ...data.user,
      avatar: data.user.avatar,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setShowAvatars(false);
    alert("Avatar updated successfully!");
  } catch (error) {
    console.error("Avatar update error:", error);
    alert(error.message || "Unable to update avatar.");
  }
};


// Save bio
const saveBio = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    const response = await fetch(
     `${API_BASE_URL}/api/profile/bio`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Bio update failed");
    }

    const updatedUser = {
      ...user,
      ...data.user,
      bio: data.user.bio,
    };

    setUser(updatedUser);
    setBio(data.user.bio);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Bio update error:", error);
    alert(error.message || "Unable to save bio.");
  }
};


  // Change avatar
  // const selectAvatar = (avatar) => {

  //   const updatedUser = {
  //     ...user,
  //     avatar: avatar
  //   };

  //   setUser(updatedUser);

  //   localStorage.setItem(
  //     "user",
  //     JSON.stringify(updatedUser)
  //   );

  //   setShowAvatars(false);
  // };


  // // Save bio
  // const saveBio = () => {

  //   const updatedUser = {
  //     ...user,
  //     bio: bio
  //   };

  //   setUser(updatedUser);

  //   localStorage.setItem(
  //     "user",
  //     JSON.stringify(updatedUser)
  //   );

  //   alert("Profile updated successfully!");
  // };


  return (

    <div className="profile-page">

      {/* ================= HEADER ================= */}

      <div className="profile-header">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <h1>My Profile 👤</h1>

      </div>


      {/* ================= PROFILE CARD ================= */}

      <div className="profile-main-card">


        {/* Avatar */}

        <div className="avatar-section">

          <div className="large-avatar">
            {user?.avatar || "🐼"}
          </div>

          <button
            className="change-avatar-btn"
            onClick={() =>
              setShowAvatars(!showAvatars)
            }
          >
            ✨ Choose Avatar
          </button>


          {/* Avatar Selection */}

          {showAvatars && (

            <div className="avatar-picker">

              <h3>Choose your avatar</h3>

              <div className="avatar-grid">

                {avatars.map((avatar, index) => (

                  <button
                    key={index}
                    className="avatar-option"
                    onClick={() =>
                      selectAvatar(avatar)
                    }
                  >
                    {avatar}
                  </button>

                ))}

              </div>

            </div>

          )}

        </div>


        {/* Name */}

        <h2 className="profile-name">
          {user?.name || "Learner"}
        </h2>


        {/* Email */}

        <p className="profile-email">
          {user?.email || ""}
        </p>


        {/* Bio */}

        <div className="bio-section">

          <label>About Me</label>

          <textarea
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            placeholder="Write something about yourself..."
            maxLength={120}
          />

          <div className="bio-bottom">

            <span>
              {bio.length}/120
            </span>

            <button
              className="save-bio-btn"
              onClick={saveBio}
            >
              Save Bio
            </button>

          </div>

        </div>

      </div>


      {/* ================= STATS ================= */}

      <div className="profile-stats">


        <div className="profile-stat">

          <div className="profile-stat-icon">
            🔥
          </div>

          <h3>
            {user?.streak || 0}
          </h3>

          <p>Day Streak</p>

        </div>


        <div className="profile-stat">

          <div className="profile-stat-icon">
            ⭐
          </div>

          <h3>
            {user?.xp || 0}
          </h3>

          <p>Total XP</p>

        </div>


        <div className="profile-stat">

          <div className="profile-stat-icon">
            🏆
          </div>

          <h3>
            {user?.achievements || 0}
          </h3>

          <p>Achievements</p>

        </div>


        <div className="profile-stat">

          <div className="profile-stat-icon">
            🎮
          </div>

          <h3>
            {user?.activitiesCompleted || 0}
          </h3>

          <p>Activities</p>

        </div>

      </div>


      {/* ================= PROGRESS ================= */}

      <div className="progress-section">

        <h2>My Learning Progress 📊</h2>

        <p className="progress-subtitle">
          Track your progress in each language.
        </p>


        {/* English */}

        <div className="language-progress">

          <div className="progress-language-header">

            <span>🇬🇧 English</span>

            <strong>
              {user?.englishProgress || 0}%
            </strong>

          </div>

          <div className="big-progress-bar">

            <div
              className="big-progress-fill"
              style={{
                width: `${user?.englishProgress || 0}%`
              }}
            ></div>

          </div>

        </div>


        {/* Hindi */}

        <div className="language-progress">

          <div className="progress-language-header">

            <span>🇮🇳 Hindi</span>

            <strong>
              {user?.hindiProgress || 0}%
            </strong>

          </div>

          <div className="big-progress-bar">

            <div
              className="big-progress-fill"
              style={{
                width: `${user?.hindiProgress || 0}%`
              }}
            ></div>

          </div>

        </div>


        {/* Arabic */}

        <div className="language-progress">

          <div className="progress-language-header">

            <span>🇸🇦 Arabic</span>

            <strong>
              {user?.arabicProgress || 0}%
            </strong>

          </div>

          <div className="big-progress-bar">

            <div
              className="big-progress-fill"
              style={{
                width: `${user?.arabicProgress || 0}%`
              }}
            ></div>

          </div>

        </div>

      </div>


      {/* ================= LOGOUT ================= */}

      <button
        className="profile-logout-btn"
        onClick={() => {

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");

        }}
      >
        Logout
      </button>

    </div>
  );
}

export default Profile;