import { Link } from "react-router-dom"
import ChatBot from "../components/ChatBot"
import LanguageSelector from "../components/LanguageSelector"

function ChatPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Chatbot</h1>
            <p className="text-sm text-[#F5F9FF]/75">
              Have a gentle conversation with the AI about your emotions.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link to="/home" className="me-btn-outline px-4 py-2 text-sm">
              ← Back to home
            </Link>
          </div>
        </div>

        <ChatBot />
      </div>
    </div>
  )
}

export default ChatPage

