import React from "react";
import "./Tables.css"

function TableCard({table, finishHandler}) {
return(
    <div className="card p-3 m-3">
        <div >
            <div className="card-title card-name">
                <h5>Table Name: {table.table_name}</h5>
            </div>
            <ul  className="list-group list-group-flush table-card-list">
                <li className="list-group-item table-list">
                    Table Capacity: {table.capacity}
                </li>
                <li className="list-group-item table-list" data-table-id-status={table.table_id}>
                Status: {!table.reservation_id  ? "Free" : "Occupied"}
                </li>
            </ul>
            {table.reservation_id ?
                <button 
                className="btn btn-danger" 
                onClick={finishHandler}
                id={table.table_id}
                name={table.reservation_id}
                data-table-id-finish={table.table_id}
                >Finish</button> : 
                null}
        </div>
    </div>)
}

export default TableCard