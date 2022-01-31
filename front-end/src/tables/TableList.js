import React from "react";
import { finishTable } from "../utils/api";
import TableCard from "./TableCard";


function TableList({ setRefresh, refresh, tables }) {

    function finishHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
          finishTable(parseInt(event.target.id), abortController.signal)
               .then(() => setRefresh(!refresh))
        }
        return () => abortController.abort()
      }

    return (
        tables.map((table) => {
            return (
              <TableCard 
              table={table} 
              finishHandler={finishHandler} 
              key={`${table.table_id}`}  
              data-table-id-status={table.table_id} 
              name={table.name}/>
            )
          })
    )
}

export default TableList