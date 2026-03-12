import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import LanguageSelector from "../components/LanguageSelector"

function CounselorApply() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    qualification: "",
    license_number: "",
    city: "",
    phone: "",
    password: "",
  })

  const submit = async () => {
    try {
      await API.post("/auth/counselor/apply", form)
      alert("Application submitted. Wait for admin approval.")
      navigate("/counselor/login")
    } catch {
      alert("Could not submit application. Please check details.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="me-card p-8 w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Counselor Application</h2>
          <LanguageSelector />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <input className="me-input" placeholder="Name" value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))}/>
          <input className="me-input" placeholder="Email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))}/>
          <input className="me-input col-span-2" placeholder="Qualification" value={form.qualification} onChange={(e)=>setForm(f=>({...f,qualification:e.target.value}))}/>
          <input className="me-input col-span-2" placeholder="License number" value={form.license_number} onChange={(e)=>setForm(f=>({...f,license_number:e.target.value}))}/>
          <input className="me-input" placeholder="City" value={form.city} onChange={(e)=>setForm(f=>({...f,city:e.target.value}))}/>
          <input className="me-input" placeholder="Phone" value={form.phone} onChange={(e)=>setForm(f=>({...f,phone:e.target.value}))}/>
          <input type="password" className="me-input col-span-2" placeholder="Set password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))}/>
        </div>

        <button onClick={submit} className="mt-5 me-btn w-full py-2">
          Submit application
        </button>

        <p className="mt-4 text-center">
          Already approved? <Link className="text-[#8AD7FF] font-semibold hover:underline" to="/counselor/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default CounselorApply

