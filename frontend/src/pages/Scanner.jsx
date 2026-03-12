import { useMemo, useState } from "react"
import API from "../services/api"

const EMOJIS = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "sad", emoji: "😢", label: "Sad" },
  { id: "angry", emoji: "😡", label: "Angry" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "tired", emoji: "😴", label: "Tired / exhausted" },
  { id: "neutral", emoji: "😐", label: "Not sure" },
]

function Scanner() {
  const [selected, setSelected] = useState(null)
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

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

  const startConversation = async (emotionId, label, emoji) => {
    setSelected(emotionId)
    setChat([])
    setMessage("")
    setLoading(true)
    try {
      const opening =
        `I'm feeling ${label.toLowerCase()} right now ${emoji}. ` +
        "Please ask me gently why I might feel this way and help me talk about it in a supportive way."
      const res = await API.post("/chat", {
        username,
        message: opening,
      })
      setChat([
        {
          user: `(Selected emotion: ${label})`,
          ai: res.data.reply,
        },
      ])
    } catch (e) {
      console.error(e)
      alert("Emotion chat server not available. Please check backend / GEMINI key.")
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!message.trim()) return
    setLoading(true)
    const userText = message
    setMessage("")
    try {
      const res = await API.post("/chat", {
        username,
        message: userText,
      })
      const reply = res.data.reply
      setChat((prev) => [...prev, { user: userText, ai: reply }])
    } catch (e) {
      console.error(e)
      alert("Emotion chat server not available. Please check backend / GEMINI key.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-[#F5F9FF]">Emotion chat</h1>
        <p className="text-sm text-[#F5F9FF]/80 mb-4">
          Instead of scanning your face, choose an emoji that matches how you feel. The AI will then ask
          you gentle questions and talk with you about it.
        </p>

        <div className="me-card p-4 mb-6">
          <p className="text-sm text-[#F5F9FF]/80 mb-3">How are you feeling right now?</p>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e.id}
                onClick={() => startConversation(e.id, e.label, e.emoji)}
                className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 ${
                  selected === e.id
                    ? "bg-[#5ED3D1] text-[#0B1F4B]"
                    : "bg-[#102759] text-[#F5F9FF]"
                }`}
                disabled={loading}
              >
                <span className="text-xl">{e.emoji}</span>
                <span>{e.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#F5F9FF]/60 mt-2">
            This is not a medical diagnosis, just a gentle space to talk about your feelings.
          </p>
        </div>

        <div className="me-card p-4">
          <h2 className="font-semibold mb-2 text-[#F5F9FF]">Conversation</h2>
          <div className="h-72 overflow-y-auto border border-[#8AD7FF]/40 rounded-lg p-3 mb-4 bg-[#0B1F4B]">
            {chat.map((c, index) => (
              <div key={index} className="mb-3">
                <p className="text-sm text-[#F5F9FF]">
                  <b>You:</b> {c.user}
                </p>
                <p className="text-sm text-[#5ED3D1] mt-1">
                  <b>AI:</b> {c.ai}
                </p>
              </div>
            ))}
            {chat.length === 0 && (
              <p className="text-sm text-[#F5F9FF]/60">
                Select an emoji above to start a supportive conversation.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selected
                  ? "Type what’s on your mind..."
                  : "First pick an emoji above, then start typing..."
              }
              className="flex-1 me-input"
              disabled={loading || !selected}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !selected}
              className="px-4 py-2 me-btn disabled:opacity-60 text-sm"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scanner