import React, {useEffect, useState} from "react";
import {Button, Card, Form} from "semantic-ui-react";
import {
    createProgramAssignments, createProgramSchedule, deleteProgramAssignments,
    getProgramScheduleByProgramId,
    updateProgramAssignments,
    updateProgramSchedule
} from "../../api";
import {EditProgramSchedule, ReadOnlyProgramSchedule} from "./ProgramSchedule";
import ProgramDelivery from "./ProgramDelivery";
import ProgramDeliveryEmail from "./ProgramDeliveryEmail";

const formatTimestamp = (dateToFormat) => {
    const copyDate = new Date(dateToFormat);
    const year = copyDate.getFullYear();
    const month = String(copyDate.getMonth() + 1).padStart(2, '0');

    // Ensure day is a two-digit number
    const day = String(copyDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const EditProgramHeader = ({currentProgram, handleProgramEdit}) => {
    const [programEdit, setProgramEdit] = useState(currentProgram);
    const updateProgramValues = (value, attribute) => {
        const program = {...programEdit};
        program[attribute] = value;
        setProgramEdit(program);
    }

    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Program</Card.Header>
                <Card.Description>
                    <Form.Group widths='equal'>
                        <Form.Input fluid label='Name' placeholder='Phase 1 - Volume'
                                    value={programEdit.name}
                                    onChange={(e) => updateProgramValues(e.target.value, "name")}
                        />
                        <Form.Input fluid label='Type' placeholder='Intensity'
                                    value={programEdit.type}
                                    onChange={(e) => updateProgramValues(e.target.value, "type")}
                        />
                        <Form.Input fluid label='Description' placeholder='8 rep maxes for everyone'
                                    value={programEdit.description}
                                    onChange={(e) => updateProgramValues(e.target.value, "description")}
                        />
                    </Form.Group>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => handleProgramEdit(programEdit, true)}>
                        Submit
                    </Button>
                    <Button basic color='red' onClick={() => handleProgramEdit(programEdit, false)}>
                        Cancel
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
};

export const ProgramDetailsHeader = ({
                                         isMobile,
                                         currentProgram,
                                         handleProgramEdit,
                                         isProgramEdit
                                     }) => {
    const [programSchedule, setProgramSchedule] = useState([]);
    const [isProgramScheduleEdit, setIsProgramScheduleEdit] = useState(false);
    const [programScheduleDropdown, setProgramScheduleDropdown] = useState(false);

    useEffect(() => {
        getProgramScheduleByProgramId(currentProgram['id'])
            .then(response => setProgramSchedule(response))
    }, [currentProgram, isProgramScheduleEdit]);

    const handleProgramScheduleEdit = async (modifiedProgramSchedule, modifiedAssignments, originalAssignments, submit) => {
        if (isProgramScheduleEdit) {
            if (submit) {
                const modProgramScheduleResult = await updateProgramSchedule(modifiedProgramSchedule)
                const programScheduleListCopy = [...programSchedule]
                const foundIdx = programScheduleListCopy.findIndex(schedule => schedule.id === modifiedProgramSchedule.id)
                programScheduleListCopy[foundIdx] = modProgramScheduleResult
                setProgramSchedule(programScheduleListCopy)

                //get the diff
                const diffList = modifiedAssignments.filter(modAssignment => {
                    const ogAssignment = originalAssignments.filter(ogAss => ogAss.user_id === modAssignment.user_id && ogAss.program_schedule_id === modAssignment.program_schedule_id)
                    if (ogAssignment) {
                        if (ogAssignment[0].assigned_to_program !== modAssignment.assigned_to_program) {
                            return modAssignment
                        }
                    }

                })

                // inserts => where program_schedule_id is null AND is_assigned = 1
                let inserts = diffList.filter(modAssignment => {
                    if (modAssignment.program_schedule_id === null && modAssignment.assigned_to_program === 1) {
                        return modAssignment
                    }
                })
                inserts = inserts.map(something => {
                    const copy = {...something}
                    copy.start_date = modifiedProgramSchedule.start_date
                    copy.end_date = modifiedProgramSchedule.end_date
                    copy.program_schedule_id = modifiedProgramSchedule.id
                    return copy
                })

                // updates => where program_schedule_id is NOT null AND is_assigned = 1
                let updates = diffList.filter(modAssignment => {
                    if (modAssignment.program_schedule_id !== null && modAssignment.assigned_to_program === 1) {
                        return modAssignment
                    }
                })
                updates = updates.map(ass => {
                    return {
                        user_id: ass.user_id,
                        program_schedule_id: modifiedProgramSchedule.id,
                        start_date: modifiedProgramSchedule.start_date,
                        end_date: modifiedProgramSchedule.end_date,
                        is_active: ass.assigned_to_program,
                    }
                })

                // "deletes" => where program_schedule_id is NOT null AND is_assigned = 0
                const deletes = diffList.filter(modAssignment => {
                    if (modAssignment.program_schedule_id !== null && modAssignment.assigned_to_program === 0) {
                        return modAssignment
                    }
                })

                if (inserts.length > 0) {
                    await createProgramAssignments(inserts)
                }
                if (updates.length > 0) {
                    await updateProgramAssignments(updates)
                }
                if (deletes.length > 0) {
                    await deleteProgramAssignments(deletes.map(ass => ass.program_schedule_id))
                }

                setIsProgramScheduleEdit(false)
            } else {
                setIsProgramScheduleEdit(false)
            }
        } else {
            setIsProgramScheduleEdit(true)
            const dropdownValues = programSchedule.map(item => {
                return {
                    key: item.id,
                    text: `${formatTimestamp(item.start_date)} - ${formatTimestamp(item.end_date)}`,
                    value: item.id
                }
            })
            setProgramScheduleDropdown(dropdownValues)
        }
    }

    const handleCreateProgramSchedule = async (newProgramSchedule, submit) => {
        if (isProgramScheduleEdit) {
            if (submit) {
                const modProgramScheduleResult = await createProgramSchedule(newProgramSchedule)
                const programSchedules = await getProgramScheduleByProgramId(currentProgram['id'])
                setProgramSchedule(programSchedules)
                const dropdownValues = programSchedules.map(item => {
                    return {
                        key: item.id,
                        text: `${formatTimestamp(item.start_date)} - ${formatTimestamp(item.end_date)}`,
                        value: item.id
                    }
                })
                setProgramScheduleDropdown(dropdownValues)
            }
        }
    }

    return (
        <div>
            <Card.Group itemsPerRow={isMobile ? undefined : 2}>
            {
                isProgramEdit ?
                    <EditProgramHeader currentProgram={currentProgram} handleProgramEdit={handleProgramEdit}/> :
                    <ReadOnlyProgramHeader currentProgram={currentProgram} handleProgramEdit={handleProgramEdit}/>
            }
            {
                isProgramScheduleEdit ?
                    <EditProgramSchedule handleCreateProgramSchedule={handleCreateProgramSchedule}
                                         handleProgramScheduleEdit={handleProgramScheduleEdit}
                                         programScheduleDropdownValues={programScheduleDropdown}
                                         programScheduleList={programSchedule}
                                         currentProgram={currentProgram}
                    /> :
                    <ReadOnlyProgramSchedule programSchedule={programSchedule}
                                             handleProgramScheduleEdit={handleProgramScheduleEdit}/>
            }

            </Card.Group>
            <Card.Group>
                <ProgramDelivery isMobile={isMobile}/>
            </Card.Group>
            <Card.Group>
                <ProgramDeliveryEmail isMobile={isMobile}/>
            </Card.Group>
        </div>
    );
}

export const ReadOnlyProgramHeader = ({currentProgram, handleProgramEdit}) => {
    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>{currentProgram['name']}</Card.Header>
                <Card.Description>{currentProgram['description']}</Card.Description>
                <Card.Meta>{currentProgram['type']}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <div className='ui one buttons'>
                    <Button basic color='green' onClick={() => handleProgramEdit()}>
                        Edit
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
};