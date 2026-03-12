import MoodScanner from "../components/MoodScanner"
import MusicTherapy from "../components/MusicTherapy"
import Meditation from "../components/Meditation"
import Motivation from "../components/Motivation"
import MoodTracker from "./MoodTracker"
import LanguageSelector from "../components/LanguageSelector"
import DayPlanner from "../components/DayPlanner"
import GameZone from "../components/GameZone"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import API from "../services/api"
import { useEffect, useMemo, useState } from "react"

function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [dailySummary, setDailySummary] = useState("")
  const [analyzing, setAnalyzing] = useState(false)

  const username = useMemo(() => {
    try {
      const raw = localStorage.getItem("profile")
      if (!raw) return "guest"
      const p = JSON.parse(raw)
      return p.username || p.name || "guest"
    } catch {
      return "guest"
    }
  }, [])

  const language = useMemo(() => (typeof window !== "undefined" && localStorage.getItem("language")) || "en", [])

  const runDailyAnalysis = async () => {
    setAnalyzing(true)
    try {
      const res = await API.post("/insights/daily-report", { username, language })
      setDailySummary(res.data.summary || "")
    } catch {
      setDailySummary(
        "We could not reach the analysis service right now. Try again in a little while."
      )
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1e293b]">{t("home_title")}</h1>
        <LanguageSelector />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-10">
        <div className="me-card p-6">
          <MoodScanner />
        </div>

        <div
          onClick={() => navigate("/chat")}
          className="me-card p-6 cursor-pointer flex flex-col justify-between hover:shadow-[0_0_25px_rgba(138,215,255,0.18)] transition-shadow"
        >
          <div>
            <h2 className="font-bold mb-2 text-[#1e293b]">{t("chatbot")}</h2>
            <p className="text-sm text-[#1e293b]/80">{t("chatbot_subtitle")}</p>
          </div>
          <div className="mt-4 text-4xl text-[#1e293b] self-end">💬</div>
        </div>

        <DayPlanner />

        <GameZone />

        <div className="me-card p-6">
          <MusicTherapy />
        </div>

        <div className="me-card p-6">
          <Meditation />
        </div>

        <div className="me-card p-6">
          <Motivation />
        </div>

        <div
          onClick={() => navigate("/counselor")}
          className="me-card p-6 cursor-pointer hover:shadow-[0_0_25px_rgba(138,215,255,0.18)] transition-shadow"
        >
          <span className="font-bold text-[#1e293b]">{t("find_counselor")}</span>
        </div>
      </div>

      <div className="mt-10">
        <div className="me-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold mb-1 text-[#1e293b]">{t("daily_checkin_title")}</h2>
              <p className="text-sm text-[#1e293b]/80">
                {t("daily_checkin_desc")}
              </p>
            </div>
            <button
              onClick={runDailyAnalysis}
              className="me-btn px-4 py-2 text-sm"
              disabled={analyzing}
            >
              {analyzing ? t("analyzing") : t("analyze_today")}
            </button>
          </div>

          {dailySummary && (
            <div className="mt-4 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]/60 px-3 py-3 text-sm text-[#1e293b] whitespace-pre-line">
              {dailySummary}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home