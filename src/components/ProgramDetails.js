import React, {useContext, useEffect, useState} from "react";
import {getProgramScheduleByProgramId, getWorkoutsByProgramId, updateProgram} from "../api"
import {Button, Card, Form, Header, Icon, Input, Label} from "semantic-ui-react";
import '../sidecar.css'; // custom CSS file
import {ProgramContext, WorkoutContext} from '../programContext';
import WorkoutComponent from "./WorkoutComponent";

const FormattedProgramSchedule = ({data}) => {
    return (
        <div className="content">
            <div className="header">Schedule</div>
            {data.map(item => (
                <div className={"description"} key={item.header}>{item.description}</div>
            ))}
        </div>
    );
};

const EditProgram = ({currentProgram, handleProgramEdit}) => {
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

const ProgramDetailsHeader = ({
                                  isMobile,
                                  currentProgram,
                                  handleProgramEdit,
                                  formattedProgramDetails,
                                  isProgramEdit
                              }) => {
    return (
        <Card.Group itemsPerRow={isMobile ? undefined : 2}>
            {
                isProgramEdit ?
                    <EditProgram currentProgram={currentProgram} handleProgramEdit={handleProgramEdit}/> :
                    <ReadOnlyProgram currentProgram={currentProgram} handleProgramEdit={handleProgramEdit}/>
            }
            <ReadOnlyProgramSchedule formattedProgramDetails={formattedProgramDetails}/>
        </Card.Group>
    );
}

const ReadOnlyProgram = ({currentProgram, handleProgramEdit}) => {
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

const ReadOnlyProgramSchedule = ({formattedProgramDetails}) => {
    return (
        <Card fluid color='red'>
            <FormattedProgramSchedule data={formattedProgramDetails}/>
        </Card>
    );
};


const ProgramDetails = () => {

    // context from parent
    const {currentProgram} = useContext(ProgramContext);
    const {setCurrentProgram} = useContext(ProgramContext);
    const {handleBackClick} = useContext(ProgramContext);

    const [rawProgramDetails, setRawProgramDetails] = useState([]);
    const [formattedProgramDetails, setFormattedProgramDetails] = useState([]);
    const [rawWorkouts, setRawWorkouts] = useState([]);
    const [formattedWorkouts, setFormattedWorkouts] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [repeat, setRepeat] = useState(false);
    const [didEdit, setDidEdit] = useState(0);
    const [isProgramEdit, setIsProgramEdit] = useState(false);

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            setIsMobile(window.innerWidth <= 768);
        }

        // Subscribe to window resize events
        window.addEventListener('resize', handleResize);

        // Unsubscribe from events to avoid memory leaks
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        getProgramScheduleByProgramId(currentProgram['id'])
            .then(response => setRawProgramDetails(response))
        getWorkoutsByProgramId(currentProgram['id'])
            .then(response => setRawWorkouts(response))
    }, []);

    useEffect(() => {
        if (didEdit === 1) {
            getWorkoutsByProgramId(currentProgram['id'])
                .then((response) => {
                    setDidEdit(0)
                    return setRawWorkouts(response)
                })
        }
    }, [didEdit]);

    useEffect(() => {
        const concatenatedString = rawProgramDetails.map(item => {
            const startDate = new Date(item.start_date);
            const endDate = new Date(item.end_date);

            const formattedStartDate = startDate.toLocaleDateString();
            const formattedEndDate = endDate.toLocaleDateString();
            return {
                "header": item.id,
                "description": `${formattedStartDate} - ${formattedEndDate}`
            };
        });

        const sortedWorkouts = rawWorkouts.slice().sort((a, b) => {
            if (a.week !== b.week) {
                return a.week - b.week;
            } else if (a.day !== b.day) {
                return a.day - b.day;
            } else {
                return a.movement_order - b.movement_order;
            }
        })

        const restructuredData = [];

        sortedWorkouts.forEach(item => {
            const {id, week, program_id, day, movement_description, movement_notes} = item;

            // Check if a week entry already exists
            let weekEntry = restructuredData.find(entry => entry.week === week);
            if (!weekEntry) {
                weekEntry = {
                    week,
                    program_id,
                    days: []
                };
                restructuredData.push(weekEntry);
            }

            // Check if a day entry already exists within the week
            let dayEntry = weekEntry.days.find(dayItem => dayItem.day === day);
            if (!dayEntry) {
                dayEntry = {
                    day,
                    movements: []
                };
                weekEntry.days.push(dayEntry);
            }

            // Add movement to the day
            dayEntry.movements.push({
                id,
                movement_description,
                movement_notes
            });
        });

        setFormattedProgramDetails(concatenatedString)
        setFormattedWorkouts(restructuredData)
    }, [rawProgramDetails, rawWorkouts])

    const handleProgramEdit = (program, submit) => {
        if (isProgramEdit) {
            if(submit) {
                updateProgram(program)
                    .then((results) => {
                        console.log(results)
                        setCurrentProgram(program)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => setIsProgramEdit(false))
            }
        } else {
            setIsProgramEdit(true)
        }
    }

    return (
        <div className={"div-card-parent"}>
            <ProgramDetailsHeader formattedProgramDetails={formattedProgramDetails}
                                  handleProgramEdit={handleProgramEdit} currentProgram={currentProgram}
                                  isMobile={isMobile} isProgramEdit={isProgramEdit}/>
            <Card.Group stackable={true}>
                <WorkoutContext.Provider value={{setDidEdit, setFormattedWorkouts}}>
                    <WorkoutComponent workoutData={formattedWorkouts} isMobile={isMobile} didEdit={didEdit}/>
                </WorkoutContext.Provider>
            </Card.Group>
            <Button primary onClick={handleBackClick}>Back</Button>
            <Button primary onClick={handleBackClick}>Repeat</Button>
            <Button primary onClick={handleBackClick}>Assign</Button>
        </div>
    )
}


export default ProgramDetails;