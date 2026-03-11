import Webcam from "react-webcam"
import { useRef, useState } from "react"
import API from "../services/api"

function Scanner(){

const webcamRef = useRef(null)
const [emotion, setEmotion] = useState("")
const [suggestion, setSuggestion] = useState("")
const [loading, setLoading] = useState(false)

const capture = () => {

const image = webcamRef.current.getScreenshot()

if (!image) return

setLoading(true)
setEmotion("")
setSuggestion("")

API.post("/detect-emotion", { image })
  .then((res) => {
    setEmotion(res.data.emotion)
    setSuggestion(res.data.suggestion)
  })
  .catch(() => {
    setEmotion("error")
    setSuggestion("Could not detect emotion. Please try again in good lighting.")
  })
  .finally(() => setLoading(false))

}

return(

<div className="p-6 lg:p-10 min-h-screen">

<Webcam
ref={webcamRef}
screenshotFormat="image/jpeg"
className="rounded-xl shadow-lg border border-[#8AD7FF]/30"
/>

<button
onClick={capture}
disabled={loading}
className="mt-4 me-btn px-4 py-2 disabled:opacity-60"
>
{loading ? "Scanning..." : "Scan Face"}
</button>

{emotion && (
  <div className="mt-6 me-card p-4">
    <div className="font-bold">Detected emotion: {emotion}</div>
    <div className="mt-2 text-[#F5F9FF]/85">{suggestion}</div>
  </div>
)}

</div>

)

}

export default Scanner