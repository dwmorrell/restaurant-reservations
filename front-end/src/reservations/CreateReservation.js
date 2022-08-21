import React from "react";
import ReservationForm from "./ReservationForm.js";

function CreateReservation({ loadDashboard }) {

    return (
        <div>
            <ReservationForm edit={false} loadDashboard={loadDashboard} />
        </div>
    );

}

export default CreateReservation;