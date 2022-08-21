import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert.js";

/**
 * Defines the TableForm component
 */
function TableForm() {

    // useState functions
    const[error, setError] = useState(null);
    const[table, setTable] = useState({
        table_name: "",
        capacity: ""
    });

    const history = useHistory();

    /**
     * Handler for submit function
     * Calls the createTable API
     * Will redirect to dashboard after creation
     * @param {event}
     */
	const handleCreateSubmit = async function (event) {
		event.preventDefault();
        const abortController = new AbortController();
        try {
            await createTable(table, abortController.signal);
            history.push(`/dashboard`);
        } catch(error) {
            setError(error);
            return () => abortController.abort();
        }
	};

    /**
     * Handler for changes to various form fields
     * @param {target} 
     */
    const handleChange = ({ target }) => {
        setTable({
            ...table,
            [target.name]: target.name === "capacity" ? Number(target.value) : target.value,
        });
    };
    
    return (
        <div>
            <ErrorAlert error={error} />
            <form
                onSubmit={handleCreateSubmit}
            >
                <table className="table">
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <h1>Make a Table</h1>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <label>
                                    Table Name
                                </label>
                            </td>
                            <td>
                                <label>
                                    Table Capacity
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input 
                                    id="tableName"
                                    type="text"
                                    name="table_name"
                                    onChange={handleChange} 
                                    value={table.table_name}
                                />
                            </td>
                            <td>
                                <input 
                                    id="tableCapacity"
                                    name="capacity" 
                                    onChange={handleChange}
                                    value={table.capacity}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button 
                                    className="btn btn-primary ml-2" 
                                    type="submit"
                                >
                                    Submit
                                </button> 
                            </td>
                            <td>
                                <button 
                                    className="btn btn-danger" 
					                onClick={(e) => {
						                e.preventDefault();
						                history.go(-1);
					                }}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form> 
        </div>
    );

}

export default TableForm;