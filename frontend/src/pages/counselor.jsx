import { useEffect,useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import LanguageSelector from "../components/LanguageSelector"
import { useTranslation } from "react-i18next"

function Counselor(){

const [counselors,setCounselors] = useState([])
const [loading,setLoading] = useState(true)
const navigate = useNavigate()
const { t } = useTranslation()

useEffect(()=>{

API.get("/counselors")
  .then(res=>{
    setCounselors(res.data)
  })
  .finally(()=>setLoading(false))

},[])

return(

<div className="p-6 lg:p-10 min-h-screen">

<div className="flex items-center justify-between mb-6">
  <h1 className="text-3xl font-bold">{t("counselor_list_title")}</h1>
  <LanguageSelector />
</div>

{loading && <div>Loading...</div>}

{counselors.map((c,i)=>(

<div key={i} className="me-card p-5 mb-4">

<div className="flex items-center justify-between gap-4">
  <div>
    <h2 className="font-bold">{c.name}</h2>
    <p className="text-sm text-[#F5F9FF]/80">{c.qualification}</p>
    <p className="text-sm text-[#F5F9FF]/70">{c.city}</p>
  </div>
  <button
    onClick={()=>navigate(`/counselor/${c.id}`)}
    className="me-btn px-3 py-2 text-sm"
  >
    {t("view_profile")}
  </button>
</div>

<p className="mt-3 text-sm text-[#F5F9FF]/85">{c.phone}</p>

<a
href={`tel:${c.phone}`}
className="text-[#8AD7FF] font-semibold hover:underline"
>
{t("call_counselor")}
</a>

</div>

))}

</div>

)

}

export default Counselor