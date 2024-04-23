import React, { useState } from 'react';

function Alert(props) {
    const [showPopup, setShowPopup] = useState(false);

    const handleClick = () => {
        setShowPopup(true);
    };

    const handleClose = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <div className="col-md-4 col-sm-6 d-flex justify-content-center border-right">
                <div className="card-body">
                    <div className="wrapper text-center">
                        <h4 className="card-title">Alerts Popups</h4>
                        <p className="card-description">A success message!</p>
                        <button
                            className="btn btn-outline-success"
                            onClick={handleClick}
                        >
                            Click here!
                        </button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="swal-modal" role="dialog" aria-modal="true">
                    <div className="swal-icon swal-icon--warning">
                        <span className="swal-icon--warning__body">
                            <span className="swal-icon--warning__dot" />
                        </span>
                    </div>
                    <div className="swal-title" style={{}}>
                        Are you sure?
                    </div>
                    <div className="swal-text" style={{}}>
                        You won't be able to revert this!
                    </div>
                    <div className="swal-footer">
                        <div className="swal-button-container">
                            <button className="swal-button swal-button--cancel btn btn-danger" onClick={handleClose}>
                                Cancel
                            </button>
                            <div className="swal-button__loader">
                                <div />
                                <div />
                                <div />
                            </div>
                        </div>
                        <div className="swal-button-container">
                            <button className="swal-button swal-button--confirm btn btn-primary">
                                OK
                            </button>
                            <div className="swal-button__loader">
                                <div />
                                <div />
                                <div />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Alert;
