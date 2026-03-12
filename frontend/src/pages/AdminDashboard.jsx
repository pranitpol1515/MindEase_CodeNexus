import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import LanguageSelector from "../components/LanguageSelector"
import { useTranslation } from "react-i18next"

function AdminDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = useMemo(() => localStorage.getItem("token"), [])

  const [apps, setApps] = useState([])
  const [users, setUsers] = useState([])
  const [motivationUrls, setMotivationUrls] = useState([])
  const [meditationUrls, setMeditationUrls] = useState([])
  const [newMotivationUrl, setNewMotivationUrl] = useState("")
  const [newMeditationUrl, setNewMeditationUrl] = useState("")
  const [loading, setLoading] = useState(true)

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  const load = async () => {
    setLoading(true)
    try {
      const [a, u, p] = await Promise.all([
        API.get("/admin/applications", { headers }),
        API.get("/admin/users", { headers }),
        API.get("/admin/playlist", { headers }),
      ])
      setApps(a.data)
      setUsers(u.data)
      setMotivationUrls(p.data.motivation_urls || [])
      setMeditationUrls(p.data.meditation_urls || [])
    } catch {
      navigate("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) navigate("/admin/login")
    else load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const approve = async (id) => {
    await API.post(`/admin/applications/${id}/approve`, {}, { headers })
    await load()
  }

  const savePlaylist = async () => {
    await API.put(
      "/admin/playlist",
      { motivation_urls: motivationUrls, meditation_urls: meditationUrls },
      { headers }
    )
    alert("Playlist updated")
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("profile")
    navigate("/admin/login")
  }

  if (loading) return <div className="p-10 text-[#1e293b]">Loading...</div>

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1e293b]">{t("admin_dashboard")}</h1>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button onClick={logout} className="me-btn-outline px-4 py-2 text-sm">{t("logout")}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="me-card p-6">
          <h2 className="text-xl font-bold mb-4 text-[#1e293b]">{t("counselor_applications")}</h2>
          {apps.length === 0 ? (
            <p className="text-sm text-[#475569]">{t("no_pending_applications")}</p>
          ) : (
            apps.map((a) => (
              <div key={a.id} className="border border-[#8AD7FF]/25 rounded-xl p-4 mb-3 bg-[#0B1F4B]/40">
                <div className="font-bold">{a.name}</div>
                <div className="text-sm text-[#F5F9FF]/80">{a.email}</div>
                <div className="text-sm text-[#F5F9FF]/80">{a.qualification}</div>
                <div className="text-sm text-[#F5F9FF]/80">{t("license_label", { license: a.license_number })}</div>
                <button
                  onClick={() => approve(a.id)}
                  className="mt-3 me-btn px-3 py-2 text-sm"
                >
                  {t("approve")}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="me-card p-6">
          <h2 className="text-xl font-bold mb-4 text-[#1e293b]">{t("motivation_playlist")}</h2>
          <div className="space-y-2 mb-3">
            {motivationUrls.length === 0 && (
              <p className="text-sm text-[#475569]">{t("no_motivation_videos")}</p>
            )}
            {motivationUrls.map((url, index) => (
              <div key={url + index} className="flex items-center gap-2 text-sm">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-[#8AD7FF] hover:underline truncate"
                  title={url}
                >
                  {url}
                </a>
                <button
                  type="button"
                  onClick={() =>
                    setMotivationUrls(motivationUrls.filter((_, i) => i !== index))
                  }
                  className="text-xs text-red-200 hover:underline"
                >
                  {t("delete")}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <input
              className="me-input flex-1 text-sm"
              placeholder={t("add_motivation_url")}
              value={newMotivationUrl}
              onChange={(e) => setNewMotivationUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = newMotivationUrl.trim()
                if (!trimmed) return
                if (!motivationUrls.includes(trimmed)) {
                  setMotivationUrls([...motivationUrls, trimmed])
                }
                setNewMotivationUrl("")
              }}
              className="me-btn px-3 py-2 text-sm"
            >
              {t("add")}
            </button>
          </div>

          <button
            type="button"
            onClick={savePlaylist}
            className="mt-1 me-btn px-3 py-2 text-sm"
          >
            {t("save_motivation_list")}
          </button>

          <h2 className="text-xl font-bold mb-2 mt-6 text-[#1e293b]">{t("meditation_playlist")}</h2>
          <div className="space-y-2 mb-3">
            {meditationUrls.length === 0 && (
              <p className="text-sm text-[#475569]">{t("no_meditation_videos")}</p>
            )}
            {meditationUrls.map((url, index) => (
              <div key={url + index} className="flex items-center gap-2 text-sm">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-[#8AD7FF] hover:underline truncate"
                  title={url}
                >
                  {url}
                </a>
                <button
                  type="button"
                  onClick={() =>
                    setMeditationUrls(meditationUrls.filter((_, i) => i !== index))
                  }
                  className="text-xs text-red-200 hover:underline"
                >
                  {t("delete")}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <input
              className="me-input flex-1 text-sm"
              placeholder={t("add_meditation_url")}
              value={newMeditationUrl}
              onChange={(e) => setNewMeditationUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = newMeditationUrl.trim()
                if (!trimmed) return
                if (!meditationUrls.includes(trimmed)) {
                  setMeditationUrls([...meditationUrls, trimmed])
                }
                setNewMeditationUrl("")
              }}
              className="me-btn px-3 py-2 text-sm"
            >
              {t("add")}
            </button>
          </div>

          <button
            type="button"
            onClick={savePlaylist}
            className="mt-1 me-btn px-3 py-2 text-sm"
          >
            {t("save_meditation_list")}
          </button>
        </div>
      </div>

      <div className="mt-8 me-card p-6">
        <h2 className="text-xl font-bold mb-4 text-[#1e293b]">{t("users_title")}</h2>
        <div className="grid grid-cols-3 gap-3">
          {users.map((u) => (
            <div key={u.id} className="border border-[#8AD7FF]/25 rounded-xl p-3 bg-[#0B1F4B]/40">
              <div className="font-bold">{u.username}</div>
              <div className="text-sm text-[#F5F9FF]/80">{u.email}</div>
              <div className="text-sm text-[#F5F9FF]/80">{u.age_group}</div>
              <div className="text-sm text-[#F5F9FF]/80">{u.language}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

