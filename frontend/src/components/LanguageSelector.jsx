import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

function LanguageSelector(){

const { i18n } = useTranslation()
const [language, setLanguage] = useState(localStorage.getItem("language") || "en")

useEffect(() => {
  const saved = localStorage.getItem("language")
  if (saved && saved !== i18n.language) {
    i18n.changeLanguage(saved)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

return(

<select
  className="me-select"
  value={language}
  onChange={(e) => {
    const lng = e.target.value
    setLanguage(lng)
    i18n.changeLanguage(lng)
    localStorage.setItem("language", lng)
  }}
>

<option value="en">English</option>
<option value="hi">Hindi</option>
<option value="mr">Marathi</option>

</select>

)

}

export default LanguageSelector