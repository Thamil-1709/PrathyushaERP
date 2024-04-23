// TimelineEvent.jsx
import React from 'react';

function TimelineEvent({ title, description ,color,order}) {
  return (
    <div className={`timeline-wrapper ${order} timeline-wrapper-${color}`}>
      <div className="timeline-badge"></div>
      <div className="timeline-panel">
        <div className="timeline-heading">
          <h6 className="timeline-title">{title}</h6>
        </div>
        <div className="timeline-body">
          <p>{description}</p>
        </div>
        <div className="timeline-footer d-flex align-items-center flex-wrap">
          {/* <i className="mdi mdi-heart-outline text-muted mr-1"></i> */}
        
      
        </div>
      </div>
    </div>
  );
}

export default TimelineEvent;
