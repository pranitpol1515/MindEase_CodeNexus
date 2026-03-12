import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import LanguageSelector from "../components/LanguageSelector"

function CounselorLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {
    try {
      const res = await API.post("/auth/counselor/login", { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("profile", JSON.stringify(res.data.profile))
      navigate("/counselor/dashboard")
    } catch {
      alert("Login failed. Ensure you are approved by admin.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="me-card p-8 w-full max-w-md">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Counselor Login</h2>
          <LanguageSelector />
        </div>

        <input
          className="me-input w-full mt-4 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Not applied? <Link className="text-[#8AD7FF] font-semibold hover:underline" to="/counselor/apply">Apply</Link>
        </p>
        <p className="mt-2 text-center">
          <Link className="text-[#8AD7FF] font-semibold hover:underline" to="/login">Back to user login</Link>
        </p>
      </div>
    </div>
  )
}

export default CounselorLogin

