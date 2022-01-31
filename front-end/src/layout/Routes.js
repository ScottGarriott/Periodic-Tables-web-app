import React from "react";

import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Tables from "../tables/Tables";
import NotFound from "./NotFound";
import Reservations from "../reservations/Reservations";
import { today } from "../utils/date-time";
import Search from "../search/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes({
  refresh,
  setRefresh}) {

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery()

  let date = query.get("date")

  if(!date){
    date = today()
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations">
        <Reservations 
        refresh={refresh}
        setRefresh={setRefresh} />
      </Route>
      <Route path="/tables">
        <Tables refresh={refresh}
        setRefresh={setRefresh} />
      </Route>
      <Route exact={true} path="/dashboard">
        <Dashboard 
        date={date}
        refresh={refresh}
        setRefresh={setRefresh} />
      </Route>
      <Route exact={true} path="/search">
        <Search 
        refresh={refresh}
        setRefresh={setRefresh}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
