import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import logo from "../assets/logo.jpeg"

function Splash() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const id = setTimeout(() => {
      navigate("/login")
    }, 3000)
    return () => clearTimeout(id)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0B1F4B] text-[#F5F9FF]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-[0_0_25px_rgba(255,209,102,0.7)] border-4 border-[#FFD166]">
          <img src={logo} alt="MindEase logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-5xl font-bold tracking-wide">{t("app_name")}</h1>
        <p className="mt-2 text-xl text-[#8AD7FF] text-center max-w-xl">
          {t("Your AI Companion for Better Mental Well-Being")}
        </p>
      </div>
    </div>
  )
}

export default Splash