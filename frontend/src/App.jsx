import { BrowserRouter, Routes, Route } from "react-router-dom"
import Splash from "./pages/Splash"
import Login from "./pages/Login"
import UserLogin from "./pages/UserLogin"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Counselor from "./pages/counselor"
import UserDashboard from "./pages/UserDashboard"
import Scanner from "./pages/Scanner"
import CounselorProfile from "./pages/CounselorProfile"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import CounselorApply from "./pages/CounselorApply"
import CounselorLogin from "./pages/CounselorLogin"
import CounselorDashboard from "./pages/CounselorDashboard"
import ChatPage from "./pages/ChatPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/counselor/apply" element={<CounselorApply />} />
        <Route path="/counselor/login" element={<CounselorLogin />} />
        <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/counselor" element={<Counselor />} />
        <Route path="/counselor/:id" element={<CounselorProfile />} />
        <Route path="/scanner" element={<Scanner />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App