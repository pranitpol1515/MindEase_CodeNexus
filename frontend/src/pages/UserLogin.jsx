import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import API from "../services/api"
import LanguageSelector from "../components/LanguageSelector"

function UserLogin() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      alert("Please enter username and password.")
      return
    }
    setLoading(true)
    try {
      const res = await API.post("/auth/user/login", { username, password })
      if (res.data.message === "success") {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("profile", JSON.stringify(res.data.profile))
        if (res.data.profile?.language) {
          i18n.changeLanguage(res.data.profile.language)
          localStorage.setItem("language", res.data.profile.language)
        }
        navigate("/dashboard")
        return
      }
      alert("Invalid username or password")
    } catch (err) {
      const status = err?.response?.status
      const detail = err?.response?.data?.detail
      if (status === 401) {
        alert("Invalid username or password")
      } else if (status === 422) {
        alert("Please check your inputs and try again.")
      } else if (detail) {
        alert(String(detail))
      } else {
        alert("Server error. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="me-card p-8 w-full max-w-md">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("login")} ({t("role_user")})</h2>
          <LanguageSelector />
        </div>
        <p className="text-sm text-[#475569] mt-1">{t("user_login_desc")}</p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full me-input"
            placeholder={t("username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full me-input"
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full me-btn py-2">
            {loading ? t("login") + "..." : t("login")}
          </button>
          <p className="text-sm text-center text-[#475569]">
            {t("no_account")}{" "}
            <Link to="/signup" className="text-[#0f766e] font-semibold hover:underline">
              {t("signup")}
            </Link>
          </p>
          <p className="text-sm text-center">
            <Link to="/login" className="text-[#0f766e] font-semibold hover:underline">
              ← Back
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserLogin

