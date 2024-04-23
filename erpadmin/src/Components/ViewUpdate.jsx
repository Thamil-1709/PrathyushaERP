import React from 'react'

import {Link} from 'react-router-dom'
import { useNavigate} from 'react-router-dom'

import Header from './Header'

const ViewUpdate = (props) => {
    
    const navigate = useNavigate()
    const onViewDetails = (event) => {   
        navigate(`/Viewsdetails/${props.Type}/${event.target.id}`)
    }


    // Title and Description are need to be passed as props
    // busFields and busDetails are need to be passed as props
    /*
    Title --> Title of the View like 'View Bus Details', 'View Driver Details'  , 'View Route Details'
    Description --> Description of the View like 'View Bus Details', 'View Driver Details'  , 'View Route Details'
    busFields --> Array of fields like ['BusNumber', 'BusType', 'BusCapacity', 'BusRoute', 'BusDriver', 'BusImage']
    busDetails --> Array of Objects like [{BusNumber: '123', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg'}]
    let busFields = props.busFields;
    let busDetails = props.busDetails;
    */
    let busFields = ['BusNumber', 'BusType', 'BusCapacity', 'BusRoute', 'BusDriver', 'BusImage', "Action"]
    let busDetails = [{
        BusNumber: '123', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg'
    }, { BusNumber: '124', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg' }, { BusNumber: '125', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg' }
        , { BusNumber: '126', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg' }, { BusNumber: '127', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg' }
        , { BusNumber: '128', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg' }, { BusNumber: '129', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg' }
        , { BusNumber: '130', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg' }, { BusNumber: '131', BusType: 'Mini', BusCapacity: '20', BusRoute: 'Kandy-Colombo', BusDriver: 'Kamal', BusImage: 'Bus.jpg' }
    ]
    return (
        <>
            <div className='text-dark col-12 grid-margin  '>
                <Header name={props.Title} description={props.Description} />
                <br />
                <div className='table-sorter-wrapper col-lg-12 table-responsive'>
                    {/*                    <div id="sortable-table " style={{ color: "black" }} className='table '>
 */}
                        <table id="sortable-table " style={{ color: "black" }} className='table '>
                        <thead >

                            <tr>
                                {busFields.map((field, index) => { return (<th className=' text-dark' key={index}>{field}<i className="mdi mdi-chevron-down" /></th>) })}
                            </tr>


                        </thead>
                        <tbody>
                            {busDetails.map((bus, index) => {
                                return (<tr key={bus.BusNumber}>
                                    <td>{bus.BusNumber}</td>

                                    <td>{bus.BusType}</td>
                                    <td>{bus.BusCapacity}</td>
                                    <td>{bus.BusRoute}</td>
                                    <td>{bus.BusDriver}</td>
                                    <td>{bus.BusImage}</td>
                                    <td><button id={bus.BusNumber} onClick={onViewDetails} className="btn btn-primary"> View</button></td>
                                    <td><button className="btn btn-primary">Edit</button></td>
                                    <td><button className="btn btn-danger">Remove</button></td>

                                </tr>)
                            })}
                        </tbody>

                    </table>
                </div>
               


            </div>
        </>
    )
}

export default ViewUpdate;