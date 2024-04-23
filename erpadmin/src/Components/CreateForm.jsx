import React, { useState } from 'react';
import Header from '../components/Header';
import FormGroup from '../components/FormGroup';
import axios from 'axios';
import Card from './Card';

const CreateForm = (props) => {
  const form= new FormData();
  console.log(props.fields);
  /* 
  This component is used to Create a Forrm
  which can be reused in any part of the application
  props : 
    header : String
    description : String
    formTitle : String
    url : String (API URL)
    fields : Array of Objects
      name : String (eg: ID)
      type : String (eg: text, number, file, date, phone, email, textarea)

  
  */
  /*  API   */
  const sendData = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/bus',
        form
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(form);
  };


  const handleCallBack = (event,name,value, type) => {  
    console.log(name,value,type)
    if (type==='file'){
      if (form.has(name)){
        form.set(name, event.target.files[0]);
      }else {
        form.append(name, event.target.files[0]);
      }
    }else {
        if (form.has(name)){
         form.set(name, value);
        }else {
          form.append(name, value);
        }
    }
  }

return (
  <div>
    <Header name={props.header} description={props.description} />

   
    <Card Title={props.formTitle} >
      {props.fields.map((field, index) => (
        <div className=''>
        <FormGroup
        key={index}
          FieldlName={field.name}
          type={field.type}
          parentCallback={handleCallBack}
         placeholder = {field.placeholder} />
 </div>
      ))}
      <button className="btn btn-primary" type="button" onClick={sendData}>
        Submit
      </button>
    
    </Card>
  </div>
);
};

export default CreateForm;
