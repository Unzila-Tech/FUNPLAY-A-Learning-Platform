import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LearningPath from "./pages/LearningPath.jsx";
import Lesson from "./pages/Lesson.jsx";
import LessonResult from "./pages/LessonResult.jsx";
import Profile from "./pages/Profile.jsx";
function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/learning-path" element={<LearningPath />} />

        <Route path="/lesson" element={<Lesson />} />

        <Route path="/lesson-result" element={<LessonResult />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
