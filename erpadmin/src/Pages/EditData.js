import React from 'react'
import Card from '../Components/Card'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function EditData(props) {

    const navigations = useNavigate();
    const location = useLocation();
    const API = `${props.URL}/api/getModule/`;
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState(new FormData());
    console.log("formData", formData)
    const handleFormData = (e, name, type, value) => {
        console.log(value)
        if (type === 'file') {
            if (formData.has(name)) {
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

    const EditData = async () => {
        let response = await axios.post(`${API}?moduleName=${location.state.module}`, formData)
            .then((res) => {
                console.log("res", res.data);
                window.location.reload();
            })
            .catch((err) => {
                console.log("err", err)
            })
    }


    useEffect(() => {
        axios.get(`${API}?moduleName=${location.state.module}`)
            .then((res) => {
                console.log("res", res.data.fields);
                let response = res.data.fields;
                let arrayOfFields = [];
                response.map((field) => {
                    console.log("field", field.type, field.dropdownValues);
                    arrayOfFields.push({ name: field.name, value: "", type: `${field.type == "Dropdown" ? "select" : field.type}`.toLowerCase(), dropdowns: field.dropdownValues });
                });
                console.log("arrayOfFields", arrayOfFields);
                setFields(arrayOfFields);
            })
            .catch((err) => {
                console.log("err", err)
            })
    }, []);

    return (
        <Card Title="Add Data">
            <div className='row'>
                {fields.length !== 0 && fields.map((field, index) => {
                    return (
                        <div className='col-md-6' key={index}>
                            <div className="form-group">
                                <label>{field.name}</label>
                                {field.type === "file" && <input type="file" className="form-control" onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                                {field.type === "date" && <input type="date" className="form-control" onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                                {field.type === "time" && <input type="time" className="form-control" onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                                {field.type === "text" && <input type="text" className="form-control" onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                                {field.type === "number" && <input type="number" value={formData.get(field.name)} className="form-control" onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} />}
                                {field.type === "select" && <select className="form-control" value={"select"} onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }}>
                                    {field.dropdowns.map((dropdown, key) => {
                                        return (
                                            <option key={key} value={dropdown}>{dropdown}</option>
                                        )
                                    })}
                                </select>}
                                {field.type === "checkbox" && <input type="checkbox" onChange={(e) => { handleFormData(e, field.name, field.type, e.currentTarget.value) }} className="form-control" />}
                            </div>
                        </div>
                    )
                })


                }
            </div>
            <button onClick={EditData} style={{ display: fields.length == 0 ? "none" : "inherit" }} className='btn btn-primary'>Add</button>
        </Card>

    )
}

export default EditData;