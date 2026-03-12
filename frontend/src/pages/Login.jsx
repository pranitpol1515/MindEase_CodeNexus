import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Login(){

const { t, i18n } = useTranslation()
const [language,setLanguage] = useState(localStorage.getItem("language") || "en")

const changeLanguage = (lng)=>{
i18n.changeLanguage(lng)
setLanguage(lng)
localStorage.setItem("language", lng)
}

return(

<div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center p-6">
  <div className="w-full max-w-5xl">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-4xl font-bold text-[#1e293b]">{t("login_title")}</h1>
        <p className="text-[#475569] mt-1">{t("login_subtitle")}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          title="Admin login"
          className="w-9 h-9 rounded-full border border-[#FDAE6B]/70 flex items-center justify-center text-sm text-[#1e293b] bg-[#FFF1E0] hover:bg-[#FED7AA] transition"
          onClick={() => (window.location.href = "/admin/login")}
        >
          🛡
        </button>
        <select
          className="me-select"
          value={language}
          onChange={(e)=>changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Login */}
      <div className="me-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1e293b]">{t("role_user")}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-[#FFEDD5] text-[#1e293b]">
            {t("login")} / {t("signup")}
          </span>
        </div>
        <p className="text-sm text-[#1e293b]/80 mt-2">{t("user_login_desc")}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to="/user/login" className="text-center me-btn py-2">
            {t("login")}
          </Link>
          <Link to="/signup" className="text-center me-btn-outline py-2">
            {t("signup")}
          </Link>
        </div>
      </div>

      {/* Counselor */}
      <div className="me-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1e293b]">{t("role_counselor")}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-[#FEF3C7] text-[#1e293b]">
            {t("signup")} / {t("login")}
          </span>
        </div>
        <p className="text-sm text-[#1e293b]/80 mt-2">{t("counselor_desc")}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            to="/counselor/apply"
            className="text-center me-btn py-2"
          >
            {t("signup")}
          </Link>
          <Link
            to="/counselor/login"
            className="text-center me-btn-outline py-2"
          >
            {t("login")}
          </Link>
        </div>
      </div>

    </div>
  </div>
</div>

)

}

export default Login
