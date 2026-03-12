import { useEffect } from "react"
import { useTranslation } from "react-i18next"

function LanguageSelector() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const saved = localStorage.getItem("language")
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved)
    }
  }, [i18n])

  return (
    <select
      className="me-select"
      value={i18n.language || "en"}
      onChange={(e) => {
        const lng = e.target.value
        i18n.changeLanguage(lng)
        localStorage.setItem("language", lng)
      }}
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
      <option value="mr">मराठी</option>
    </select>
  )
}

export default LanguageSelector