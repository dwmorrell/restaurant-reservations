import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";
import Table from "../tables/Table";
import { listReservations, listTables } from "../utils/api";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { useHistory } from "react-router";

/**
 * Defines the dashboard page.
 */
function Dashboard() {

  const query = useQuery();
  const date = query.get("date") || today();
  const history = useHistory();

  const [ reservations, setReservations ] = useState([]);
  const [ reservationsError, setReservationsError ] = useState(null);
  const [ tables, setTables ] = useState([]);
  const [ tablesError, setTablesError ] = useState(null);

  useEffect(() => {


      const abortController = new AbortController();
  
      setReservationsError(null);
  
      listReservations({ date: date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
  
      listTables(abortController.signal)
        .then((tables) =>
          tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id)
        )
        .then(setTables)
        .catch(setTablesError);
  
      return () => abortController.abort();
    

  }, [date]);

  function handleDateNav({ target }) {
    let newDate;
    let useDate;

    if (!date) {
      useDate = today();
    } else {
      useDate = date;
    }

    if (target.name === "previous") {
      newDate = previous(useDate);
    } else if (target.name === "next") {
      newDate = next(useDate);
    } else {
      newDate = today();
    }

    history.push(`/dashboard?date=${newDate}`);

  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <button
        className="btn btn-secondary m-1"
        type="button"
        name="previous"
        onClick={handleDateNav}
      >
        Previous
      </button>
      <button
        className="btn btn-primary m-1"
        type="button"
        name="today"
        onClick={handleDateNav}
      >
        Today
      </button>
      <button
        className="btn btn-secondary m-1"
        type="button"
        name="next"
        onClick={handleDateNav}
      >
        Next
      </button>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <Reservation reservations={reservations} />
      <Table 
        tables={tables}
        tablesError={tablesError} 
      />
    </main>
  );
}

export default Dashboard;
