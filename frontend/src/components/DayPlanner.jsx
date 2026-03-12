import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import API from "../services/api"

function DayPlanner() {
  const { t } = useTranslation()
  const [problem, setProblem] = useState(
    "I'm unable to manage my time for study. I get distracted by my phone and feel stressed."
  )
  const [currentSchedule, setCurrentSchedule] = useState("")
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const language = useMemo(() => (typeof window !== "undefined" && localStorage.getItem("language")) || "en", [])

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

  const hasSchedule = rows && rows.length > 0

  const handleGenerate = async () => {
    if (!problem.trim()) {
      setError("Please describe what is difficult about managing your day.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/schedule/day-plan", {
        username,
        problem,
        current_schedule: currentSchedule || null,
        language,
      })
      setRows(res.data.rows || [])
    } catch (e) {
      console.error(e)
      setError("Could not generate schedule. Please check backend / GEMINI key.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setRows([])
    setError("")
  }

  return (
    <div className="me-card p-6 h-full flex flex-col">
      <h2 className="font-bold mb-2 text-[#1e293b]">{t("day_plan_title")}</h2>
      <p className="text-sm text-[#1e293b]/75 mb-4">
        {t("day_plan_desc")}
      </p>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-[#1e293b]/80 block mb-1">
            What feels hard right now?
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={3}
            className="w-full me-input resize-none min-h-[70px]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#1e293b]/80 block mb-1">
            Your current / typical day (optional)
          </label>
          <textarea
            value={currentSchedule}
            onChange={(e) => setCurrentSchedule(e.target.value)}
            placeholder="Example: Classes 9am–1pm, commute 1–2pm, phone / YouTube in evening..."
            rows={2}
            className="w-full me-input resize-none min-h-[60px]"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-700 mt-2">{error}</p>}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="me-btn px-4 py-2 disabled:opacity-60 text-sm"
        >
          {loading ? "Creating schedule..." : hasSchedule ? "Update schedule" : "Create schedule"}
        </button>
        {hasSchedule && (
          <button
            onClick={handleReset}
            type="button"
            className="me-btn-outline px-3 py-2 text-xs"
          >
            Make schedule again
          </button>
        )}
      </div>

      {hasSchedule && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-[#8AD7FF]/40 bg-[#0B1F4B]/60 shadow-lg">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#8AD7FF]/20">
                <th className="px-4 py-3 font-semibold text-[#0B1F4B] border-b border-[#8AD7FF]/40">Time</th>
                <th className="px-4 py-3 font-semibold text-[#0B1F4B] border-b border-[#8AD7FF]/40">Activity</th>
                <th className="px-4 py-3 font-semibold text-[#0B1F4B] border-b border-[#8AD7FF]/40">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-[#8AD7FF]/20 hover:bg-[#132F6B]/50">
                  <td className="px-4 py-3 align-top whitespace-nowrap font-medium text-[#E2E8F0]">
                    {row.time}
                  </td>
                  <td className="px-4 py-3 align-top text-[#F5F9FF]">{row.activity}</td>
                  <td className="px-4 py-3 align-top text-[#CBD5E1]">{row.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DayPlanner

