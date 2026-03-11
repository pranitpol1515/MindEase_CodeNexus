import {useState} from "react"
import API from "../services/api"

function MoodTracker(){

const [mood,setMood] = useState("")

const save = async ()=>{

await API.post("/mood",{mood})

alert("Mood saved")

}

return(

<div className="me-card p-6">

<h2>Mood Tracker</h2>

<select className="me-select mt-3" onChange={(e)=>setMood(e.target.value)}>

<option>Happy</option>
<option>Sad</option>
<option>Stressed</option>

</select>

<button className="me-btn px-4 py-2 mt-4" onClick={save}>
Save
</button>

</div>

)

}

export default MoodTracker