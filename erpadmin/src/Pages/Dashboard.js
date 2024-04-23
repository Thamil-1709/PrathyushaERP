import React  from 'react'
import Image from "../Assets/Images/stud.png"
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import "./Styles/DashBoard.css"


function Dashboard(props) {
    const [modules , setModules] = useState([]);
    const [module ,setModule]= useState('');

   
    useEffect(()=>{
        axios.get(`${props.URL}/api/getModules/?modulelist=yes`)
        .then((res)=>{
            console.log("res",res.data.Modules)
            setModules(res.data.Modules)
        })
        .catch((err)=>{
            console.log("err",err)
        })
    },[])

/* Delete Function  
const handleDelete = (e) => {
     <div style={{
                    display:"flex",
                    justifyContent:"right"
                }}>
                    <select className='form-control'
                    onChange={(e)=>{
                       setModule(e.target.value)
                    
                    }}
                    >
                        <option>select</option>
                        {modules.map((module,index)=>{
                            return(
                                <option key={index} value={module}>{capitalize(module)}</option>
                            )
                        })}

                    </select>
                    <button 
                    className='btn btn-danger'
                    onClick={
                    handleDelete
                    }
                    >
                        
                        delete 
                    </button>
                </div>

    alert("Delete Function")
    axios.delete(`${props.URL}/api/deleteModule/`,{
      headers: {
        
        'Authorization': `Token ${localStorage.getItem('token')}`
      },data:{
        moduleName:module,
        

      }
      
    }).then((res) => {
      console.log("res", res)
    }).catch((err) => {
      console.log("err", err)
    })
    setModule('')
    window.location.reload();
  }
    */
 // Utility Functions
 const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
 }
    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "left",
                    textAlign: "center",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 20
                }}
            >
                <img
                    src={Image}
                    style={{ width: 50, height: 100, objectFit: "cover" }}
                />
                <h1 id="dashboardname" style={{ color: "black" }}>
                    ADMIN DASHBOARD
                </h1>
               
            </div>
            <br />
            <br />  
            <div className='row'>

                {modules.map((module,index) => (
                    <Link
                        key={index}
                        state={{ data: module }}
                        style={{ textDecoration: "none" }}
                        className="col-sm-3 grid-margin stretch-card"
                        to={{
                            pathname: "/ViewModule",
                        }}>
                        <div className="card card-variant-border-dark box" >
                            <div className="card-variant-info" />
                            <div className="card-body" id="cardShaddow" style={{ cursor: "pointer" }}>
                                <div className="d-xl-flex d-lg-block d-sm-block  d-flex align-items-center">
                                   
                                    <div>
                                        <p className="text-dark font-weight-medium">
                                            {" "}
                                            <span style={{ color: "grey" }}>Click To View</span>{" "}
                                        </p>
                                        <h4 className="text-dark  font-weight-medium">{capitalize(module)}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </>
    )
}

export default Dashboard