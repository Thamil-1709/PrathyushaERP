import React from 'react'

const Table = () => {
  return (
    <div className="table-responsive">
    <table className="table table-striped table-hover table-bordered ">
        <thead>
            <tr>
                <th>#</th>
                {moduleData.map((data) => (
                    <th key={data.fieldName}>{data.fieldName.charAt(0).toUpperCase() + data.fieldName.slice(1).split('_').join(' ')}</th>
                ))}
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {Object.entries(moduleDataValues).map(([timeStamp, data], index) => (
                console.log("datalolvale", data),  
                <tr key={index}>
                    <td>{index + 1}</td>
                    {moduleData.map((moduleDataItem, dataIndex) => (
                        <td key={dataIndex}>
                            
                            {
                                // if field type is date convert to dd/mm/yyyy
                                moduleDataItem.fieldType === "date" ? new Date(data.find((value) => value.fieldName === moduleDataItem.fieldName)?.fieldValue).toLocaleDateString() : data.find((value) => value.fieldName === moduleDataItem.fieldName)?.fieldValue
                            }
                            </td>
                       
                    ))}
                    <td style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                        <Link
                            to={"/UpdateValuesToModule"}
                            state={{ data: data, moduleName: moduleName }}
                          
                            className="btn btn-primary"  >
                            EDIT
                        </Link>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(timeStamp)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
  )
}

export default Table