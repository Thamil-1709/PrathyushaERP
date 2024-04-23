import React from 'react'
import { Link } from 'react-router-dom'
import "./Styles/Card.css"


function Card(props) {
  /*
  This component is used to create a card
  which can be reused in any part of the application
  props : 
    Title : String
    Description : String
  Children : Component
  */

  return (
    <div className='text-dark col-12 grid-margin stretch-card'>
      <div className='card'>
        <div className='card-body'>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',

          }}>
            <h4 style={{
              margin: 0,
            }} className='card-title'>{props.Title}</h4>
            {props.Link !== undefined &&  <Link
          to = {{
            pathname: props.Link.pathname,

          }}
          state={{data:props.Link.info.data}}
  
          className='btn btn-primary'>
            Back
            </Link>
       }
          </div>
          <p className='card-description'>{props.Description} </p>
          <br />
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Card