import {Bar} from "react-chartjs-2"

function Dashboard(){

const data = {
labels:["Happy","Sad","Angry","Neutral"],
datasets:[
{
label:"Mood Count",
data:[5,2,1,3]
}
]
}

return(

<div className="me-card p-6">

<h2 className="text-xl font-bold mb-4">Mood Analytics</h2>

<Bar data={data}/>

</div>

)

}

export default Dashboard