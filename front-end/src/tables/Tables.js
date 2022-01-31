import React, { useState } from "react"
import {Route, Switch} from "react-router"
import NewTable from "./NewTable"
import ErrorAlert from "../layout/ErrorAlert"


function Tables({ refresh, setRefresh}) {
    const initialTableErrorState = []
    const [tableErrors, setTableErrors] = useState(initialTableErrorState)

    return (
    <div>
        <h1>Tables</h1>
        <div>
                {tableErrors.map((error, index) => {
                    return (
                            <div key={index}>
                                <ErrorAlert error={error} />
                            </div>
                        )
                })}
            </div>
        <Switch>
            <Route exact={true} path="/tables/new">
                <NewTable 
                tableErrors={tableErrors} 
                setTableErrors={setTableErrors}
                refresh={refresh}
                setRefresh={setRefresh}/>
            </Route>
        </Switch>
    </div>
    )
}
export default Tables