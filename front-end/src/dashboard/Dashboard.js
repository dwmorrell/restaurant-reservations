import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";
import Table from "../tables/Table";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ 
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
  loadDashboard }) {

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <Reservation 
        reservations={reservations}
        loadDashboard={loadDashboard} 
      />
      <Table 
        tables={tables}
        tablesError={tablesError} 
      />
    </main>
  );
}

export default Dashboard;
