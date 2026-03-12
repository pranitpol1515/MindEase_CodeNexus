import { useEffect, useMemo, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import LanguageSelector from "../components/LanguageSelector"
import { useTranslation } from "react-i18next"

function PlaylistSection({ motivationUrls, meditationUrls }) {
  const { t } = useTranslation()
  const renderList = (urls) =>
    urls.length === 0 ? (
      <p className="text-sm text-[#475569]">{t("no_videos_yet")}</p>
    ) : (
      <ul className="list-disc list-inside text-sm text-[#0f766e] space-y-1">
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
        <h2 className="font-bold mb-2 text-[#1e293b]">Motivation videos</h2>
        {renderList(motivationUrls)}
      </div>
      <div className="me-card p-6">
        <h2 className="font-bold mb-2 text-[#1e293b]">Meditation videos</h2>
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
      <div className="text-sm text-[#1e293b]">
        <div>{t("reminder_counselor", { name: reminder.counselorName })}</div>
        <div>{t("reminder_date", { date: reminder.date })}</div>
        <div>{t("reminder_time", { time: reminder.time })}</div>
      </div>
    </div>
  )
}

function QuotePanel({ username }) {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    if (!username) return
    API.get(`/insights/quote-of-day/${encodeURIComponent(username)}`)
      .then((res) => {
        setQuote(res.data.text || "")
      })
      .catch(() => {
        setQuote(
          "You are allowed to move slowly. Showing up for yourself still counts as progress."
        )
      })
  }, [username])

  if (!username) return null

  return (
    <div className="mt-4 me-card p-4 max-w-2xl">
      <div className="text-xs uppercase tracking-wide text-[#475569] mb-1">
        Today&apos;s gentle thought
      </div>
      <div className="text-sm text-[#1e293b]">{quote}</div>
    </div>
  )
}

