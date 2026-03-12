import { useNavigate } from "react-router-dom"

function MoodScanner() {
  const navigate = useNavigate()

  return (
    <div className="p-0">
      <h2 className="font-bold mb-3">Emotion check‑in</h2>

      <p className="text-sm text-[#475569]">
        Choose how you feel with an emoji and have a short two‑way chat with the AI about it.
      </p>

      <button
        onClick={() => navigate("/scanner")}
        className="me-btn px-4 py-2 mt-3"
      >
        Open emotion chat
      </button>
    </div>
  )
}

export default MoodScanner