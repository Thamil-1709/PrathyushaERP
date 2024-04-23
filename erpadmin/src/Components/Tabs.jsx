import React from 'react'
import Card from './Card'



const Tabs = (props) => {

    console.log(props.tabs.name)

    /* props 
       Title:String
         tabs: Array of Objects
              id: String
              name: String
              content: <Component/>
        TabContent --> Component
            >props.id
            >prop
            >props.children
            >props.className
            >props.id {`pills-${props.id}`}
    */

    return (
        <>
            <Card Title={props.Title}>
                <ul class="nav nav-pills nav-pills-success" id="pills-tab" role="tablist">
                    {props.tabs.map((tab, index) => {
                        return (
                            <li key={index} className="nav-item">
                                <a 
                                    className="nav-link "
                                    id={`pills-${tab.name}-tab`}
                                    style={{ color:'black',borderRadius: 10,borderColor: 'black'}}
                                    data-toggle="pill"
                                    href={`#pills-${tab.name}`}
                                    role="tab"
                                    aria-controls={`pills-${tab.name}`}
                                    aria-selected="true"
                                >
                                    {tab.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
                <div className="tab-content" id="pills-tabContent">

                    {props.tabs.map((tab, index) => {
                        return (
                            <div
                            key={index}
                            className="tab-pane fade "
                            id={`pills-${tab.name}`}
                            role="tabpanel"
                            aria-labelledby={`pills-${tab.name}-tab`}
                          >
                            <div className="media">
                              <div className="media-body">
                               {tab.content}
                              </div>
                            </div>
                          </div>
                          
                        )
                    })}
                </div>
            </Card>
        </>
    )
}

export default Tabs