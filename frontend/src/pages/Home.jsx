import MoodScanner from "../components/MoodScanner"
import MusicTherapy from "../components/MusicTherapy"
import Meditation from "../components/Meditation"
import Motivation from "../components/Motivation"
import MoodTracker from "./MoodTracker"
import LanguageSelector from "../components/LanguageSelector"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Home(){

const navigate = useNavigate()
const { t } = useTranslation()

return(

<div className="p-6 lg:p-10 min-h-screen">

<div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold text-[#8AD7FF]">{t("home_title")}</h1>
  <LanguageSelector />
</div>

<div className="grid grid-cols-2 gap-6 mt-10">

<div className="me-card p-6">
  <MoodScanner/>
</div>

<div
onClick={()=>navigate("/chat")}
className="me-card p-6 cursor-pointer flex flex-col justify-between hover:shadow-[0_0_25px_rgba(138,215,255,0.18)] transition-shadow"
>
  <div>
    <h2 className="font-bold mb-2 text-[#F5F9FF]">{t("chatbot")}</h2>
    <p className="text-sm text-[#F5F9FF]/80">
      {t("chatbot_subtitle")}
    </p>
  </div>
  <div className="mt-4 text-4xl text-[#FFD166] self-end">💬</div>
</div>

<div className="me-card p-6">
  <MusicTherapy/>
</div>

<div className="me-card p-6">
  <Meditation/>
</div>

<div className="me-card p-6">
  <Motivation />
</div>

<div
onClick={()=>navigate("/counselor")}
className="me-card p-6 cursor-pointer hover:shadow-[0_0_25px_rgba(138,215,255,0.18)] transition-shadow"
>
{t("find_counselor")}
</div>

</div>

</div>

)

}

export default Home