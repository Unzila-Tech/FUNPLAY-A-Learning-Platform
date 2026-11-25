import { API_BASE_URL } from "../api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../home.css";
function Home() {
  return (
    <>
      <Navbar />
         
{/* HERO SECTION */}
<section className="hero-section">

  <div className="hero-bg-shapes">
    <span className="float-item float-one">⭐</span>
    <span className="float-item float-two">📚</span>
    <span className="float-item float-three">🔤</span>
    <span className="float-item float-four">✨</span>
    <span className="float-item float-five">🎮</span>
  </div>

  <div className="hero-content">
    <div className="hero-tag">
      ✨ Learning is more fun with games!
    </div>

    <h1>
      Learn Languages.
      <br />
      <span>Play. Practice. Progress.</span>
    </h1>

    <p>
      Learn English, Hindi and Arabic
      through fun interactive games.
      Make every day a new learning adventure!
    </p>

    <Link to="/register" className="hero-link">
      <button className="start-btn">
        Start Learning <span>🚀</span>
      </button>
    </Link>

    <div className="hero-trust">
      <span>🎯 Learn at your pace</span>
      <span>🏆 Earn rewards</span>
    </div>
  </div>

  {/* Animated mascot */}
  <div className="hero-visual">
    <div className="mascot-glow"></div>

    <div className="mascot-circle">
      <div className="mascot">🦄</div>
    </div>

    <div className="mascot-bubble bubble-one">+10 XP ⭐</div>
    <div className="mascot-bubble bubble-two">Great job! 🎉</div>
    <div className="mascot-star star-one">✨</div>
    <div className="mascot-star star-two">⭐</div>
  </div>

</section>


{/* STATS SECTION */}
<section className="stats">

  <div className="stat-card xp-stat">
    <div className="stat-icon">⭐</div>
    <h3>1200+</h3>
    <p>XP Earned</p>
    <span className="stat-caption">Keep shining!</span>
  </div>

  <div className="stat-card streak-stat">
    <div className="stat-icon">🔥</div>
    <h3>7</h3>
    <p>Day Streak</p>
    <span className="stat-caption">Stay consistent!</span>
  </div>

  <div className="stat-card achievement-stat">
    <div className="stat-icon">🏆</div>
    <h3>15</h3>
    <p>Achievements</p>
    <span className="stat-caption">You are a star!</span>
  </div>

</section>


{/* GAMES SECTION */}
<section className="games">

  <div className="section-heading">
    <span className="section-tag">PLAY & LEARN</span>
    <h2>Choose Your Learning Adventure 🎮</h2>
    <p className="section-text">
      Learn vocabulary and improve your language skills
      through fun interactive activities.
    </p>
  </div>

  <div className="game-container">

    <div className="game-card fill-game">
      <div className="game-icon">📝</div>
      <span className="game-level">WORD CHALLENGE</span>
      <h3>Fill in the Blanks</h3>
      <p>
        Complete sentences by choosing
        the correct word.
      </p>
      <Link to="/register" className="game-link">
        Play Game <span>→</span>
      </Link>
    </div>

    <div className="game-card emoji-game">
      <div className="game-icon">😀</div>
      <span className="game-level">FUN CHALLENGE</span>
      <h3>Emoji Guess</h3>
      <p>
        Guess words and phrases using
        fun emojis.
      </p>
      <Link to="/register" className="game-link">
        Play Game <span>→</span>
      </Link>
    </div>

    <div className="game-card quiz-game">
      <div className="game-icon">🧠</div>
      <span className="game-level">BRAIN BOOSTER</span>
      <h3>Vocabulary Quiz</h3>
      <p>
        Test your vocabulary and
        improve your language skills.
      </p>
      <Link to="/register" className="game-link">
        Play Game <span>→</span>
      </Link>
    </div>

  </div>
</section>


{/* LANGUAGES SECTION */}
<section className="languages">

  <div className="section-heading">
    <span className="section-tag">EXPLORE THE WORLD</span>
    <h2>Learn Multiple Languages 🌍</h2>
    <p className="section-text">
      Choose your favorite language and start your journey!
    </p>
  </div>

  <div className="language-container">

    <div className="language-card english-language">
      <div className="language-icon">🇬🇧</div>
      <span className="language-number">01</span>
      <h3>English</h3>
      <p>Learn English vocabulary and everyday phrases.</p>
      <Link to="/register" className="language-link">
        Explore English →
      </Link>
    </div>

    <div className="language-card hindi-language">
      <div className="language-icon">🇮🇳</div>
      <span className="language-number">02</span>
      <h3>Hindi</h3>
      <p>Learn Hindi words and basic sentences.</p>
      <Link to="/register" className="language-link">
        Explore Hindi →
      </Link>
    </div>

    <div className="language-card arabic-language">
      <div className="language-icon">🇸🇦</div>
      <span className="language-number">03</span>
      <h3>Arabic</h3>
      <p>Discover Arabic vocabulary and expressions.</p>
      <Link to="/register" className="language-link">
        Explore Arabic →
      </Link>
    </div>

  </div>
</section>



    </>
  );
}
export default Home;