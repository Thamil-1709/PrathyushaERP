import React from 'react';
;

function FormGroup(props) {


  const onTrigger = (event) => {
   
    props.parentCallback(event,props.FieldlName,event.target.value,props.type);
    event.preventDefault();
  };

  return (
    <div className='form-group text-dark'>
      <label htmlFor={props.FieldlName}>{props.FieldlName}</label>
      <input 
      style={{border:'1px solid #ced4da' }}
        type={props.type}
        className="form-control"
        id={props.FieldlName}
        placeholder={props.Placeholder}
        onChange={onTrigger}
    
      />  
    </div>
  );
}

export default FormGroup;
