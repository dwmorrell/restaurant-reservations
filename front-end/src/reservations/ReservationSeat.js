import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatReservation } from "../utils/api";
import Table from "../tables/Table";

/**
 * Defines the ReserationSeat component
 */
function ReservationSeat() {

    const history = useHistory();
 
    const reservationId = useParams().reservation_id
    
    // useState functions
    const [table, setTable] = useState([]);
    const [tableId, setTableId] = useState(1);
    const [tableError, setTableError] = useState(null);

    /**
     * useEffect function to get the list of tables and save to state
     */
    useEffect(() => {

        const abortController = new AbortController();
        setTableError(null);
        listTables(abortController.signal)
            .then(setTable)
            .catch(setTableError);
        return () => abortController.abort();

    }, []);

    /**
     * Handler for changes to the form field
     * @param {event} 
     */
    const handleChange = function (event) {
        setTableId(event.target.value);
    }

    /**
     * Submit handler to change the status of the requested table and reservation
     * Calls the seatReservation API and redirects to "/dashboard"
     * @param {event}
     */
	const handleSeatSubmit = async function (event) {
		event.preventDefault();
        const abortController = new AbortController()
        try {
            await seatReservation(reservationId, Number(tableId), abortController.signal);
            history.push(`/dashboard`);

        } catch(error) {
            setTableError(error);
        }
        return () => abortController.abort();
	};

    return (
        <div>
            <h1>
                This is the seating page.
            </h1>
            <p>
                The reservation ID is {reservationId}
            </p>
            <form
                onSubmit={handleSeatSubmit}
            >
                <label>
                    Select a table:
                    <select 
                        name="table_id"
                        onChange={handleChange}
                    >
                        {table.map((table) => {
                            return <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                        })}
                    </select>
                </label>

                <button 
                    className="btn btn-primary ml-2" 
                    type="submit"
                >
                    Submit
                </button> 

                {/* Displays the cancel button and navigates back 1 page if selected */}
                <button 
                className="btn btn-secondary" 
				onClick={(event) => {
					event.preventDefault();
					history.go(-1);
				}}
                >
                    Cancel
                </button>
            </form>

            <h3>Here's the table info:</h3>
            <Table />
            <ErrorAlert error={tableError} />
        </div>
    ); 
}

export default ReservationSeat;