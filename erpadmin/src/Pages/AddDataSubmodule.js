import React from 'react'
import Card from '../Components/Card'
import { useState, useEffect ,useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';



export const AddDataSubmodule = (props) => {
  const location = useLocation();
  const moduleName = location.state?.module;
  const [Fields, setFields] = useState([]);
  const [Data, setData] = useState([]);
  const [ModuleFields, setModuleFields] = useState([]);
  const [formData, setFormData] = useState(new FormData()); 
  const [MainModuleField, setMainModuleField] = useState([]);


  //Utility functions
  const Capitalize = (str) => {
    
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function extractTextInBraces(text) {
    const regex = /{([^}]*)}/g;
    const matches = [];
    let match;

    while ((match = regex.exec(text))) {
        matches.push(match[1]);
    }

    return matches;
}


  // Calculate Value 
  const handleFormData = (e, name, type, value) => {

    if (type === 'file' || type === 'image') {
      if (formData.has(name)) {
        console.log(e.target.files[0])
        formData.set(name, e.target.files[0]);

      } else {
        formData.append(name, e.target.files[0]);
      }
    } else {
      if (formData.has(name)) {
        formData.set(name, value);

      } else {
        formData.append(name, value);

      }

    }


    console.log("formData", formData)

  }


  useEffect(() => {
    axios.get(`${props.URL}/api/UpdateSubModuleData/?moduleName=${moduleName}`).then((res) => {
      console.log(res.data);
      console.table(res.data.data);
      console.log(res.data.moduleInfo.MainModuleFieldNames);
      console.log(res.data.fields);
      console.log(res.data.moduleInfo.fields);
      console.log(typeof (res.data.data))
      setData([...res.data.data]);
      setFields([...res.data.fields]);
      setModuleFields([...res.data.moduleInfo.fields]);
      setMainModuleField([...res.data.moduleInfo.MainModuleFieldNames]);




    }).catch((err) => {
      console.log(err);
    })

  }, []);



  return (
    <Card Title="Add Data ">
      <div className='table-responsive'  >
        <table className='table ' style={{
          color: 'black'
        }}>
          <thead>
            <tr>
              {console.log(Fields)}
              {Fields.map((field, index) => {

                return <th key={index} style={{
                  color: 'black'
                }}>{Capitalize(field)}</th>
              })}
            </tr>
          </thead>
          <tbody>

            {Data.map((data, index) => {
              console.log(data.id)
              return (
                <tr key={index}>
                  {Fields.map((field, index) => {
                    let message = "";
                    console.log("field is name ", field)
                   

                    if (typeof (data[field]) === 'object') {

                      
                      let object = data[field];
                      if (object["fileName"] !== undefined) {
                        return <td key={index}>{object["fileName"]}</td>
                      }
                      if (object.isCalculatable ==="Yes") {
                       
                        return null;
                      }

                    


                      return <td key={index}>
                        {object.type === "Text" &&
                          <input type="text" className="form-control"
                            required={true}
                            placeholder={object.value == "-" || object.value=="" ? `Enter ${object.name}` : object.value}
                           
                            onBlur={(e) => {

                               if( e.target.value !== undefined && e.target.value !== null ){
                                handleFormData(e, object.name, object.type, e.target.value)
                               }else{
                                formData.delete(object.name);
                                  
                               }
                              
                            }
                            }

                          />}
                        {object.type === "Number" &&
                          <input type="number" className="form-control"
                            required={true}
                            
                            placeholder={object.value === "-" || object.value=="" ? `Enter ${object.name}` : object.value}
                            value={formData.get(object.name)}
                            onChange={(e) => {
                              if (e.currentTarget.value !== NaN){
                                handleFormData(e, `${data.id}_${object.name}`, object.type, e.currentTarget.value)
                              }
                              if (e.currentTarget.value === NaN){
                                if(formData.has(`${data.id}_${object.name}`)){
                                  formData.delete(`${data.id}_${object.name}`);
                                }
                              }
                            }}
                          />}

                        {object.type === "Date" && 
                        <input type="date" className="form-control"
                        onChange={(e) => {
                         if(e.currentTarget.value !== undefined && e.currentTarget.value !== null){
                          e.target.value = e.currentTarget.value;                                         
                          handleFormData(e, `${data.id}_${object.name}`, object.type, e.currentTarget.value);
                          
                        }else{
                          formData.delete(`${data.id}_${object.name}`);
                         
                        }
                        }}   
                        
                        />}

                        {object.type === "Dropdown" && <select
                          placeholder={object.value === "-" || object.value=="" ? `Enter ${object.name}` : object.value}
                          className="form-control"
                          required={true}
                          onChange={(e) => {
                            if (e.currentTarget.value !== ""){
                              handleFormData(e, `${data.id}_${object.name}`, object.type, e.currentTarget.value)
                            }
                          }}
                        >
                          <option value="">select</option>
                          {object.value.map((option, index) => {
                            return <option key={index}>{option}</option>
                          })}
                        </select>}
                        {object.type === "Image" && <input type="file" className="form-control" 

                        onChange={(e) => {handleFormData(e, `${data.id}_${object.name}`, object.type, e.target.files[0])
                      }
                      }
                        />}
                        
                      </td>
                    }
                    return <td key={index}>{data[field]}</td>
                  })}
                </tr>
              )

            })}



          </tbody>

        </table>
          <button className="btn btn-primary" onClick={(e) => {
            let valid  = true;
           if(formData.keys().length === 0 ){
              valid = false;
           }else{
              
              let CalculatableFields = [];
              ModuleFields.forEach((field) => {
                console.log(field);
                if (field.isCalculatable === "Yes"){
                  CalculatableFields.push(field);
                }
              });
              if (CalculatableFields.length !== 0){
                let Ids = []; 
                formData.forEach((value, key) => {
                  if (key.includes("_") && Ids.includes(key.split("_")[0]) === false){
                    Ids.push(key.split("_")[0]);
                  }
                });
                console.log(Ids);
                
                CalculatableFields.forEach((field) => { 
                  let formula = field.formula;
                  let operands = extractTextInBraces(formula);
                  
                 Ids.forEach((id) => {
                    let exp = formula;
                    let filled = false;
                   
                    
                    operands.forEach((operand) => {
                      
                      if (MainModuleField.includes(operand)){
                        let value = Data.find((data) => data.id === id)[operand];
                          exp = exp.replace(`{${operand}}`, value);
                      }else{
                        let value = formData.get(`${id}_${operand}`);
                        if (value !== null && value !== undefined && value !== ""){
                          exp = exp.replace(`{${operand}}`, value);
                          filled = true;
                        }else{
                          filled = false;
                          
                        }
                      }

                     
                    }  );

                   if (filled ){
                    try{
                      let result = eval(exp);
                      console.log(result);
                      if (formData.has(`${id}_${field.name}`)){
                        formData.set(`${id}_${field.name}`, result);
                      }else{
                        formData.append(`${id}_${field.name}`, result);
                      }
                      valid = true;
                    }
                  
                    catch(err){
                      
                      alert("Please fill all the fields");
                      valid = false;
                    }
                   }
                    
                 });
               
                });


              }
            
           }
           console.log(formData);

           if(valid){ 
              axios.post(`${props.URL}/api/UpdateSubModuleData/?moduleName=${moduleName}`, formData).then((res) => {
                console.log(res.data);
              }).catch((err) => {
                console.log(err);
              })
           }
            
             
          } }>update</button>
      </div>

    </Card>
  )
}
