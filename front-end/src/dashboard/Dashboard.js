import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";
import Table from "../tables/Table";
import { listReservations, listTables } from "../utils/api";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 */
function Dashboard() {

  const query = useQuery();
  const date = query.get("date") || today();

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

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
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
