import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import LanguageSelector from "../components/LanguageSelector"
import { useTranslation } from "react-i18next"

function AppointmentList({ title, appointments, emptyText }) {
  const { t } = useTranslation()
  return (
    <div className="mt-6 me-card p-6">
      <div className="font-bold mb-3">{title}</div>
      {appointments.length === 0 ? (
        <p className="text-sm text-[#F5F9FF]/75">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-[#8AD7FF]/20">
          {appointments.map((a) => (
            <li key={a.id} className="py-3 flex justify-between">
              <div>
                <div className="font-semibold">
                  {a.user_name || t("role_user")} ({a.age_group === "below_18" ? t("below_18") : t("above_18")})
                </div>
                <div className="text-xs text-[#F5F9FF]/70">Mobile: {a.mobile_no}</div>
                {a.parent_mobile_no && (
                  <div className="text-xs text-[#F5F9FF]/70">Parent mobile: {a.parent_mobile_no}</div>
                )}
              </div>
              <div className="text-sm text-[#F5F9FF]/85 text-right">
                <div>{a.date}</div>
                <div>{a.time}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CounselorDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = useMemo(() => localStorage.getItem("token"), [])
  const [me, setMe] = useState(null)
  const [todayAppointments, setTodayAppointments] = useState([])
  const [tomorrowAppointments, setTomorrowAppointments] = useState([])
  const [filterDate, setFilterDate] = useState("")
  const [filteredAppointments, setFilteredAppointments] = useState([])

  useEffect(() => {
    if (!token) {
      navigate("/counselor/login")
      return
    }
    API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.role !== "counselor") throw new Error("not counselor")
        setMe(res.data)
      })
      .catch(() => navigate("/counselor/login"))
  }, [navigate, token])

  useEffect(() => {
    if (!me?.id) return
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    const todayStr = `${yyyy}-${mm}-${dd}`

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const ty = tomorrow.getFullYear()
    const tm = String(tomorrow.getMonth() + 1).padStart(2, "0")
    const td = String(tomorrow.getDate()).padStart(2, "0")
    const tomorrowStr = `${ty}-${tm}-${td}`

    API.get("/appointments", { params: { counselor_id: me.id, date: todayStr } })
      .then((res) => setTodayAppointments(res.data))
      .catch(() => setTodayAppointments([]))

    API.get("/appointments", { params: { counselor_id: me.id, date: tomorrowStr } })
      .then((res) => setTomorrowAppointments(res.data))
      .catch(() => setTomorrowAppointments([]))
  }, [me])

  useEffect(() => {
    if (!me?.id || !filterDate) return
    API.get("/appointments", { params: { counselor_id: me.id, date: filterDate } })
      .then((res) => setFilteredAppointments(res.data))
      .catch(() => setFilteredAppointments([]))
  }, [filterDate, me])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("profile")
    navigate("/counselor/login")
  }

  if (!me) return <div className="p-10">Loading...</div>

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("counselor_dashboard")}</h1>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button onClick={logout} className="me-btn-outline px-4 py-2 text-sm">{t("logout")}</button>
        </div>
      </div>

      <div className="mt-6 me-card p-6">
        <div className="text-xl font-bold">{me.name}</div>
        <div className="text-[#F5F9FF]/85">{me.email}</div>
        <div className="text-[#F5F9FF]/85">{me.qualification}</div>
        <div className="text-[#F5F9FF]/70">License: {me.license_number}</div>
      </div>

      <div className="mt-6 me-card p-6 flex items-center gap-4">
        <span className="font-semibold text-sm text-[#F5F9FF]/85">{t("view_appointments_by_date")}</span>
        <input
          type="date"
          className="me-input text-sm"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        {filterDate && (
          <button
            type="button"
            onClick={() => setFilterDate("")}
            className="text-xs text-[#F5F9FF]/70 hover:underline"
          >
            {t("clear")}
          </button>
        )}
      </div>

      {filterDate ? (
        <AppointmentList
          title={t("appointments_on", { date: filterDate })}
          appointments={filteredAppointments}
          emptyText={t("no_appointments_for_date")}
        />
      ) : (
        <>
          <AppointmentList
            title={t("todays_appointments")}
            appointments={todayAppointments}
            emptyText={t("no_appointments_today")}
          />
          <AppointmentList
            title={t("tomorrows_appointments")}
            appointments={tomorrowAppointments}
            emptyText={t("no_appointments_tomorrow")}
          />
        </>
      )}
    </div>
  )
}

export default CounselorDashboard

