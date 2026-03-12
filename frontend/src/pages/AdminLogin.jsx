import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import { useTranslation } from "react-i18next"

function AdminLogin() {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setLanguage(lng)
    localStorage.setItem("language", lng)
  }

  const login = async () => {
    try {
      const res = await API.post("/auth/admin/login", { username, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("profile", JSON.stringify(res.data.profile))
      navigate("/admin/dashboard")
    } catch {
      alert("Invalid admin credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="me-card p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-1">Admin Login</h2>
        <p className="text-sm text-[#F5F9FF]/80 mb-4">Verify counselors, manage users, update playlists.</p>

        <select
          className="me-select w-full mb-3"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>

        <input
          className="me-input w-full mb-3"
          placeholder="Admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="me-input w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} className="me-btn w-full py-2">
          Login
        </button>

        <p className="mt-4 text-center">
          <Link to="/login" className="text-[#8AD7FF] font-semibold hover:underline">Back to user login</Link>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin

