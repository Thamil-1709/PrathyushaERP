import {useState,React} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateModule from "./Pages/CreateModule";
import CreateSubModule from "./Pages/CreateSubModule";

import LOGO from "../src/Assets/Images/logo.jpg";
import ViewModule from "./Pages/ViewModule";
import ViewModuleData from "./Pages/ViewModuleData";
import Dashboard from "./Pages/Dashboard";
import AddData from "./Pages/AddData";
import {AddDataSubmodule} from "./Pages/AddDataSubmodule"

const App=()=>{
  // URl of the API
  const URL = "http://127.0.0.1:5000";
  let router =[
    {path:"/",name:"Dashboard"},
    {path:"/CreateModule",name:"Create Module"},
    {path:"/CreateSubModule",name:"Create SubModule"},
  ]

  return (
  <>
    <div className="container-scroller">
    <Router>
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-between">
          <div style={{ color: "white" }}>
            <img
              src={LOGO}
              alt="logo"
              style={{ height: 50, width: 50, borderRadius: 100 }}
            />
            &nbsp;&nbsp; P.E.C
          </div>
          <div>
         
          </div>
          <div className="notification" />
        </div>

        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
          <div className="d-none d-lg-flex" />
          <div
            className="navbar-social-link d-none d-xl-flex align-items-center "
            style={{ color: "white" }}
          >
            <img
              src={LOGO}
              alt="logo"
              style={{ height: 30, width: 30, borderRadius: 100 }}
            />
            &nbsp; PRATHYUSHA ENGINEERING COLLEGE
          </div>
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            data-toggle="offcanvas"
          >
            <span className="mdi mdi-menu" />
          </button>
        </div>
      </nav>
      <div className="container-fluid page-body-wrapper">
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">

            
              {router.map((route, index) => {
                return (
                  <li key={index} className="nav-item">
                     <Link className="nav-link" to={route.path}>
                    <i className="mdi mdi-cards-variant menu-icon" />
                      {route.name}
                    </Link>
      
                  </li>

                )
              })}

          </ul>
        </nav>
        {/*            Page Content                   */}
        <div className="main-panel">
          <div className="content-wrapper">
            
            <Routes>
              <Route path="/CreateModule" element={<CreateModule  URL={URL} />} />
              <Route path="/CreateSubModule" element={<CreateSubModule URL={URL} />} />
              <Route path="/ViewModule" element={<ViewModule URL={URL} />} />
              <Route path="/" element={<Dashboard URL={URL} />} />
              <Route path="/AddData" element={<AddData  URL={URL} />} />  
              <Route path="/updatedata" element={<AddDataSubmodule  URL={URL} />} />  
              <Route path="/ViewModuleData" element={<ViewModuleData  URL={URL} />} />
            </Routes>

          </div>
        </div>

        {/* main-panel ends */}
      </div>
    </Router>

  </div>

  </>

  )
}


export default App;
