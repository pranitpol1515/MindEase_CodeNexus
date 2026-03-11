import { useNavigate } from "react-router-dom"

function MoodScanner(){

const navigate = useNavigate()

return(

<div className="p-0">

<h2 className="font-bold mb-3">
Scan Face for Mood
</h2>

<p className="text-sm text-[#F5F9FF]/75">Camera emotion detection will run here.</p>

<button
onClick={()=>navigate("/scanner")}
className="me-btn px-4 py-2 mt-3"
>
Start Scan
</button>

</div>

)

}

export default MoodScanner