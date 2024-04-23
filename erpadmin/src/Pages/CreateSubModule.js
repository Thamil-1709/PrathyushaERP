import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Card from '../Components/Card'

function CreateModule(props) {
  // api url
  const api = `${props.URL}/api/createModule/`
  // Fields Category
  const [editableFields, setEditableFields] = useState([]);
  const [primaryFields, setPrimaryFields] = useState([]);
  const [filterFields, setFilterFields] = useState([]);
  // Module INFO
  const [module, setModule] = useState('');
  const [mainModule, setMainModule] = useState('');
  const [supportingModules, setSupportingModules] = useState([]);
  const [supportingFields, setSupportingFields] = useState([]);
  const [supportingFieldsName, setSupportingFieldsName] = useState([]);
  const [addedSupportingFields, setAddedSupportingFields] = useState([]);

  const types = ['Text', 'Number'];
  

  //  Fields Info
  const [isDeletable, setIsDeletable] = useState('yes');
 

  const [DropdownValues, setDropdownValues] = useState('');
  const [isCalculatable, setIsCalculatable] = useState('no');
  const [formula, setFormula] = useState('');
  const [fieldsName, setFieldsName] = useState([]);
  const [ModuleFields, setModuleFields] = useState([]);

  const [fields, setFields] = useState(
    { name: '', type: 'Text', category: 'Editable', isFilter: 'No', isDisplay: "No", isCalculatable: isCalculatable, module: module, dropdownValues: [], supportingModule: mainModule }
  );



  // Use Effect to list of modules from the database
  useEffect(() => {
    axios.get(`${props.URL}/api/getModules/?modulelist=yes`)
      .then((res) => {
        let data = res.data.Modules;
        //console.log(data)
        setSupportingModules([...data]);

      }
      ).catch((err) => {
        console.log(err);
      })
  }, [])

  // Utility Functions
  const convertToUpperCase = (text) => {
    return text.toUpperCase();
  };
  const convertToLowerCase = (text) => {
    return text.toLowerCase();
  };


  // To check whether the module exists or not 
  const checkModule = (event) => {
    if (event.target.value !== '') {
      axios.get(api + `?moduleName=${module}`)
        .then((res) => {
          let message = res.data.exist;
          if (message) {
            console.log("Module Already Exists!");
            event.target.style = 'border: 1px solid red;';

          } else {
            event.target.style = 'border: 1px solid green;';
            console.log("Module Doesn't Exist!");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("Error in checking module!");
        })
    }
  };

  // To add a new field to the module
  const handleAddField = (fieldName, fieldType, fieldCategory, isFilter, isDisplay, isCalculatable) => {
    fieldName = fieldName.split(' ').slice().join('_');
    fieldName = fieldName.toLowerCase();
    setFieldsName([...fieldsName, fieldName]);
    console.log("fields", fields);
    let newField = { name: fieldName, type: fieldType, category: fieldCategory, isFilter: isFilter, isDisplay: isDisplay, module: module, isCalculatable: isCalculatable };
    if (fieldCategory === 'Primary') {
      setPrimaryFields([...primaryFields, fieldName]);
    } else {
      setEditableFields([...editableFields, fieldName]);
    }
    if (isFilter === 'Yes') {
      setFilterFields([...filterFields, fieldName]);
    } if (isCalculatable === 'Yes') {
      newField = { ...newField, formula: formula }
    } if (fieldType === 'Dropdown') {
      newField = { ...newField, dropdownValues: fields.dropdownValues }
      setDropdownValues('');
    }
    console.log("newField", newField);
    setModuleFields([...ModuleFields, newField]);

  };
  console.log("ModuleFields", ModuleFields);
  // To remove a field from the module
  const handleRemoveField = (fieldName ) => {

    if (primaryFields.includes(fieldName)) {
      setPrimaryFields(primaryFields.filter((field) => field !== fieldName));
    } 
    if (editableFields.includes(fieldName)) {
      setEditableFields(editableFields.filter((field) => field !== fieldName));
    }
    setModuleFields(ModuleFields.filter((field) => field.name !== fieldName ));
    setFieldsName(fieldsName.filter((field) => field !== fieldName));
    setAddedSupportingFields(addedSupportingFields.filter((field) => field !== fieldName));
  };


  //  On save module
  const createModule = () => {
    if (module === '' && fields.length === 0) {
      alert("Please Enter fields!");
    }
    else {
      alert("Are you Sure Can't Revert Module!");
      try {
        axios.post(api, {
          moduleName: module,
          isDeletable: isDeletable,
          mainModule: mainModule,
          fields: ModuleFields,
          editableFields: editableFields,
          primaryFields: primaryFields,
          filterFields: filterFields,
          MainModuleFieldNames: addedSupportingFields
        }).then((res) => {
          console.log(res.data);
        }).catch((err) => {
          console.log(err);
        })
        // Reset The Fields
        setModule('');
        setFormula('');
        setIsDeletable('yes');
        setEditableFields([]);
        setPrimaryFields([]);
        setFilterFields([]);
        setDropdownValues('');
        setModuleFields([]);
        setSupportingFieldsName([]);
        setAddedSupportingFields([]);
        setFields({ name: '', type: 'Text', category: 'Editable', isFilter: 'No', isDisplay: "Yes", dropdownValues: [], isCalculatable: "No" });
        alert("Module Created!");
        window.location.reload();
      }

      catch (err) {
        console.log(err);
        alert("Error in creating module!");
      }
    }

  }

  return (
    <>
      <Card Title={convertToUpperCase("Create New Sub Module!")}>
        <form className="forms-sample">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label>{convertToUpperCase("Module Name")}</label>
                <input
                  onBlur={checkModule}
                  value={module}
                  onChange={(e) => {
                    e = e.target.value.split(' ').slice().join('_');
                    e.toLowerCase();
                    setModule(e.toLowerCase())
                  }}
                  type="text"
                  className="form-control"
                  placeholder="Module Name"
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label>{convertToUpperCase("Values are deletable?")}</label>
                <select onChange={(e) => {
                  setIsDeletable(e.target.value)
                }} className="form-control"
                  value={isDeletable}
                  style={{ padding: 13.5 }}>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </div>


          <div className="row" style={{ alignItems: "center" }}>
            <div className='col-md-3'>
              <div className="form-group">
                <label>{convertToUpperCase("select main module")}</label>
                <select onChange={(e) => {
                  setMainModule(e.target.value)
                }} className="form-control"
                  value={mainModule}
                  disabled={addedSupportingFields.length === 0 ? false : true}
                  style={{ padding: 13.5 }}>
                  <option>select</option>
                  {
                    supportingModules.map((data, index) => {
                      return (
                        <option key={index}>{data}</option>
                      )
                    })}
                </select>

              </div>
            </div>

            <div className="col-md-3">
              {
                mainModule !== '' &&  (
                  <button
                    disabled={addedSupportingFields.length === 0 ? false : true}
                    onClick={(e) => {
                      if (mainModule === '') {
                        return alert("Please fill all fields!");
                      }
                      if (mainModule === "select") {
                        return alert("Please select a module!");
                      } else {
                        axios.get(`${props.URL}/api/getModule/?moduleName=${mainModule}`)
                          .then((res) => {
                            let data = res.data.fields;
                            /*
                             data.map((field, index) => {
                               console.log("field", field.name);
                               if (supportingFieldsName.includes(field.name) === false) {
                                 console.log("field", field);
                                 console.log("field", supportingFields);
                                 setSupportingFields([field]);
                                 setSupportingFieldsName([...supportingFieldsName, field.name]);
                                
                               } 
                             })
                            */
                            data.map((field, index) => {
                              supportingFieldsName.push(field.name);
                            })
                            setSupportingFieldsName([...supportingFieldsName]);
                            setSupportingFields([...data]);
                  
                            console.log("supportingFields", supportingFields);
                          })
                          .catch((err) => {
                            console.log(err);
                          })
                      }
                      e.preventDefault();

                    }}
                    className="btn btn-primary btn-icon-text" style={{ textAlign: "center", alignItems: "center", display: "flex", justifyContent: "center", width: "100px" }}>

                    {/* <i className="mdi mdi-file-check btn-icon-prepend" /> */}
                    
                      fetch
                    
                  </button>
                )}
            </div>
          </div>
          <br />
          <div className="row" style={{ gap: "1rem" }}>
            {supportingFields.map((data, index) => {

              return (
                <div key={index}
                  className="btn btn-outline-primary btn-fw"
                  onClick={() => {
                    if (fieldsName.includes(data.name) === true) {
                      alert("Field Name Already Exists!")
                    } else {
                      setFieldsName([...fieldsName, data.name]);
                      if (data.category === "Primary") {
                        setPrimaryFields([...primaryFields, data.name]);
                      } else {
                        setEditableFields([...editableFields, data.name]);
                      } if (data.isFilter === "Yes") {
                        setFilterFields([...filterFields, data.name]);
                      } if (data.isCalculatable === "Yes") {
                        setFormula(data.formula);
                      }
                      console.log("data", data);
                      setModuleFields([...ModuleFields, { ...data, subModule: "yes" }]);
                      setAddedSupportingFields([...addedSupportingFields, data.name]);

                    }
                  }}>
                  {data.name}
                </div>
              )
            })}
          </div>
          <br />
          {
            primaryFields.length !== 0 && (
              <div>
                <h6 className="card-title" style={{ fontSize: 16 }}>{convertToUpperCase("Field List")}</h6>
                <p className="card-description" style={{ color: "black" }}>{convertToUpperCase("Primary fields:")}</p>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 10, flexWrap: "wrap" }}>
                  {primaryFields.map((field, index) => (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>

                      <button key={index}
                      title=" Click To Remove Field"
                        onClick={(e) => {
                        
                  
                          handleRemoveField(field,"Primary")
                          e.preventDefault();
                        }}
                        className="btn btn-outline-primary btn-fw">
                        {field}
                      </button>

                      {/*
                        field.dropdownValues !== "" && (
                          field.dropdownValues?.split(',').map((value, index) => {
                            return (
                              <div key={index} className="btn btn-outline-primary btn-fw" style={{ color: "green", borderColor: "green" }}>
                                {value}
                              </div>
                            )
                          }
                          )
                        )
                        */}
                    </div>))}
                </div>

              </div>
            )}

          {editableFields.length !== 0 && (
            <div>
              <br />
              <p className="card-description" style={{ color: "black" }}>{convertToUpperCase("Editable fields:")}</p>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 10, flexWrap: "wrap" }}>
                {editableFields.map((field, index) => (
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>

                    <button key={index}
                     title=" Click To Remove Field"
                      onClick={(e) => {
                        handleRemoveField(field)
                        e.preventDefault();
                      }}
                      className="btn btn-outline-primary btn-fw">
                      {field}
                    </button>

                    {/*
                      field.dropdownValues !== "" && (
                        field.dropdownValues?.split(',').map((value, index) => {
                          return (
                            <div key={index} className="btn btn-outline-primary btn-fw" style={{ color: "green", borderColor: "green" }}>
                              {value}
                            </div>
                          )
                        }
                        )
                      )
                      */ }

                  </div>))}
              </div>

            </div>
          )}

          {/*filterFields.length !== 0 && (
            <div>
              <br />
              <p className="card-description" style={{ color: "black" }}>{convertToUpperCase("Filter fields:")}</p>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 10, flexWrap: "wrap" }}>
                {filterFields.map((field, index) => (
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>

                    <div key={index} className="btn btn-outline-primary btn-fw">
                      {field.name}
                    </div>

                    {
                      field.dropdownValues !== "" && (
                        field.dropdownValues?.split(',').map((value, index) => {
                          return (
                            <div key={index} className="btn btn-outline-primary btn-fw" style={{ color: "green", borderColor: "green" }}>
                              {value}
                            </div>
                          )
                        }
                        )
                      )
                    }
                  </div>))}
              </div>


            </div>
                  )*/}

          {
            primaryFields.length !== 0 || editableFields.length !== 0 || filterFields.length !== 0 ?
              <>
                <br />
                <br />
              </>
              : null
          }

          <h5 className="card-title" style={{ fontSize: 16 }}>{convertToUpperCase("Add New Field")}</h5>
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label>{convertToUpperCase("Field Name")}</label>
                <input
                  onBlur={() => {
                    if (fieldsName.includes(fields.name)) {
                      alert("Field Name Already Exists!")
                    }
                  }}
                  onChange={(e) => {
                    setFields({ ...fields, name: e.target.value })
                  }}
                  value={fields.name}
                  type="text"
                  className="form-control"
                  placeholder="Field Name"
                />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label>{convertToUpperCase("Field Type")}</label>
                <select
                  onChange={(e) => {
                    setFields({ ...fields, type: e.target.value })
                    console.log(fields.type)
                  }}
                  value={fields.type}
                  className="form-control" style={{ padding: 13.5 }}>
                  <option>Text</option>
                  <option>Number</option>
                  <option>Dropdown</option>
                  <option>Date</option>
                  <option>File</option>
                
                  <option>Checkbox</option>
                </select>
              </div>
            </div>

            {fields.type === 'Dropdown' && (
              <div className="col-md-3">
                <div className="form-group">
                  <label>{convertToUpperCase("Drop down values")}</label>
                  <input


                    onChange={(e) => {
                      setDropdownValues(e.target.value);
                     
                    }}
                    value={DropdownValues}
                    type="text"
                    className="form-control"
                    placeholder="Click Add Button to Add Values"
                  />
                  {
                    (DropdownValues !== '' && !DropdownValues.endsWith(",")) && (
                      <button className='btn btn-primary' onClick={(e) => {
                        let values = DropdownValues.split(',');
                        console.log(values);
                        setFields({ ...fields, dropdownValues: values });
                        e.preventDefault();
                      }
                      } >Add</button>
                    )
                  }
                </div>

              </div>)

            }

            <div className="col-md-3">
              <div className="form-group">
                <label>{convertToUpperCase("Field Category")}</label>
                <select
                  onChange={(e) => {
                    setFields({ ...fields, category: e.target.value })
                  }
                  }
                  value={fields.category}
                  className="form-control" style={{ padding: 13.5 }}>
                  <option>Primary</option>
                  <option>Editable</option>
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group">
                <label>{convertToUpperCase("Is used as a filter?")}</label>
                <select
                  disabled={["File", "Image", "CheckBox", "Dropdown"].includes(fields.type) ? true : false}
                  onChange={(e) => {
                    setFields({ ...fields, isFilter: e.target.value })
                  }
                  }
                  value={fields.isFilter}
                  className="form-control" style={{ padding: 13.5 }}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-group">
              <label>{convertToUpperCase("Is Displayed?")}</label>
              <select
                onChange={(e) => {
                  setFields({ ...fields, isDisplay: e.target.value })
                  console.log(fields);
                }
                }
                value={fields.isDisplay}
                className="form-control" style={{ padding: 13.5 }}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label>{convertToUpperCase(" Is Calculatable?")}</label>
                <select
                  disabled={fieldsName.length === 0 || !types.includes(fields.type) ? true : false}
                  onChange={(e) => {
                    setFields({ ...fields, isCalculatable: e.target.value })
                    setIsCalculatable(convertToLowerCase(e.target.value));
                  }}
                  value={fields.isCalculatable}
                  className="form-control" style={{ padding: 13.5 }}>
                  <option >No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>

            {(isCalculatable === 'yes' && types.includes(fields.type) && fieldsName.length !== 0) ? (
              <>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>{convertToUpperCase("Formula")}</label>
                    <input
                      onChange={(e) => {
                        setFormula(e.target.value)
                     
                      }}
                      value={formula}
                      type="text"
                      className="form-control"
                      placeholder="eg :({field1}+{field2})/2" />
                  </div>
                </div>

                <br />

              </>
            )
              : null
            }
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <div className="btn btn-primary" onClick={() => {
              if (module === '') {
                alert("Please fill Module Name!");
              }
              else {
                if (fields.name && fields.type && fields.category && fields.isFilter && fields.isDisplay && fields.isCalculatable) {
                  handleAddField(fields.name, fields.type, fields.category, fields.isFilter, fields.isDisplay, fields.isCalculatable);
                }
                else {
                  alert("Please fill field Name!");
                }
                setFields(
                  { name: '', type: 'Text', category: 'Editable', isFilter: 'No', isDisplay: "No", isCalculatable: "No", dropdownValues: "" }
                );
              }
            }}>
              Add Field
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <div >
                <div
                  onClick={createModule}
                  className="btn btn-primary btn-icon-text" style={{ textAlign: "center", alignItems: "center", display: "flex", justifyContent: "center", width: "100px" }}>
                  <i className="mdi mdi-file-check btn-icon-prepend" />
                  <div>
                    save
                  </div>
                </div>
              </div>

            </div>
          </div>
          <br />
        </form>
      </Card >

    </>
  )
}


export default CreateModule
