import React from 'react'

const TabContent = (props) => {
  return (
    <>

      <div
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
    </>



  )
}

export default TabContent