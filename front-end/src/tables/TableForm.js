import React from "react";

function TableForm({handleChange, cancelHandler, handleSubmit, table}) {
    return (
            <div>
            <form onSubmit = {handleSubmit}>
                <div className="form-group">
    
                    <label htmlFor="tableName">Table Name</label>
                    <input 
                    type="text"
                    name="table_name"
                    placeholder="Table Name"
                    className="form-control"
                    required
                    id="tableName"
                    onChange={handleChange}
                    value={table.table_name}
                    ></input>
    
                    <label htmlFor="capacity">Table Capacity</label>
                    <input 
                    type="number"
                    name="capacity"
                    className="form-control"
                    required
                    id="capacity"
                    min={1}
                    onChange={handleChange}
                    value={table.capacity}
                    ></input>
    
                </div>
                <div>
                    <button type="submit" className="m-3 btn btn-primary" onClick={handleSubmit}>Save Table</button>
                    <button type="cancel" className="m-3 btn btn-danger" onClick={cancelHandler}
                    >Cancel</button>
                </div>
            </form>
        </div>
        )
}

export default TableForm