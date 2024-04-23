import React from 'react'
import Card from '../Components/Card'
import axios, { formToJSON } from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation, json } from 'react-router-dom';

function AddData(props) {
  const navigations = useNavigate();
  const location = useLocation();
  const API = `${props.URL}/api/getModule/`;
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState(new FormData());
  const [groupData, setGroupData] = useState([]);
  const [mainModule, setMainModule] = useState("");
  const [moduleName, setModuleName] = useState(location.state.module);
  const [isSubModule, setIsSubModule] = useState(false);
  const [SubModuleData, setSubModuleData] = useState([]);
  const [mainFields, setMainFields] = useState([]);
  const [isAddable, setIsAddable] = useState(false);
  const [calculated, setCalculated] = useState(0);
  const [valid, setVaild] = useState(false);
  const [calculatedFields, setCalculatedFields] = useState([]);


  console.log("formData", formData)
  // Utility Functions
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // calculate Function
  const calculate = (fieldname, id, formula) => {
    let exp = formula;
    let operands = {};


    fields.map((field) => {
      let key = `${id}_${field.name}`;
      if (formData.get(key) != undefined) {
        operands[key] = formData.get(key);
      }
      console.log(operands)

      if (exp.includes(field.name)) {
        try {
          exp = exp.replace(`{${field.name}}`, operands[key] != undefined ? operands[key] : "");
        } catch (e) {
          console.log(e)

        }

      }

    })

    console.log("exp", exp)
    let result = eval(exp);
    //formData.set(`${id}_${fieldname}`, result)
    console.log("result", result);


    return result;

  }

  // Evaluate Function
  const evaluate = (expression) => {
    let exp = expression;
    let operands = {};

    fields.map((field) => {
      if (formData.get(field.name) != null) {
        operands[field.name] = formData.get(field.name);
      }
      console.log(operands)

      if (exp.includes(field.name)) {
        try {
          exp = exp.replace(`{${field.name}}`, operands[field.name] != undefined ? operands[field.name] : "");
        } catch (e) {
          console.log(e)
        }

      }

    })

    console.log("exp", exp)
    let result = eval(exp);
    console.log("result", result);

    return result;

  }

  const handleForm = (e, id, name, type, value, isCalculatable) => {

    if (type === 'file' || type === 'image') {
      if (formData.has(`${id}_${name}`)) {
        console.log(e.target.files[0])
        formData.set(`${id}_${name}`, e.target.files[0]);

      } else {
        formData.append(`${id}_${name}`, e.target.files[0]);
      }

    } else {
      if (formData.has(`${id}_${name}`)) {
        formData.set(`${id}_${name}`, value);

      } else {
        formData.append(`${id}_${name}`, value);

      }

    }






  }


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

  const addData = async () => {
    if (!isSubModule) {
      let response = await axios.post(`${API}?moduleName=${location.state.module}`, formData)
        .then((res) => {
          console.log("res", res.data);

          window.location.reload();
        })
        .catch((err) => {
          console.log("err", err)
        })

    } else {
      console.log("formData", formData)
      let response = await axios.post(`${API}?moduleName=${location.state.module}`, formData).then((res) => {
        console.log("res", res.data);
        window.location.reload();
      }).catch((err) => {
        console.log("err", err)
      })
    }

  }


  useEffect(() => {
    let subModule = false
    axios.get(`${API}?moduleName=${location.state.module}`)
      .then((res) => {
        console.log("res", res.data.fields);
        let response = res.data.fields;
        subModule = res.data.isSubModule // Remove duplicate declaration
        console.log("isSubModule", subModule)
        let Calculatable = [];
        let arrayOfFields = [];
        console.log("response", response);

        response.map((field) => {
          if (field.isCalculatable === "Yes") {
            Calculatable.push(field.name);
          }
          console.log("field", field.type, field.dropdownValues);
          arrayOfFields.push({ name: field.name, value: "", type: `${field.type == "Dropdown" ? "select" : field.type}`.toLowerCase(), dropdowns: field.dropdownValues, isCalculatable: field.isCalculatable, formula: field.formula });
        });
        console.log("arrayOfFields", arrayOfFields);

        if (subModule) {
          console.log("fields", res.data.MainModuleFieldNames);
          console.log("mainModule", res.data.mainModule);
          axios.get(`${props.URL}/api/getModuleData/?moduleName=${res.data.mainModule}`).then((res) => {
            console.log("data", res.data.data);
            setSubModuleData([...res.data.data]);

          }).catch((err) => {
            console.log("err", err);
          })

        }
        setCalculatedFields(Calculatable);
        setMainModule(res.data.mainModule);
        setMainFields(res.data.MainModuleFieldNames);
        setFields(arrayOfFields);
        setIsSubModule(subModule);

      })
      .catch((err) => {
        console.log("err", err)
      })



  }, [isSubModule]);

  return (
    <Card Title="Add Data">
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          gap: 20
        }}
      >
        <button onClick={() => { navigations(-1) }} className='btn btn-primary'>Back</button>
      </div>

      {!isSubModule ?
        <>
          <form action='' onSubmit={
            (e) => {
              console.log("e", e)
            }
          }>
            <div className='row'>
              {fields.length !== 0 && fields.map((field, index) => {

                if (`${field.isCalculatable}`.toLowerCase() !== "yes") {


                  return (

                    <div className='col-md-6' key={index}>
                      <div className="form-group">
                        <label>{Capitalize(field.name)}</label>
                        {field.type === "file" && <input type="file" className="form-control" required={true} onChange={(e) => {
                          if (e.target.validity.valid) {
                            handleFormData(e, field.name, field.type)
                          } else {
                            e.target.setCustomValidity("Please upload a file.");
                            e.target.reportValidity();
                          }

                        }} />}
                        {field.type === "date" && <input type="date" className="form-control" required={true} value={formData.get(field.name)} onChange={(e) => {
                          if (e.target.validity.valid) {
                            handleFormData(e, field.name, field.type, e.currentTarget.value)

                          } else {
                            e.target.setCustomValidity("Please enter a valid date.");

                          }
                        }} />}
                        {field.type === "time" && <input type="time" className="form-control" required={true} onChange={(e) => {
                          handleFormData(e, field.name, field.type, e.currentTarget.value)
                          if (e.target.validity.valid) {
                            handleFormData(e, field.name, field.type, e.currentTarget.value)
                          } else {
                            e.target.className = "form-control is-invalid";
                            e.target.setCustomValidity("Please enter a valid time.");
                            e.target.reportValidity();
                          }
                        }} />}
                        {field.type === "text" && <input type="text" className="form-control" required={true} onChange={(e) => {
                          if (e.target.validity.valid) {
                            handleFormData(e, field.name, field.type, e.currentTarget.value)
                          } else {

                            e.target.setCustomValidity("Please enter a valid text.");
                            e.target.reportValidity();
                          }
                        }} />}
                        {field.type === "number" && <input type="number" required={true} value={formData.get(field.name)} className="form-control" onChange={(e) => {
                          if (e.target.validity.valid && e.target.value != NaN) {
                            handleFormData(e, field.name, field.type, e.currentTarget.value)
                          } else {

                            e.target.setCustomValidity("Please enter a valid number.");
                            e.target.reportValidity();
                          }
                        }} />}
                        {field.type === "select" && <select className="form-control" onChange={(e) => {


                          if (e.target.validity.valid) {
                            handleFormData(e, field.name, field.type, e.currentTarget.value)

                          } else {
                            e.target.setCustomValidity("Please select an option from the dropdown.");
                            e.target.reportValidity();
                          }
                        }}

                        >
                          <option value="">Select</option>
                          {field.dropdowns.map((dropdown, key) => {
                            return (
                              <option key={key} value={dropdown}>{dropdown}</option>
                            )
                          })}
                        </select>}
                        {field.type === "checkbox" && <input type="checkbox" required onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} className="form-control" />}
                        {field.type === "image" && <input type="file" required accept='image/png , image/jpeg ' className="form-control" onChange={(e) => { handleFormData(e, field.name, field.type) }} />}
                      </div>
                    </div>


                  )
                }

              })}
            </div>
            <br />
            <input disabled={isAddable} onClick={
              (e) => {
                let formvalid = false;
                fields.map((field) => {

                  if (field.isCalculatable === "Yes" && field.module === location.state.module) {
                    try {
                      let result = evaluate(field.formula);
                      formData.set(field.name, result);
                    } catch (e) {
                      console.log(e)
                      alert("Please enter all the fields.")
                      formvalid = false;
                    }
                  } else {
                    if (formData.get(field.name) == "" || formData.get(field.name) == undefined) {
                      formvalid = false;
                    } else {
                      formvalid = true;
                    }
                  }
                })
                if (formvalid) {
                  addData();
                } else {
                  alert("Please fill all the fields.")
                }
              }

            } style={{ display: fields.length == 0 ? "none" : "inherit" }} value="Add" className='btn btn-primary' />
          </form>
        </>

        :
        <>

          <div className='table-reponsive'>
            <table className='table '>
              <thead style={{
                color: "black"
              }}>
                <tr>
                  {fields.map((field, index) => {
                    if (field.isCalculatable === "Yes" && field.module !== location.state.module) {
                      return (
                        null
                      )
                    }
                    return (
                      <th key={index}>{Capitalize(field.name)}</th>
                    )
                  })}
                </tr>
              </thead>
              <tbody
                style={{
                  color: "black"
                }}
              >
                {SubModuleData.length !== 0 && SubModuleData.map((data, index) => {

                  return (
                    <tr key={index}>
                      {mainFields.map((field, index) => {

                        console.log("field", field)
                        if (typeof data[field] === 'object') {
                          let fileName = Object.keys(data[field])[0];
                          return (
                            <td key={index}>{data[field][fileName]}</td>
                          )
                        }
                        return (
                          <td key={index}>{data[field]}</td>
                        )
                      })}
                      {fields.map((field, Fieldindex) => {

                        if (!mainFields.includes(field.name)) {

                          if (field.isCalculatable === "Yes") {
                            console.log(field.name, field.isCalculatable)
                            if (formData.has(`${data.id}_${field.name}`)) {
                              formData.set(`${data.id}_${field.name}`, `${field.type}`.toLowerCase() === "number" ? 0 : "");
                            } else {
                              formData.append(`${data.id}_${field.name}`, `${field.type}`.toLowerCase() === "number" ? 0 : "");
                            }

                            return (
                              null
                            )

                          } else {
                            return (
                              <td key={Fieldindex}>
                                {field.type === "file" && <input type="file" className="form-control"
                                  onBlur={(e) => {
                                    console.log("e", e)
                                    if (e.target.validity.valid) {
                                      handleForm(e, data.id, field.name, field.type);
                                    } else {
                                      e.target.reportValidity();

                                    }
                                  }}
                                  onChange={(e) => { handleForm(e, data.id, field.name, field.type) }} required={true} />}
                                {field.type === "date" && <input type="date" className="form-control" value={formData.get(field.name)}
                                  onBlur={(e) => {
                                    console.log("e", e)
                                    if (e.target.validity.valid) {
                                      handleForm(e, data.id, field.name, field.type, e.currentTarget.value);
                                    } else {

                                      if (e.target.value == undefined) {
                                        e.target.setCustomValidity("Please enter a valid date.");
                                        e.target.reportValidity();

                                      }
                                    }
                                  }}
                                  required={true} />}


                                {field.type === "time" && <input type="time" className="form-control"
                                  onBlur={(e) => {
                                    console.log("e", e)
                                    console.log("e", e.target.validity.valueMissing)
                                    if (e.target.validity.valid) {
                                      handleForm(e, data.id, field.name, field.type, e.currentTarget.value);
                                    }
                                    else {
                                      e.target.setCustomValidity("Please enter a valid time.");
                                      e.target.reportValidity();

                                    }
                                  }}
                                  required={true} />
                                }


                                {field.type === "text" && <input type="text" className="form-control"
                                  onBlur={(e) => {

                                    if (e.target.validity.valid) {

                                      handleForm(e, data.id, field.name, field.type, e.currentTarget.value);

                                    } else {
                                      if (e.currentTarget.value == "" || e.currentTarget.value == undefined) {
                                        e.target.toggleAttribute("required");
                                        e.target.setCustomValidity("Please enter a valid text.");
                                        e.target.reportValidity();
                                      }

                                    }
                                  }} required={true} />}


                                {field.type === "number" && <input type="number" value={formData.get(`${data.id}_${field.name}`)}
                                  onBlur={(e) => {
                                    console.log("e", e)
                                    if (e.target.validity.valid) {

                                      handleForm(e, data.id, field.name, field.type, e.currentTarget.value);

                                    } else {

                                      if (e.target.value == NaN || e.target.value == undefined) {

                                        e.target.setCustomValidity("Please enter a valid number.");
                                        e.target.reportValidity();
                                      }

                                    }
                                  }}
                                  className="form-control"

                                  required={true} />}

                                {field.type === "select" && <select className="form-control"
                                  onBlur={(e) => {
                                    console.log("e", e)
                                    if (e.target.validity.valid) {
                                      handleForm(e, data.id, field.name, field.type, e.currentTarget.value);

                                    } else {
                                      e.target.setCustomValidity("Please select an option from the dropdown.");
                                      e.target.reportValidity();

                                    }
                                  }}
                                  required={true}>
                                  <option value="">Select</option>
                                  {field.dropdowns.map((dropdown, key) => {
                                    return (
                                      <option key={key} value={dropdown}>{dropdown}</option>
                                    )
                                  })}
                                </select>}

                                {field.type === "checkbox" && <input type="checkbox"
                                  onBlur={(e) => {
                                    console.log("e", e)
                                    if (e.target.validity.valid) {
                                      handleForm(e, data.id, field.name, field.type, e.currentTarget.value)

                                    } else {
                                      e.target.setCustomValidity("Please check this box if you want to proceed.");
                                      e.target.reportValidity();

                                    }
                                  }}

                                  className="form-control" required />}
                              </td>
                            )
                          }


                        }
                      })}
                    </tr>
                  )
                })}

              </tbody>
            </table>
          </div>
          <button
            type="submit"
            disabled={SubModuleData.length == 0 ? true : false && formData.size == 0 ? true : false}
            onClick={
              (e) => {
              
                let formvalid = true;
                SubModuleData.map((data, index) => {
                  fields.map((field) => {
                    if (field.isCalculatable === "Yes" && field.module !== location.state.module) {
                      try {
                        let result = calculate(field.name, data.id, field.formula);
                        formData.set(`${data.id}_${field.name}`, result);
                      } catch (e) {
                        console.log(e)
                        alert("Please enter a valid formula");
                        formvalid = false;
                      }
                    }
                  })
                })
                if (formvalid) {
                  addData();
                }
              }
            }
            className='btn btn-primary'>Submit</button>

        </>

      }
    </Card>

  )
}

export default AddData