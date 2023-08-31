import React, {useEffect, useState} from "react";
import {getProgramScheduleByProgramId, getWorkoutsByProgramId} from "../api"
import {Button, Card, Header} from "semantic-ui-react";
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

const WorkoutMovement = ({day, movements}) => {
    return (
        <Card fluid color='blue'>
            <Card.Content>
                <Card.Header>Day {day}</Card.Header>
                <Card.Description key={day}>
                    {movements.map(movement => (
                        <p key={movement.movement_description}>{movement.movement_description}</p>
                    ))
                    }
                </Card.Description>
            </Card.Content>
        </Card>
    )
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
                    <WorkoutMovement day={item.day} movements={item.movements}/>
                )) : <Card.Description/>}
            </Card.Group>
        </Card.Content>

    );
};

const FormattedWorkoutCard = ({isMobile, workoutData}) => {
    return (
        workoutData.map(item => (
                <Card fluid color='red'>
                    <FormattedWorkout isMobile={isMobile} week={item.week} workoutDetails={item.days}/>
                </Card>
            )
        ));
};

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
            const {week, program_id, day, movement_description, movement_notes} = item;

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
                <FormattedWorkoutCard workoutData={formattedWorkouts} isMobile={isMobile}/>
            </Card.Group>
            <Button primary onClick={handleBackClick}>Back</Button>
            <Button primary onClick={handleBackClick}>Repeat</Button>
            <Button primary onClick={handleBackClick}>Assign</Button>
            <Button primary onClick={handleBackClick}>View Workout</Button>
        </div>
    )
}


export default ProgramDetails;