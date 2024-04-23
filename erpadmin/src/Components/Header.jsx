import React from 'react'

function Header(props) {
  console.log(props);
  return (
    <div className='text-dark'>
        <h1 className='mb-1 font-weight-bold'>{props.name}</h1>
        <p className='text-small mb-0'>{props.description}</p>
      
    </div>
  )
};

export default Header;
