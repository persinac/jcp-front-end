import React, {useContext, useEffect, useState} from "react";
import {
    createProgramAssignments, deleteProgramAssignments,
    getProgramAssignmentForAssignment,
    getProgramScheduleByProgramId,
    getWorkoutsByProgramId,
    updateProgram, updateProgramAssignments, updateProgramSchedule
} from "../api"
import {Button, Card, Divider, Dropdown, Form, Header, Icon, Input, Label, List, Segment} from "semantic-ui-react";
import '../sidecar.css'; // custom CSS file
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import {EditProgramAssignment} from "./ProgramAssignment";

const formatTimestamp = (dateToFormat) => {
    const copyDate = new Date(dateToFormat);
    const year = copyDate.getFullYear();
    const month = String(copyDate.getMonth() + 1).padStart(2, '0');

    // Ensure day is a two-digit number
    const day = String(copyDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const formatTimestampForDatePicker = (dateToFormat) => {
    const copyDate = new Date(dateToFormat);
    const year = copyDate.getFullYear();
    const month = String(copyDate.getMonth() + 1).padStart(2, '0');

    // Ensure day is a two-digit number
    const day = String(copyDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day} 00:00:00`;
}

export const ReadOnlyProgramSchedule = ({programSchedule, handleProgramScheduleEdit}) => {
    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Schedule</Card.Header>
                {programSchedule.map((item, idx) => (
                    <Card.Description>
                        <div key={item.id}>{formatTimestamp(item.start_date)} - {formatTimestamp(item.end_date)}</div>
                    </Card.Description>
                ))}
            </Card.Content>
            <Card.Content extra>
                <div className='ui one buttons'>
                    <Button basic color='green' onClick={() => handleProgramScheduleEdit()}>
                        Edit
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
};

export const EditProgramSchedule = ({programScheduleDropdownValues, handleProgramScheduleEdit, programScheduleList}) => {
    const [selectedScheduleId, setSelectedScheduleId] = useState();
    const [selectedSchedule, setSelectedSchedule] = useState();
    const [programScheduleAssignment, setProgramScheduleAssignment] = useState([]);
    const [originalProgramScheduleAssignment, setOriginalProgramScheduleAssignment] = useState([]);

    const handleProgramSelection = (event, {value}) => {
        setSelectedScheduleId(value)
        getProgramAssignmentForAssignment(value)
            .then((results) => {
                setProgramScheduleAssignment(results)
                const deepCopy = JSON.parse(JSON.stringify(results));
                setOriginalProgramScheduleAssignment(deepCopy)
            })
        setSelectedSchedule(programScheduleList.filter(schedule => schedule.id === value)[0])
    }

    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Schedule</Card.Header>
                <Dropdown
                    placeholder='Select Schedule'
                    fluid
                    selection
                    options={programScheduleDropdownValues}
                    value={selectedScheduleId}
                    onChange={handleProgramSelection}
                />
            </Card.Content>
            <EditProgramScheduleDates selectedSchedule={selectedSchedule} setSelectedSchedule={setSelectedSchedule}/>
            <EditProgramAssignment initialAssignment={programScheduleAssignment} originalAssignment={originalProgramScheduleAssignment}/>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => handleProgramScheduleEdit(selectedSchedule, programScheduleAssignment, originalProgramScheduleAssignment, true)}>
                        Submit
                    </Button>
                    <Button basic color='red' onClick={() => handleProgramScheduleEdit({}, [], [], false)}>
                        Cancel
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
};

export const EditProgramScheduleDates = ({selectedSchedule, setSelectedSchedule}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        if(selectedSchedule) {
            const formatted_start_date = formatTimestampForDatePicker(selectedSchedule.start_date)
            const formatted_end_date = formatTimestampForDatePicker(selectedSchedule.end_date)
            setStartDate(new Date(formatted_start_date))
            setEndDate(new Date(formatted_end_date))
        }
    }, [selectedSchedule]);

    const handleDateChange = (event, {value, scheduleAttribute}) => {
        const copySchedule = {...selectedSchedule}
        if(scheduleAttribute === "start_date") {
            setStartDate(value)
        } else {
            setEndDate(value)
        }
        copySchedule[scheduleAttribute] = value
        setSelectedSchedule(copySchedule)
    }

    return (
        <Card.Content>
            <Card.Description>
                <SemanticDatepicker
                    datePickerOnly={true} format={"YYYY-MM-DD"}
                    value={startDate}
                    onChange={handleDateChange}
                    scheduleAttribute="start_date"/>
                <SemanticDatepicker
                    datePickerOnly={true} format={"YYYY-MM-DD"}
                    value={endDate} onChange={handleDateChange} scheduleAttribute="end_date"/>
            </Card.Description>
        </Card.Content>
    );
};