function JournalPanel({ username }) {
  const { t } = useTranslation()
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!username) return
    API.get(`/journal/latest/${encodeURIComponent(username)}?limit=1`)
      .then((res) => {
        const latest = res.data.entries?.[0]
        if (latest) {
          setText(latest.text || "")
          setSummary(latest.summary || "")
        }
      })
      .catch(() => {})
  }, [username])

  const save = async () => {
    if (!text.trim()) {
      alert(t("journal_write_first"))
      return
    }
    setSaving(true)
    try {
      const res = await API.post("/journal/save", { username, text })
      setSummary(res.data.entry?.summary || "")
      alert(t("journal_saved"))
    } catch {
      alert(t("journal_save_error"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p className="text-sm text-[#475569] mb-3">
        {t("journal_description")}
      </p>
      <textarea
        className="w-full me-input min-h-[110px] resize-vertical"
        placeholder={t("journal_placeholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={save}
        disabled={saving}
        className="mt-3 me-btn px-4 py-2 text-sm"
      >
        {saving ? t("saving") + "..." : t("journal_save_btn")}
      </button>
      {summary && (
        <div className="mt-4 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]/50 px-3 py-2 text-sm text-[#1e293b]">
          <div className="font-semibold text-xs mb-1">{t("journal_ai_reflection")}</div>
          <div>{summary}</div>
        </div>
      )}
    </div>
  )
}

function CommunityPanel({ username }) {
  const [communities, setCommunities] = useState([])
  const [activeSlug, setActiveSlug] = useState("")
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  useEffect(() => {
    if (!username) return
    API.get(`/communities/${encodeURIComponent(username)}`)
      .then((res) => {
        const list = res.data.communities || []
        setCommunities(list)
        const joined = list.find((c) => c.joined)
        if (joined) setActiveSlug(joined.slug)
      })
      .catch(() => {})
  }, [username])

  useEffect(() => {
    if (!activeSlug) {
      setMessages([])
      return
    }
    API.get(`/communities/${encodeURIComponent(activeSlug)}/messages`)
      .then((res) => setMessages(res.data.messages || []))
      .catch(() => setMessages([]))
  }, [activeSlug])

  const toggleMembership = async (slug, joined) => {
    try {
      if (joined) {
        await API.post("/communities/leave", { username, community_slug: slug })
        if (activeSlug === slug) setActiveSlug("")
      } else {
        await API.post("/communities/join", { username, community_slug: slug })
        setActiveSlug(slug)
      }
      const res = await API.get(`/communities/${encodeURIComponent(username)}`)
      setCommunities(res.data.communities || [])
    } catch {
      alert("Unable to update community membership right now.")
    }
  }

  const send = async () => {
    if (!activeSlug) {
      alert("Join a community first.")
      return
    }
    if (!text.trim()) return
    const body = text
    setText("")
    try {
      await API.post("/communities/message", {
        username,
        community_slug: activeSlug,
        text: body,
      })
      const res = await API.get(`/communities/${encodeURIComponent(activeSlug)}/messages`)
      setMessages(res.data.messages || [])
    } catch {
      alert("Could not send message.")
    }
  }

  const { t } = useTranslation()
  return (
    <div>
      <p className="text-sm text-[#475569] mb-3">
        {t("community_description")}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {communities.map((c) => (
          <button
            key={c.slug}
            onClick={() => toggleMembership(c.slug, c.joined)}
            className={`px-3 py-1 rounded-full text-xs border ${
              c.joined
                ? "bg-[#F97316] text-white border-[#F97316]"
                : "bg-[#FFF7ED] text-[#1e293b] border-[#FCD34D]"
            }`}
          >
            {c.name} {c.joined ? "✓" : ""}
          </button>
        ))}
      </div>

      <div className="border border-[#FED7AA] rounded-lg p-3 bg-white h-52 overflow-y-auto mb-3">
        {activeSlug ? (
          messages.length === 0 ? (
            <p className="text-sm text-[#1e293b]/70">
              No messages yet. Start by saying a supportive hello to others.
            </p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="mb-2 text-sm">
                <span className="font-semibold text-[#1e293b]">{m.username}:</span>{" "}
                <span className="text-[#1e293b]">{m.text}</span>
              </div>
            ))
          )
        ) : (
          <p className="text-sm text-[#1e293b]/70">
            Select and join a community above to see messages.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 me-input"
          placeholder="Write a short supportive message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!activeSlug}
        />
        <button
          onClick={send}
          disabled={!activeSlug}
          className="me-btn px-4 py-2 text-sm disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function JournalCard({ username, expanded, onToggle }) {
  const { t } = useTranslation()
  return (
    <div className="me-card p-6">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left flex items-center justify-between group"
      >
        <h2 className="font-bold mb-0">{t("journal_title")}</h2>
        <span className="text-2xl text-[#1e293b] transition-transform group-hover:scale-110">
          {expanded ? "−" : "+"}
        </span>
      </button>
      {!expanded && (
        <p className="text-sm text-[#475569] mt-2">
          {t("journal_click_to_open")}
        </p>
      )}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#8AD7FF]/20">
          <JournalPanel username={username} />
        </div>
      )}
    </div>
  )
}

function CommunityCard({ username, expanded, onToggle }) {
  const { t } = useTranslation()
  return (
    <div className="me-card p-6">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left flex items-center justify-between group"
      >
        <h2 className="font-bold mb-0">{t("community_title")}</h2>
        <span className="text-2xl text-[#1e293b] transition-transform group-hover:scale-110">
          {expanded ? "−" : "+"}
        </span>
      </button>
      {!expanded && (
        <p className="text-sm text-[#475569] mt-2">
          {t("community_click_to_open")}
        </p>
      )}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#8AD7FF]/20">
          <CommunityPanel username={username} />
        </div>
      )}
    </div>
  )
}

function Under18Dashboard({ profile, playlists, reminder }) {
  const { t } = useTranslation()
  const [journalOpen, setJournalOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1e293b]">{t("user_dashboard_below18")}</h1>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link className="me-btn-outline px-4 py-2 text-sm" to="/home">Home</Link>
        </div>
      </div>
      <p className="mt-2 text-[#475569]">{t("welcome_user", { name: profile?.username })}</p>

      <QuotePanel username={profile?.username} />

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="me-card p-6">
          <h2 className="font-bold mb-2 text-[#1e293b]">{t("appointments")}</h2>
          <p className="text-sm text-[#475569]">Book with parent mobile number.</p>
          <Link className="inline-block mt-3 text-[#0f766e] font-semibold hover:underline" to="/counselor">{t("book_appointment")}</Link>
        </div>
        <div className="me-card p-6">
          <h2 className="font-bold mb-2 text-[#1e293b]">{t("safety")}</h2>
          <p className="text-sm text-[#475569]">{t("safety_note")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <JournalCard
          username={profile?.username}
          expanded={journalOpen}
          onToggle={() => setJournalOpen(!journalOpen)}
        />
        <CommunityCard
          username={profile?.username}
          expanded={communityOpen}
          onToggle={() => setCommunityOpen(!communityOpen)}
        />
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
  const [journalOpen, setJournalOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1e293b]">{t("user_dashboard_above18")}</h1>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link className="me-btn-outline px-4 py-2 text-sm" to="/home">Home</Link>
        </div>
      </div>
      <p className="mt-2 text-[#475569]">{t("welcome_user", { name: profile?.username })}</p>

      <QuotePanel username={profile?.username} />

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="me-card p-6">
          <h2 className="font-bold mb-2 text-[#1e293b]">{t("appointments")}</h2>
          <p className="text-sm text-[#475569]">Book your session quickly.</p>
          <Link className="inline-block mt-3 text-[#0f766e] font-semibold hover:underline" to="/counselor">{t("book_appointment")}</Link>
        </div>
        <div className="me-card p-6">
          <h2 className="font-bold mb-2 text-[#1e293b]">Mood tools</h2>
          <p className="text-sm text-[#475569]">Chatbot, mood tracking, and scanner.</p>
          <Link className="inline-block mt-3 text-[#0f766e] font-semibold hover:underline" to="/home">Open tools</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <JournalCard
          username={profile?.username}
          expanded={journalOpen}
          onToggle={() => setJournalOpen(!journalOpen)}
        />
        <CommunityCard
          username={profile?.username}
          expanded={communityOpen}
          onToggle={() => setCommunityOpen(!communityOpen)}
        />
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

