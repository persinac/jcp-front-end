import React, {useEffect, useState} from "react";
import {
    getProgramAssignmentForAssignment, getProgramScheduleByProgramId,
} from "../../api"
import {
    Button,
    Card,
    Dropdown, Form, Input,
    Modal, TextArea
} from "semantic-ui-react";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import {EditProgramAssignment} from "./ProgramAssignment";
import 'semantic-ui-css/semantic.min.css';
import "../../sidecar.css"

const formatTimestamp = (dateToFormat) => {
    const copyDate = new Date(dateToFormat);
    const year = copyDate.getFullYear();
    const month = String(copyDate.getMonth() + 1).padStart(2, '0');
    const day = String(copyDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const formatTimestampForDatePicker = (dateToFormat) => {
    const copyDate = new Date(dateToFormat);
    const year = copyDate.getFullYear();
    const month = String(copyDate.getMonth() + 1).padStart(2, '0');
    const day = String(copyDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day} 00:00:00`;
}

function getWeeksBetweenDates(startDate, endDate) {
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7; // Number of milliseconds in a week
    const start = new Date(startDate);
    const end = new Date(endDate);

    const differenceInMilliseconds = end.getTime() - start.getTime();

    return differenceInMilliseconds / millisecondsPerWeek;
}

function addWeeksToDate(startDate, numberOfWeeks) {
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7; // Number of milliseconds in a week
    const start = new Date(startDate);

    // Add the total milliseconds for the given number of weeks to the start date
    const newDateInMilliseconds = start.getTime() + (numberOfWeeks * millisecondsPerWeek);

    return new Date(newDateInMilliseconds);
}

const CustomModal = ({isModalOpen, handleShowModal, programId, handleCreateProgramSchedule}) => {
    const [newProgramSchedule, setNewProgramSchedule] = useState({program_id: programId, start_date: new Date(), end_date: new Date()});
    const [numOfWeeks, setNumOfWeeks] = useState(0);

    useEffect(() => {
        const weeks = Math.ceil(getWeeksBetweenDates(newProgramSchedule.start_date, newProgramSchedule.end_date))
        setNumOfWeeks(weeks)
    }, [newProgramSchedule.end_date]);
    const programScheduleInputHandler = (e, {value, attribute}) => {
        const copyProgramSchedule = {...newProgramSchedule}
        copyProgramSchedule[attribute] = value
        setNewProgramSchedule(copyProgramSchedule);
    };

    const numWeeksInputHandler = (e) => {
        setNumOfWeeks(e);
        const newEndDate = addWeeksToDate(newProgramSchedule.start_date, e)
        const copyProgramSchedule = {...newProgramSchedule}
        copyProgramSchedule["end_date"] = newEndDate
        setNewProgramSchedule(copyProgramSchedule);
    };

    return (
        <Modal
            className="centered-modal-override"
            open={isModalOpen}
            onClose={() => handleShowModal(false)}
        >
            <Modal.Header>Create New Schedule</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Group style={{ display: "flex" }}>
                        <Form.Field style={{ flexGrow: "1" }}>
                            <SemanticDatepicker  placeholder='Start Date' inline={true} value={newProgramSchedule.start_date} onChange={programScheduleInputHandler} attribute={"start_date"}/>
                        </Form.Field>
                        <Form.Field style={{ flexGrow: "1" }}>
                            <SemanticDatepicker  placeholder='End Date' inline={true} value={newProgramSchedule.end_date} onChange={programScheduleInputHandler} attribute={"end_date"}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Group style={{ display: "flex" }}>
                        <Form.Field style={{ flexGrow: "1" }}>
                            <Form.Input fluid label='Number of Weeks' placeholder='4'
                                        value={numOfWeeks}
                                        onChange={(e) => numWeeksInputHandler(e.target.value, "type")}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={() => handleShowModal(false)}>Cancel</Button>
                <Button positive onClick={() => {
                    handleCreateProgramSchedule(newProgramSchedule, true)
                    handleShowModal(false);
                }}>Save</Button>
            </Modal.Actions>
        </Modal>
    );
};

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

export const EditProgramSchedule = ({programScheduleDropdownValues, handleProgramScheduleEdit, programScheduleList, handleCreateProgramSchedule, currentProgram}) => {
    const [selectedScheduleId, setSelectedScheduleId] = useState();
    const [selectedSchedule, setSelectedSchedule] = useState();
    const [programScheduleAssignment, setProgramScheduleAssignment] = useState([]);
    const [originalProgramScheduleAssignment, setOriginalProgramScheduleAssignment] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if(programScheduleDropdownValues.length > 0) {
            setSelectedScheduleId(programScheduleDropdownValues[0].value)
        }
    }, [programScheduleDropdownValues]);

    useEffect(() => {
        if(selectedScheduleId) {
            getProgramAssignmentForAssignment(selectedScheduleId)
                .then((results) => {
                    setProgramScheduleAssignment(results)
                    const deepCopy = JSON.parse(JSON.stringify(results));
                    setOriginalProgramScheduleAssignment(deepCopy)
                })
            setSelectedSchedule(programScheduleList.filter(schedule => schedule.id === selectedScheduleId)[0])
        }
    }, [selectedScheduleId]);

    const handleProgramSelection = (event, {value}) => {
        setSelectedScheduleId(value)
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
                <Button secondary onClick={() => setModalOpen(true)}>Add New Schedule</Button>
                <CustomModal isModalOpen={modalOpen} handleShowModal={setModalOpen} programId={currentProgram['id']} handleCreateProgramSchedule={handleCreateProgramSchedule} />
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
    const [numOfWeeks, setNumOfWeeks] = useState(0);

    useEffect(() => {
        if(selectedSchedule) {
            const formatted_start_date = formatTimestampForDatePicker(selectedSchedule.start_date)
            const formatted_end_date = formatTimestampForDatePicker(selectedSchedule.end_date)
            setStartDate(new Date(formatted_start_date))
            setEndDate(new Date(formatted_end_date))
        }
    }, [selectedSchedule]);

    useEffect(() => {
        if(selectedSchedule) {
            const weeks = Math.ceil(getWeeksBetweenDates(selectedSchedule.start_date, selectedSchedule.end_date))
            setNumOfWeeks(weeks)
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

    const numWeeksInputHandler = (e) => {
        setNumOfWeeks(e);
        const newEndDate = addWeeksToDate(selectedSchedule.start_date, e)
        const copyProgramSchedule = {...selectedSchedule}
        copyProgramSchedule["end_date"] = newEndDate
        setSelectedSchedule(copyProgramSchedule);
    };

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
                <Input fluid label='Number of Weeks' placeholder='4'
                       value={numOfWeeks}
                       onChange={(e) => numWeeksInputHandler(e.target.value, "type")}
                />
            </Card.Description>
        </Card.Content>
    );
};