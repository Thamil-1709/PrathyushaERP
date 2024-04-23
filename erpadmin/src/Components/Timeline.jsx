import React from 'react';
import TimelineEvent from './TimelineEvent';


function Timeline(props) {
    let buses = [
        {title:"manavalanagar",description:"8.55pm"},
        {title:"ondikuppam",description:"9pm"}
    ]
    const randomNumberInRange = (min, max) => {
      return Math.floor(Math.random()
          * (max - min + 1)) + min;
  };
    const colors = ["primary", "success", "danger", "warning", "info", "dark"];
  return (
    <div className="timeline">
      <div className='mt-5'>
     {
      buses.map((bus,index)=>{
        return(
        index%2==0 ? <TimelineEvent key={index} title={bus.title} description={bus.description} order={""} color={colors[randomNumberInRange(0,colors.length)]} />
        : <TimelineEvent key={index} order={"timeline-inverted"} title={bus.title} description={bus.description} color={colors[randomNumberInRange(0,colors.length)]} />
        )
      
      })
     }

      </div>
   
  </div>
  
  );
}

export default Timeline;
