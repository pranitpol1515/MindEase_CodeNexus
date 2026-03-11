import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import API from "../services/api"

function ChatBot(){

const { t } = useTranslation()
const [message,setMessage] = useState("")
const [chat,setChat] = useState([])
const [loading,setLoading] = useState(false)

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

const sendMessage = async () => {

if(message.trim()==="") return

setLoading(true)

try{

const res = await API.post("/chat",{
username,
message:message
})

const newChat = {
user: message,
ai: res.data.reply
}

setChat(prev => [...prev,newChat])

setMessage("")

}catch{

alert("Chat server not available. Please check backend / GEMINI key & quota.")

} finally {
  setLoading(false)
}

}

return(

<div className="max-w-2xl mx-auto bg-[#132F6B] shadow-lg rounded-2xl p-6 border border-[#8AD7FF]/40">

<h2 className="text-2xl font-bold mb-2 text-[#F5F9FF]">{t("chatbot_title")}</h2>
<p className="text-sm text-[#F5F9FF]/80 mb-4">
  {t("chatbot_subtitle")}
</p>

<div className="h-72 overflow-y-auto border border-[#8AD7FF]/40 rounded-lg p-3 mb-4 bg-[#0B1F4B]">

{chat.map((c,index)=>(
<div key={index} className="mb-3">

<p className="text-sm text-[#F5F9FF]"><b>You:</b> {c.user}</p>

<p className="text-sm text-[#5ED3D1] mt-1">
<b>AI:</b> {c.ai}
</p>

</div>
))}

{chat.length === 0 && (
  <p className="text-sm text-[#F5F9FF]/60">
    {t("chatbot_empty")}
  </p>
)}

</div>

<div className="flex gap-2">
<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder={t("chatbot_placeholder")}
className="flex-1 me-input"
/>

<button
onClick={sendMessage}
disabled={loading}
className="px-4 py-2 me-btn disabled:opacity-60"
>
{loading ? t("send") + "..." : t("send")}
</button>
</div>

</div>

)

}

export default ChatBot