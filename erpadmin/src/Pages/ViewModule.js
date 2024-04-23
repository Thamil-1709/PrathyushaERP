import React from 'react'
import Card from '../Components/Card'
import axios from 'axios';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation, json } from 'react-router-dom';
import { saveAs} from 'file-saver';

const ViewModule = (props) => {
  const navigations = useNavigate();
  const location = useLocation();
  const [moduleName, setModuleName] = useState(location?.state?.data || "");
  const [moduleData, setModuleData] = useState([]);
  const [moduleDataValues, setModuleDataValues] = useState([]);
  const [Filters, setFilters] = useState([]);
  const [filterRequest, setFilterRequest] = useState("");
  const [filterFields, setFilterFields] = useState(new FormData());
  const [isDeletable, setIsDeletable] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [isSubModule, setIsSubModule] = useState(false);
  const [mainModule, setMainModule] = useState("");
  const [MainModuleFieldNames, setMainModuleFieldNames] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const API = `${props.URL}/api/getModuleData/?moduleName=${moduleName}`;



  useEffect(() => {
    axios.get(`${API}${filterRequest}`)
      .then((res) => {
        //console.log(filterRequest)
        //console.log("res", res.data.Fields)
        console.log("res", res.data.data);
        setModuleData(res.data.Fields);
        setModuleDataValues(res.data.data);

        //console.log("data", res.data.data)
      })
      .catch((err) => {
        console.log("err", err)
      })





    axios.get(`${props.URL}/api/getModule/?moduleName=${moduleName}`).then((res) => {
      let response = res.data.fields;
      let del = `${res.data.isDeletable}`;
     
      let MainModuleFieldNames = res.data.MainModuleFieldNames;
      setMainModuleFieldNames(MainModuleFieldNames);
      console.log(res.data)
      setIsDeletable(del.toLowerCase() == "yes" ? true : false);
      setMainModule(res.data.mainModule);
      console.log("isDeletable", res.data.isDeletable)
      let arrayOfFields = [];
      response.map((field) => {
        if (field.isFilter === "Yes" && field.type !== "file" && field.type !== "image" && field.type !== "checkbox" && field.type !== "radio" && field.type !== "textarea") {
          // console.log(field.type,field.name,field.dropdownValues)
          arrayOfFields.push({ name: field.name, value: "", type: `${field.type == "Dropdown" ? "select" : field.type}`.toLowerCase(), dropdowns: field.dropdownValues });
          //console.log("Added to the array")
        }
      });
      if (res.data.isSubModule) {
        console.log("isSubModule", res.data.isSubModule)
        setIsSubModule(true);
      }
      
      setFilters([...arrayOfFields]);



    })
   setLoading(false);
  }, [filterRequest]);

  // Utility Functions 
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Delete Function  
  const handleDelete = (e, id) => {
    
    console.log("id", id)
    alert("Delete Function")
    axios.get(`${props.URL}/api/deleteModuleData/`, {
      params: {
        moduleName: moduleName,
        id: id
      }

    }).then((res) => {
      console.log("res", res)
    }).catch((err) => {
      console.log("err", err)
    })

    window.location.reload();
  }

  const handleFilter = () => {
    let filterString = JSON.stringify(Object.fromEntries(filterFields));
    // console.log("filterFields",filterFields)
    //console.log("filterString",filterString)
    setFilterRequest(`&filter=${filterString}`);

  }
   const convertToCSV = () => {
    let fields = moduleData;
    let csv = [
      [...moduleData.map((field) => {return Capitalize(field)})],
      ...moduleDataValues.map((row,index) => {
        console.log("row", row)
        let arr = []; 
        fields.map((field) => {
          if (typeof row[field] == "object") {
            let keys = Object.keys(row[field]);
            let fileName = row[field][keys[0]];
            arr.push(fileName);
          } else {
            if (row[field] == undefined) {
              row[field] = "-";
            }
            arr.push(row[field]);
          }
          console.log("arr", arr)
        });
        return arr;
        
      
      })

    ].map(e => e.join(",")).join("\n");
   
    const CsvBlob = new Blob([csv], { type: "text/xlsx" });
    console.table(moduleDataValues)
    
   saveAs(CsvBlob,`${moduleName}.xlsx`);
    return csv;

   }

  return (
    <>
     {loading ? 
     
     <div className="square-box-loader">
  <div className="square-box-loader-container">
    <div className="square-box-loader-corner-top" />
    <div className="square-box-loader-corner-bottom" />
  </div>
  <div className="square-box-loader-square" />
</div>
     :
     
     <Card Title={moduleName}  >
     <div style={{ display: "flex", justifyContent: "right", alignItems: "center", gap: 10 }}>
       <Link to="/" className="btn btn-primary">Back</Link>

     </div>
     <br />
 
     {Filters.length > 0 && (
       <div style={{ width: "100%" }}>
         <h4>Filters</h4>
         <hr />
         {Filters.map((field, index) => {
           if (`${field.type}` == "file" || `${field.type}` == "image" || `${field.type}` == "checkbox" || `${field.type}` == "radio" || `${field.type}` == "textarea") {
             return null;
           }

           return (
             <div key={index} style={{
               textAlign: "center",
               alignItems: "center",
               justifyContent: "center"
             }}>
               <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", gap: "1rem" }}>
                 <label style={{ fontSize: "1.1rem" }}>{Capitalize(field.name)}</label>
                 {field.type !== "select" ? (<input className='form-control' type={field.type} name={field.name} onChange={(e) => {
                   if (filterFields.has(field.name)) {
                     filterFields.set(field.name, e.target.value);

                   } else {
                     filterFields.append(field.name, e.target.value);
                   }

                 }} />) :
                   <select name={field.name} style={{ padding: "1rem" }} className='form-control' onChange={(e) => {
                   if (e.currentTarget.value == "") {
                     filterFields.delete(field.name);
                   }else{
                     if (filterFields.has(field.name)) {
                       filterFields.set(field.name, e.target.value);

                     } else {
                       filterFields.append(field.name, e.target.value);
                     }

                   }
                   }}>
                     <option value="">All</option>
                     {field.dropdowns.map((dropdown, key) => {
                       return (
                         <option key={key} value={dropdown}>{dropdown}</option>
                       )
                     })}
                   </select>}
                 <button onClick={handleFilter}
                   className='btn btn-primary' >Filter</button>
               </div>
               <br />

             </div>

           )
         })}


       </div>
     )}
     <br />
     <br />
     <h4>Table</h4>

     <hr />
<div style={{display:"flex",justifyContent:"right",alignItems:"center",gap:10}}>
  <Link to="/AddData" className="btn btn-primary" state={{ module: moduleName, fields: moduleData }} style={{ float: "right", margin: 10 }}>Add Data</Link>
  <Link to="/updatedata" className="btn btn-primary" state={{ module: moduleName, fields: moduleData }} style={{ float: "right", margin: 10 }}>Add Submodule</Link>
  <button className="btn btn-primary"  onClick={convertToCSV}>Export as Excel</button>
</div>

   
     <br />
     {moduleData.length > 0 && moduleData.length > 0 ? (
       <div className="table-responsive">

         <table className="table table-striped table-hover table-bordered " >
           <thead style={{
             color: "black"
           }}>
             <tr>
               <th>S.no</th>
               {moduleData.map((data) => (
                 <th key={data}>{Capitalize(data)}</th>
               ))}
               <th>Actions</th>
             </tr>
           </thead>

           <tbody
             style={{
               color: "black"
             }}
           >
             {(moduleDataValues.length > 0) && Object.entries(moduleDataValues).map(([timeStamp, data], index) => (
               console.log("datalolvale", data),
               <tr key={index}>
                 <td>{index + 1}</td>

                 {moduleData.map((field) => {
                   console.log("field", field)
                   console.log(data.id)
                   if (typeof data[field] == "object") {
                     let keys = Object.keys(data[field]);
                     let fileName = data[field][keys[0]];
                     console.log("keys", keys)
                     console.log("file", data[field][keys[0]])
                     return (
                       <td key={field}>
                         <p>{fileName}</p>
                       </td>
                     )
                   }

                   return (
                     <td key={field}>{data[field]}</td>
                   )

                 })}
                 <td style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                   <Link
                     to={"/ViewModuleData"}
                     state={{
                       data: data, isSubModule: isSubModule, moduleName: moduleName, mode: "view", id: data.id, rec_id: data.rec_id, mainModule: mainModule,
                       MainModuleFieldNames: MainModuleFieldNames

                     }}
                     className="btn btn-primary">
                     VIEW
                   </Link>
                   <Link
                     to={"/ViewModuleData"}
                     state={{ data: data, isSubModule: isSubModule, mode: "edit", moduleName: moduleName, id: data.id, rec_id: data.rec_id, mainModule: mainModule ,MainModuleFieldNames: MainModuleFieldNames}}
                     className="btn btn-primary">
                     EDIT
                   </Link>
                   {isDeletable && <button className="btn btn-danger" onClick={
                     (e) => {

                      let id = isSubModule ? data.rec_id : data.id;
                       console.log("isSubModule", isSubModule)
                       handleDelete(e,id)
                     }
                   }>DELETE</button>}
                 </td>
               </tr>
             ))}
           </tbody>

         </table>
         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
           {moduleDataValues.length !== 0 ?
             <h6>Total Records : {moduleDataValues.length}</h6>
             : (
               <p >No Match Found</p>
             )}
         </div>
       </div>

     ) : (
       <h4>No Data Found</h4>

     )}


   </Card>
     }
    </>

  )
}

export default ViewModule;

