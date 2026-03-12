import { useEffect,useState } from "react"
import API from "../services/api"

function Counselor(){

const [counselors,setCounselors] = useState([])

useEffect(()=>{

API.get("/counselors").then(res=>{
setCounselors(res.data)
})

},[])

return(

<div className="p-6 lg:p-10">

<h1 className="text-3xl font-bold mb-6">
Available Counselors
</h1>

{counselors.map((c,i)=>(

<div key={i} className="me-card p-5 mb-4">

<h2 className="font-bold">{c.name}</h2>

<p className="text-sm text-[#F5F9FF]/70">{c.city}</p>

<p className="text-sm text-[#F5F9FF]/85">{c.phone}</p>

<a
href={`tel:${c.phone}`}
className="text-[#8AD7FF] font-semibold hover:underline"
>
Call Counselor
</a>

</div>

))}

</div>

)

}

export default Counselor