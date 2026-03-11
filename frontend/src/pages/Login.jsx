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

<div className="min-h-screen bg-[#0B1F4B] flex items-center justify-center p-6">
  <div className="w-full max-w-5xl">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-4xl font-bold text-[#F5F9FF]">{t("login_title")}</h1>
        <p className="text-[#8AD7FF] mt-1">{t("login_subtitle")}</p>
      </div>

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

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User Login */}
      <div className="me-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#F5F9FF]">{t("role_user")}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-[#8AD7FF]/20 text-[#8AD7FF]">
            {t("login")} / {t("signup")}
          </span>
        </div>
        <p className="text-sm text-[#F5F9FF]/80 mt-2">{t("user_login_desc")}</p>

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
          <h2 className="text-xl font-bold text-[#F5F9FF]">{t("role_counselor")}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-[#FFD166]/20 text-[#FFD166]">
            {t("signup")} / {t("login")}
          </span>
        </div>
        <p className="text-sm text-[#F5F9FF]/80 mt-2">{t("counselor_desc")}</p>

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

      {/* Admin */}
      <div className="me-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#F5F9FF]">{t("role_admin")}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-[#8AD7FF]/15 text-[#8AD7FF]">
            Verify / Manage
          </span>
        </div>
        <p className="text-sm text-[#F5F9FF]/80 mt-2">{t("admin_desc")}</p>

        <div className="mt-5">
          <Link
            to="/admin/login"
            className="block text-center me-btn py-2"
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
