import { useState } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Signup(){

const navigate = useNavigate()

const { t, i18n } = useTranslation()

const [username,setUsername] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [ageGroup,setAgeGroup] = useState("")
const [birthdate,setBirthdate] = useState("")
const [language,setLanguage] = useState("en")

const changeLanguage = (lng)=>{
i18n.changeLanguage(lng)
setLanguage(lng)
localStorage.setItem("language", lng)
}

const handleSignup = async ()=>{

if(!username || !email || !password || !ageGroup || !birthdate){
alert("Please fill all fields")
return
}

try{

await API.post("/auth/user/signup",{
username,
email,
password,
age_group: ageGroup,
birthdate,
language
})

alert("Account created successfully")

navigate("/login")

}catch{

alert("Signup failed. Try again.")

}

}

return(

<div className="min-h-screen flex items-center justify-center p-6">

<div className="me-card p-8 w-full max-w-md">

<h2 className="text-2xl font-bold mb-4">{t("signup")}</h2>

<div className="mb-3">
<select
className="me-select w-full"
onChange={(e)=>changeLanguage(e.target.value)}
value={language}
>
<option value="en">English</option>
<option value="hi">Hindi</option>
<option value="mr">Marathi</option>
</select>
</div>

<input
className="me-input w-full mb-3"
placeholder={t("username")}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
className="me-input w-full mb-3"
placeholder={t("email")}
onChange={(e)=>setEmail(e.target.value)}
/>

<select
className="me-select w-full mb-3"
value={ageGroup}
onChange={(e)=>setAgeGroup(e.target.value)}
>
  <option value="">{t("age_group")}</option>
  <option value="below_18">{t("below_18")}</option>
  <option value="above_18">{t("above_18")}</option>
</select>

<input
type="date"
className="me-input w-full mb-3"
value={birthdate}
onChange={(e)=>setBirthdate(e.target.value)}
/>

<input
type="password"
className="me-input w-full mb-3"
placeholder={t("password")}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={handleSignup}
className="me-btn w-full py-2"

>

{t("signup")} </button>

<p className="mt-4 text-center">
{t("have_account")} <Link to="/login" className="text-[#8AD7FF] font-semibold hover:underline">{t("login")}</Link>
</p>

</div>

</div>

)

}

export default Signup
