import React, {useContext, useEffect, useState} from "react";
import {getProgramScheduleByProgramId, getWorkoutsByProgramId} from "../api"
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

const EditProgram = ({isMobile, currentProgram, handleProgramEdit, updateProgram}) => {
    return (
        <Card.Group itemsPerRow={isMobile ? undefined : 2}>
            <Card fluid color='red'>
                <Card.Header>Program</Card.Header>
                <Card.Content>
                    <Card.Description>
                        <Form.Group widths='equal'>
                            <Form.Input fluid label='Name' placeholder='Phase 1 - Volume'
                                        value={currentProgram.name}
                                        onChange={(e) => updateProgram(e.target.value, "name")}
                            />
                            <Form.Input fluid label='Description' placeholder='8 rep maxes for everyone'
                                        value={currentProgram.description}
                                        onChange={(e) => updateProgram(e.target.value, "description")}
                            />
                        </Form.Group>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='green' onClick={() => handleProgramEdit(currentProgram)}>
                            Submit
                        </Button>
                        <Button basic color='red' onClick={() => handleProgramEdit(currentProgram)}>
                            Cancel
                        </Button>
                    </div>
                </Card.Content>
            </Card>
            <Card fluid color='red'>
                <FormattedProgramSchedule data={formattedProgramDetails}/>
            </Card>
        </Card.Group>
    );
};


const ProgramDetails = () => {

    // context from parent
    const { currentProgram } = useContext(ProgramContext);
    const { setCurrentProgram } = useContext(ProgramContext);
    const { handleBackClick } = useContext(ProgramContext);

    const [rawProgramDetails, setRawProgramDetails] = useState([]);
    const [formattedProgramDetails, setFormattedProgramDetails] = useState([]);
    const [rawWorkouts, setRawWorkouts] = useState([]);
    const [formattedWorkouts, setFormattedWorkouts] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [repeat, setRepeat] = useState(false);
    const [didEdit, setDidEdit] = useState(0);

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
        if(didEdit === 1) {
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

    const updateProgram = (value, attribute) => {
        const program = [...currentProgram];
        program[attribute] = value;
        setCurrentProgram(program);
    }

    const handleProgramEdit = () => {

    }

    return (
        <div className={"div-card-parent"}>
            <Card.Group itemsPerRow={isMobile ? undefined : 2}>
                <Card fluid color='red' header={currentProgram['name']} description={currentProgram['description']}
                      meta={currentProgram['type']}/>
                <Card fluid color='red'>
                    <FormattedProgramSchedule data={formattedProgramDetails}/>
                </Card>
            </Card.Group>
            <Card.Group stackable={true}>
                <WorkoutContext.Provider value={{ setDidEdit, setFormattedWorkouts }}>
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