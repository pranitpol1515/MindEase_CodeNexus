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
const [age,setAge] = useState("")
const [birthdate,setBirthdate] = useState("")
const [language,setLanguage] = useState("en")

const changeLanguage = (lng)=>{
i18n.changeLanguage(lng)
setLanguage(lng)
localStorage.setItem("language", lng)
}

const handleSignup = async ()=>{

if(!username || !email || !password || !age || !birthdate){
alert("Please fill all fields")
return
}

const numericAge = parseInt(age, 10)
if (Number.isNaN(numericAge) || numericAge <= 0 || numericAge > 120) {
alert("Please enter a valid age.")
return
}

const ageGroup = numericAge < 18 ? "below_18" : "above_18"

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

}catch(err){
const msg = err?.response?.data?.detail || err?.response?.data?.message || "Signup failed. Try again."
alert(Array.isArray(msg) ? msg[0] : msg)
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
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
className="me-input w-full mb-3"
placeholder={t("email")}
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="number"
min="1"
max="120"
className="me-input w-full mb-3"
placeholder={t("age_group")}
value={age}
onChange={(e)=>setAge(e.target.value)}
/>

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
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={handleSignup}
className="me-btn w-full py-2"

>

{t("signup")} </button>

<p className="mt-4 text-center">
{t("have_account")} <Link to="/login" className="text-[#0f766e] font-semibold hover:underline">{t("login")}</Link>
</p>

</div>

</div>

)

}

export default Signup
