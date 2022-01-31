import React, {useState} from "react";
import { useHistory } from "react-router";
import { createTables } from "../utils/api";
import TableForm from "./TableForm";

function NewTable({ setRefresh, refresh, setTableErrors }) {
    const history = useHistory()

    const initialFormState = {
        table_name: "",
        capacity: 0,
        reservation_id: 0,
    }

    const [formData, setFormData] = useState(initialFormState)

    function isNameLongEnough() {
        if(formData.table_name.length >= 2){
            return true
        }else{
            const nameError = new Error("Table name must be at least 2 characters")
            setTableErrors([nameError])
            return false
        }
    }

    function capacityRequired() {
        if(formData.capacity > 0) {
            return true
        }else{
            const capacityError = new Error("Table capacity must be more than 0")
            setTableErrors([capacityError])
            return false
        }
    }

    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    const cancelHandler = (event) => {
        event.preventDefault()
        setFormData(initialFormState)
        history.goBack()
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const capacityAsNumber = {
            ...formData,
            capacity: parseInt(formData.capacity)
        }
        const abortController = new AbortController()
        if(isNameLongEnough() && capacityRequired()){
            createTables(capacityAsNumber, abortController.signal)
            .then(() => setRefresh(!refresh))
            .then(history.push(`/dashboard`))
            setFormData(initialFormState)
        }
        return () => abortController.abort()
    } 

    return(
        <div>
            <h3>New Table</h3>
            <TableForm 
            handleChange={handleChange} 
            cancelHandler={cancelHandler} 
            handleSubmit={handleSubmit}
            table={formData}
            />
        </div>
    )
}

export default NewTable