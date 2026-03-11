import { useEffect, useMemo, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import LanguageSelector from "../components/LanguageSelector"
import { useTranslation } from "react-i18next"

function PlaylistSection({ motivationUrls, meditationUrls }) {
  const { t } = useTranslation()
  const renderList = (urls) =>
    urls.length === 0 ? (
      <p className="text-sm text-[#F5F9FF]/70">{t("no_videos_yet")}</p>
    ) : (
      <ul className="list-disc list-inside text-sm text-[#8AD7FF] space-y-1">
        {urls.map((u) => (
          <li key={u}>
            <a href={u} target="_blank" rel="noreferrer" className="hover:underline">
              {u}
            </a>
          </li>
        ))}
      </ul>
    )

  return (
    <div className="mt-8 grid grid-cols-2 gap-6">
      <div className="me-card p-6">
        <h2 className="font-bold mb-2">Motivation videos</h2>
        {renderList(motivationUrls)}
      </div>
      <div className="me-card p-6">
        <h2 className="font-bold mb-2">Meditation videos</h2>
        {renderList(meditationUrls)}
      </div>
    </div>
  )
}

function ReminderCard({ reminder }) {
  const { t } = useTranslation()
  if (!reminder) return null
  return (
    <div className="mt-6 me-card p-4 max-w-md">
      <div className="font-bold mb-1">{t("appointment_reminder_title")}</div>
      <div className="text-sm text-[#F5F9FF]/85">
        <div>{t("reminder_counselor", { name: reminder.counselorName })}</div>
        <div>{t("reminder_date", { date: reminder.date })}</div>
        <div>{t("reminder_time", { time: reminder.time })}</div>
      </div>
    </div>
  )
}

function Under18Dashboard({ profile, playlists, reminder }) {
  const { t } = useTranslation()
  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("user_dashboard_below18")}</h1>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link className="me-btn-outline px-4 py-2 text-sm" to="/home">Home</Link>
        </div>
      </div>
      <p className="mt-2 text-[#F5F9FF]/80">{t("welcome_user", { name: profile?.username })}</p>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="me-card p-6">
          <h2 className="font-bold mb-2">{t("appointments")}</h2>
          <p className="text-sm text-[#F5F9FF]/70">Book with parent mobile number.</p>
          <Link className="inline-block mt-3 text-[#8AD7FF] font-semibold hover:underline" to="/counselor">{t("book_appointment")}</Link>
        </div>
        <div className="me-card p-6">
          <h2 className="font-bold mb-2">{t("safety")}</h2>
          <p className="text-sm text-[#F5F9FF]/70">{t("safety_note")}</p>
        </div>
      </div>

      <PlaylistSection
        motivationUrls={playlists.motivationUrls}
        meditationUrls={playlists.meditationUrls}
      />
      <ReminderCard reminder={reminder} />
    </div>
  )
}

function Above18Dashboard({ profile, playlists, reminder }) {
  const { t } = useTranslation()
  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("user_dashboard_above18")}</h1>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link className="me-btn-outline px-4 py-2 text-sm" to="/home">Home</Link>
        </div>
      </div>
      <p className="mt-2 text-[#F5F9FF]/80">{t("welcome_user", { name: profile?.username })}</p>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="me-card p-6">
          <h2 className="font-bold mb-2">{t("appointments")}</h2>
          <p className="text-sm text-[#F5F9FF]/70">Book your session quickly.</p>
          <Link className="inline-block mt-3 text-[#8AD7FF] font-semibold hover:underline" to="/counselor">{t("book_appointment")}</Link>
        </div>
        <div className="me-card p-6">
          <h2 className="font-bold mb-2">Mood tools</h2>
          <p className="text-sm text-[#F5F9FF]/70">Chatbot, mood tracking, and scanner.</p>
          <Link className="inline-block mt-3 text-[#8AD7FF] font-semibold hover:underline" to="/home">Open tools</Link>
        </div>
      </div>

      <PlaylistSection
        motivationUrls={playlists.motivationUrls}
        meditationUrls={playlists.meditationUrls}
      />
      <ReminderCard reminder={reminder} />
    </div>
  )
}

function UserDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => {
    const raw = localStorage.getItem("profile")
    return raw ? JSON.parse(raw) : null
  })
  const token = useMemo(() => localStorage.getItem("token"), [])
  const [playlists, setPlaylists] = useState({ motivationUrls: [], meditationUrls: [] })
  const [reminder] = useState(() => {
    const raw = localStorage.getItem("appointmentReminder")
    try {
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }
    API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProfile(res.data)
        localStorage.setItem("profile", JSON.stringify(res.data))
      })
      .catch(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("profile")
        navigate("/login")
      })
  }, [navigate, token])

  useEffect(() => {
    API.get("/playlists")
      .then((res) => {
        setPlaylists({
          motivationUrls: res.data.motivation_urls || [],
          meditationUrls: res.data.meditation_urls || [],
        })
      })
      .catch(() => {
        setPlaylists({ motivationUrls: [], meditationUrls: [] })
      })
  }, [])

  if (!profile) return null

  return profile.age_group === "below_18" ? (
    <Under18Dashboard
      profile={profile}
      playlists={playlists}
      reminder={reminder && reminder.username === profile.username ? reminder : null}
    />
  ) : (
    <Above18Dashboard
      profile={profile}
      playlists={playlists}
      reminder={reminder && reminder.username === profile.username ? reminder : null}
    />
  )
}

export default UserDashboard

