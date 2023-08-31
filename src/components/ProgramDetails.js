import React, {useEffect, useState} from "react";
import {getProgramScheduleByProgramId, getWorkoutsByProgramId} from "../api"
import {Button, Card, Header, Input} from "semantic-ui-react";
import '../sidecar.css'; // custom CSS file

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

const WorkoutComponent = ({isMobile, workoutData}) => {
    const [isEdit, setIsEdit] = useState(false);
    const [dayEdit, setDayEdit] = useState(0);
    const [weekEdit, setWeekEdit] = useState(0);
    const [movementsToEdit, setMovementsToEdit] = useState([]);

    const EditWorkout = ({handleSubmit, day, initialMovements}) => {
        const [movements, setMovements] = useState(initialMovements);

        // Function to update a specific movement description
        const updateMovement = (index, newDescription) => {
            const newMovements = [...movements];
            newMovements[index].movement_description = newDescription;
            setMovements(newMovements);
        };

        return (
            <Card>
                <Card.Header>Day {day}</Card.Header>
                <Card.Description>
                    {initialMovements.map((movement, index) => (
                        <div key={movement.id}>
                            <Input
                                value={movement.movement_description}
                                onChange={(e) => updateMovement(index, e.target.value)}
                            />
                        </div>
                    ))}
                </Card.Description>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='green' onClick={() => handleSubmit(movements, true)}>
                            Submit
                        </Button>
                        <Button basic color='red' onClick={() => handleSubmit(movements, false)}>
                            Cancel
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        );
    }

    // Function to submit the updated movements to the API
    const handleSetEdit = (week, day, movements) => {
        console.log(movements)
        setMovementsToEdit(movements)
        setDayEdit(day)
        setWeekEdit(week)
        setIsEdit(true)
    };

    // Function to submit the updated movements to the API
    const handleSubmit = (movementEditsToSubmit, submit) => {
        console.log(movementEditsToSubmit)
        console.log(submit)
        setIsEdit(false)
        setDayEdit(0)
        setWeekEdit(0)
        setMovementsToEdit([])
    };

    const WorkoutCard = ({week, day, movements}) => {
        return (
            <Card fluid color='blue'>
                <Card.Content>
                    <Card.Header>Day {day}</Card.Header>
                    <Card.Description key={day}>
                        {movements.map(movement => (
                            <p key={movement.id}>{movement.movement_description}</p>
                        ))
                        }
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div>
                        <Button primary onClick={() => handleSetEdit(week, day, movements)}>Edit</Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }

    const WorkoutMovement = ({week, day, movements}) => {
        // if isEdit && week == weekToEdit && day == dayToEdit
        let showEditComponent = false;
        if(isEdit && weekEdit == week && dayEdit == day) {
            showEditComponent = true
        }
        return showEditComponent ? <EditWorkout handleSubmit={handleSubmit} day={day}
                                     initialMovements={movementsToEdit}/> :
            <WorkoutCard week={week} day={day} movements={movements}/>
    }

    const FormattedWorkout = ({isMobile, week, workoutDetails}) => {
        let itemsPurRow = workoutDetails ? workoutDetails.length : undefined
        if (isMobile) {
            itemsPurRow = undefined
        }
        return (
            <Card.Content>
                <Card.Header className={"week-card"}>Week {week}</Card.Header>
                <Card.Group itemsPerRow={itemsPurRow}>
                    {workoutDetails ? workoutDetails.map(item => (
                        <WorkoutMovement week={week} day={item.day} movements={item.movements}/>
                    )) : <Card.Description/>}
                </Card.Group>
            </Card.Content>

        );
    };

    return (
        workoutData.map(item => (
                <Card fluid color='red'>
                    <FormattedWorkout isMobile={isMobile} week={item.week} workoutDetails={item.days}/>
                </Card>
            )
        ))
}

const ProgramDetails = ({handleBackClick, currentProgram}) => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [rawProgramDetails, setRawProgramDetails] = useState([]);
    const [formattedProgramDetails, setFormattedProgramDetails] = useState([]);
    const [rawWorkouts, setRawWorkouts] = useState([]);
    const [formattedWorkouts, setFormattedWorkouts] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
            } else {
                return a.day - b.day;
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
                <WorkoutComponent workoutData={formattedWorkouts} isMobile={isMobile}/>
            </Card.Group>
            <Button primary onClick={handleBackClick}>Back</Button>
            <Button primary onClick={handleBackClick}>Repeat</Button>
            <Button primary onClick={handleBackClick}>Assign</Button>
            <Button primary onClick={handleBackClick}>View Workout</Button>
        </div>
    )
}


export default ProgramDetails;