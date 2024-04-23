import React from 'react'
import { useParams } from 'react-router-dom'
import Card from './Card'
import axios from 'axios'
import TimelineEvent from './TimelineEvent'
import Timeline from './Timeline'

const ViewDetails = (props) => {
    const param = useParams()
 /* let buses= props.routes  */
    let buses = [
        { title: "manavalanagar", description: "8.55pm" },
        { title: "ondikuppam", description: "9pm" }
    ]
    console.log(param)
    const fetchDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/${param.category}/${param.Id}`, {
                params: {
                    id: param.Id
                }
            }).
                console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card Title={param.category} >
            <div className="row">
               <p>  {param.category}</p> 
                           </div>
            
            { param.category === "bus" ? <div  className="timeline">
                <Timeline /> 
            </div>
 : null}
            
        </Card>
    )
}

export default ViewDetails