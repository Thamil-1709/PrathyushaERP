import React, { useEffect, useState } from 'react'
import Card from '../Components/Card'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ViewModuleData = (props) => {
  const location = useLocation();
 
  const moduleName = location.state?.moduleName;

  const DataId = location.state?.id;
  const API = `${props.URL}/api/getModuleData/?moduleName=${moduleName}`;
  const [updatedData, setUpdatedData] = useState(new FormData());
  const [moduleData, setModuleData] = useState([]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const isSubModule = location.state?.isSubModule;
  const[mainModuleData,setMainModuleData]=useState([]);
  const [MainModuleFieldNames, setMainModuleFieldNames] = useState(location.state?.MainModuleFieldNames);
  const [mode, setMode] = useState(location.state?.mode);
  useEffect(() => {
    let Fields = [];
    axios.get(`${API}&filter=${JSON.stringify({ id: isSubModule?location.state?.rec_id:DataId })}&fields=yes`)
      .then((res) => {
     
        console.log("res", DataId);
        
        if (updatedData.has("id")) {
          updatedData.set("id", DataId);
        } else {
          updatedData.append("id", DataId);
        }
        if (updatedData.has("moduleName")) {
          updatedData.set("moduleName", moduleName);
        } else {
          updatedData.append("moduleName", moduleName);
        }                     
       
        let arrayOfFields = [];
        res.data.moduleData.map((field) => {
       if (field.subModule === undefined){
        console.log(isSubModule)
        if (`${field.type}`.toLowerCase() !== 'file' ) {
         if(field.type === 'Image'){
          field.path = `${props.URL}/api/getFile/?moduleName=${moduleName}&fileName=${field.value.fileName}`;
          console.log("image",field.path)
         }
          
          arrayOfFields.push(field);

        } else {
          let value = field.value;
          let { fileName } = { ...value };
          field.path = `${props.URL}/api/getFile/?moduleName=${moduleName}&fileName=${fileName}`;
          field.fileName = fileName;
          field.value = "";
          
          arrayOfFields.push(field);
        }
       }
        }
        
        )
        if(isSubModule && location.state?.mainModule && location.state?.MainModuleFieldNames.length>0){
          axios.get(`${props.URL}/api/getModuleData/?moduleName=${location.state?.mainModule}&filter=${JSON.stringify({ id:DataId })}`).then(
            (res)=>{
             
            console.log("res",res.data.data)

             Object.keys(res.data.data).map((key)=>{
               if (location.state?.MainModuleFieldNames.includes(key)){
                setMainModuleData((prev)=>[...prev,{name:key,value:res.data.data[key]}]);
  
              }
              
              })
          
            }
          )
         }

        
        
        setModuleData(arrayOfFields);

        //console.log("data", res.data.data)
        // console.log("fields", Fields)
      
      
      })
      .catch((err) => {
        console.log("err", err)
      })
 
     

  }, []);



  const handleUpdate = () => {
    console.log("updatedData", updatedData);

    if (isDataUpdated) {
      axios.put(`${props.URL}/api/updateModuleData/?moduleName=${moduleName}`, updatedData)
        .then((res) => {
          console.log("res", res.data);

          window.location.reload();
        })
        .catch((err) => {
          console.log("err", err)
        })
      setIsDataUpdated(false);


    }
  }

  const handleFormData = (e, name, type, value) => {
    console.log("name", name)
    console.log("value", value)
    console.log("type", type)
    console.log("e", e.target.files)
    console.log("e", e.target.value)
    if (`${value}`.length > 0) {
      setIsDataUpdated(true);
      if (type === 'file') {
        if (updatedData.has(name)) {
          console.log(name, e.target.files[0])
          console.log("name", name)
          console.log("value", e.target.files)
          updatedData.set(name, e.target.files[0]);
        } else {
          updatedData.append(name, e.target.files[0]);
        }
      } else {

        if (updatedData.has(name)) {
          updatedData.set(name, value);
        } else {
          updatedData.append(name, value);
        }
      }
    }
    console.log("formData", updatedData)
  }

  // Utility Functions
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Card Title={moduleName}


    >

      <div style={{ display: "flex", justifyContent: "right" }}>


        <Link
          to={{
            pathname: '/ViewModule',

          }}
          state={{ data: moduleName }}

          className='btn btn-primary'>
          Back
        </Link>


      </div>

      <br />



      {mode === "view" && <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            flexWrap: 'wrap',
       
            justifyContent: 'space-between',
          }}>
            

            {isSubModule && mainModuleData.map((field, index) => {
              return(
                <div key={index} className='col-md-4' style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <label >{Capitalize(field.name)}</label>
                    <input className='form-control' readOnly type={field.type} value={field.value}  />
                  </div>
                </div>
                
              )
            })}
          {moduleData.map((field, index) => {
            console.log("field", field)

            if (field.type === "Image"){
              console.log("image",field.path)
              return (
                <div key={index} className='column' style={{ }}>
                
                <p>{field.name}</p>
                <br/>
                    <img src={field.path} alt={field.value.fileName} style={{
                      width: "auto",height:"10rem"
                    }} title={"click to View Image"}
            
                    onClick={
                      ()=>{
                        axios.get(`${props.URL}/api/getFile/?moduleName=${moduleName}&fileName=${field.value.fileName}`).then(
                          (res)=>{
                            console.log("res",res)
                            window.open(
                              `${props.URL}/api/getFile/?moduleName=${moduleName}&fileName=${field.value.fileName}`,
                              '_blank'
                              
                            //    This is what makes it open in a new window.
                            );
                          }
                        )
                      }
                    }/>
                    
                              </div>
              )
            }
            if (`${field.type}`.toLowerCase() === 'file') {

              return (
                <div key={index} className='col-md-4' style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <label >{Capitalize(field.name)}</label>
                    {console.log(field.path)}
                    <a className='btn btn-primary' href={field.path} target="_blank">{field.fileName}</a>

                  </div>
                </div>
              )
            }
            return (
              <div key={index} className='col-md-4' style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <label >{Capitalize(field.name)}</label>
                  {field.type === 'Dropdown' ? <select className='form-control' disabled={true} onChange={(e) => { field.value = e.target.value }}>
                    {field.dropdownValues.map((value, index) => {
                      return <option key={index}>{value}</option>
                    })}
                  </select> : <input className='form-control' readOnly type={field.type} value={field.value} onChange={(e) => { field.value = e.target.value }} />}
                </div>
              </div>
            )
          })}

        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button className='btn btn-primary' onClick={
            () => setMode("edit")
          }>EDIT</button>

        </div>

      </>}
      {mode === "edit" && <>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {moduleData.map((field, index) => {
            console.log("field", field.dropdownValues)

            if (field.type === 'Date') {
              console.log("date", field.value)
            } if (field.type === 'Dropdown') {
              field.type = 'select';

            }
            if (`${field.type}`.toLowerCase() === 'file') {
              field.type = 'file';
            }
            if (field.type === 'Image') {
              return (
                <div key={index} className='col-md-4' style={{ marginBottom: 10 }}>
                
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <label >{Capitalize(field.name)}</label>
                  <input type="file" className="form-control" onChange={(e) => { handleFormData(e, field.name, field.type) }} />
                  </div>
                </div>
                
              )
            }

            return (
              <div key={index} className='col-md-4' style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <label >{Capitalize(field.name)}</label>
                  {`${field.type}`.toLocaleLowerCase() === "file" && (
                    <>
                      <input type="file" className="form-control" onChange={(e) => { handleFormData(e, field.name, field.type) }} />
                      <a className='btn btn-primary' title='filename' style={{ color: "white" }} target="_blank">{field.fileName}</a>
                    </>
                  )}
                  {`${field.type}`.toLocaleLowerCase() === "date" && <input type="date" className="form-control" defaultValue={field.value} onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                  {`${field.type}`.toLocaleLowerCase() === "time" && <input type="time" className="form-control" placeholder={field.value} onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                  {`${field.type}`.toLocaleLowerCase() === "text" && <input type="text" className="form-control" placeholder={field.value} onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                  {`${field.type}`.toLocaleLowerCase() === "number" && <input type="number" className="form-control" placeholder={field.value} onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                  {`${field.type}`.toLocaleLowerCase() === "select" && <select className="form-control" placeholder={field.value} onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }}>
                    {field.dropdownValues.map((dropdown, key) => {
                      return (
                        <option key={key} value={dropdown}>{dropdown}</option>
                      )
                    })}
                  </select>}
                  {field.type === "checkbox" && <input type="checkbox" onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} className="form-control" />}
                </div>
              </div>
            )
          })}

        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>

          <button className='btn btn-primary' onClick={
            () => setMode("view")
          }>View</button> &nbsp;
          <button onClick={handleUpdate} className='btn btn-primary' disabled={!isDataUpdated} >Save</button>
        </div>

      </>}
    </Card>
  )
}

export default ViewModuleData