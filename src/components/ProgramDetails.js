import React, {useContext, useEffect, useState} from "react";
import {
    getWorkoutsByProgramId,
    updateProgram
} from "../api"
import {Button, Card} from "semantic-ui-react";
import {ProgramContext, WorkoutContext} from '../programContext';
import WorkoutComponent from "./WorkoutComponent";
import {ProgramDetailsHeader} from "./ProgramDetailsHeader";

const ProgramDetails = () => {

    // context from parent
    const {currentProgram} = useContext(ProgramContext);
    const {setCurrentProgram} = useContext(ProgramContext);
    const {handleBackClick} = useContext(ProgramContext);

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
        getWorkoutsByProgramId(currentProgram['id'])
            .then(response => setRawWorkouts(response))
    }, [currentProgram]);

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

        setFormattedWorkouts(restructuredData)
    }, [rawWorkouts])

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
            } else {
                setIsProgramEdit(false)
            }
        } else {
            setIsProgramEdit(true)
        }
    }

    return (
        <div className={"div-card-parent"}>
            <ProgramDetailsHeader handleProgramEdit={handleProgramEdit} currentProgram={currentProgram}
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