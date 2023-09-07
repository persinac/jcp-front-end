import React, {useContext, useState} from "react";
import {Button, Card, Icon} from "semantic-ui-react";
import {ProgramContext, WorkoutContext} from '../programContext';
import EditWorkout from "./EditWorkout";
import {createNewWorkouts, removeWorkouts, updateWorkouts} from "../api";

function fullyFlatten(array) {
    const stack = [...array];
    const result = [];

    while (stack.length) {
        const next = stack.pop();
        if (Array.isArray(next)) {
            stack.push(...next);  // If it's an array, push all of its elements back onto the stack
        } else {
            result.push(next);   // If it's not an array, push onto the result
        }
    }

    return result.reverse();  // We reverse because we've been using pop/push for LIFO
}

const WorkoutComponent = ({isMobile, workoutData}) => {
    // context from parent
    const { currentProgram } = useContext(ProgramContext);
    const { setDidEdit, setFormattedWorkouts } = useContext(WorkoutContext);

    // local state
    const [isEdit, setIsEdit] = useState(false);
    const [dayEdit, setDayEdit] = useState(0);
    const [weekEdit, setWeekEdit] = useState(0);
    const [movementsToEdit, setMovementsToEdit] = useState([]);

    // Function to submit the updated movements to the API
    const handleSetEdit = (week, day, movements) => {
        setMovementsToEdit(movements)
        setDayEdit(day)
        setWeekEdit(week)
        setIsEdit(true)
    };

    const handleAddWeek = (week) => {
        console.log(workoutData)
        let updatedworkoutData = [...workoutData]
        updatedworkoutData.push({
            program_id: currentProgram['id'],
            week: week,
            days: [],
        })
        setFormattedWorkouts(updatedworkoutData)
    };

    const handleCopyWeek = (week) => {
        let updatedWorkoutData = [...workoutData]
        const weekToCopy = updatedWorkoutData.filter((weeks) => {
            return weeks.week === week
        })[0]
        const deepCopy = JSON.parse(JSON.stringify(weekToCopy));
        const newMovements = deepCopy.days.map((item, idx) => {
            return item.movements.map((movements, idx) => {
                return {
                    id: null,
                    programId: currentProgram['id'],
                    week: deepCopy.week + 1,
                    day: item.day,
                    movementDescription: movements['movement_description'],
                    movementNotes: movements['movement_notes'],
                    movementOrder: movements['movement_order'] || idx + 1
                }
            })
        })
        createNewWorkouts(newMovements.flat()).then((result) => {
            console.log(result)
            setDidEdit(1)
        })
    };

    const handleRemoveWeek = async (week) => {
        let updatedWorkoutData = [...workoutData]

        const weekToRemove = updatedWorkoutData.filter((weeks) => {
            return weeks.week === week
        })[0]
        const movementsToRemove = weekToRemove.days.map((item, idx) => {
            return item.movements.map((movements, idx) => {
                return movements.id
            })
        })
        const removalResults = await removeWorkouts(movementsToRemove.flat())
        console.log(removalResults)

        const weeksToUpdate = updatedWorkoutData.filter((weeks) => {
            return weeks.week > week
        })

        if(weeksToUpdate.length > 0) {
            const deepCopy = JSON.parse(JSON.stringify(weeksToUpdate));
            const movementsToUpdate = deepCopy.map((weekWorkout) => {
                return weekWorkout.days.map((item, idx) => {
                    return item.movements.map((movements, idx) => {
                        return {
                            id: movements['id'],
                            programId: currentProgram['id'],
                            week: weekWorkout.week - 1,
                            day: item.day,
                            movementDescription: movements['movement_description'],
                            movementNotes: movements['movement_notes'],
                            movementOrder: movements['movement_order'] || idx + 1
                        }
                    })
                })
            })
            const updateResults = await updateWorkouts(fullyFlatten(movementsToUpdate))
            console.log(updateResults)
        }
        setDidEdit(1)
    };

    // Function to submit the updated movements to the API
    const handleSubmit = async (movementEditsToSubmit, movementsToRemove, submit) => {
        if(!submit) {
            setIsEdit(false)
            setDayEdit(0)
            setWeekEdit(0)
            setMovementsToEdit([])
            setDidEdit(1)
            return null
        }
        let newMovements = movementEditsToSubmit.filter((movement) => {return movement.id === null})
        movementEditsToSubmit = movementEditsToSubmit.filter((movement) => {return movement.id !== null})

        if(newMovements.length > 0) {
            newMovements = newMovements.map((item, idx) => {
                return {
                    id: null,
                    programId: currentProgram['id'],
                    week: weekEdit,
                    day: dayEdit,
                    movementDescription: item['movement_description'],
                    movementNotes: item['movement_notes'],
                    movementOrder: item['movement_order'] || idx + 1
                }
            })
            const newWorkoutResponse = await createNewWorkouts(newMovements)
            console.log(newWorkoutResponse)
        }
        if(movementEditsToSubmit.length > 0) {
            movementEditsToSubmit = movementEditsToSubmit.map((item, idx) => {
                return {
                    id: item['id'],
                    programId: currentProgram['id'],
                    week: weekEdit,
                    day: dayEdit,
                    movementDescription: item['movement_description'],
                    movementNotes: item['movement_notes'],
                    movementOrder: item['movement_order'] || idx + 1
                }
            })
            const updateWorkoutResponse = await updateWorkouts(movementEditsToSubmit)
            console.log(updateWorkoutResponse)
        }

        if(movementsToRemove.length > 0) {
            const ids = movementsToRemove.map(item => item.id)
            const removeWorkoutResponse = await removeWorkouts(ids)
            console.log(removeWorkoutResponse)
        }

        setIsEdit(false)
        setDayEdit(0)
        setWeekEdit(0)
        setMovementsToEdit([])

        if([newMovements.length, movementEditsToSubmit.length, movementsToRemove.length].some(num => num > 0) && submit) {
            console.log("Set did edit to 1")
            setDidEdit(1)
        }
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
        if (isEdit && weekEdit == week && dayEdit == day) {
            showEditComponent = true
        }
        return showEditComponent ? <EditWorkout handleSubmit={handleSubmit} day={day}
                                                initialMovements={movementsToEdit}/> :
            <WorkoutCard week={week} day={day} movements={movements}/>
    }

    const FormattedWorkout = ({isMobile, week, workoutDetails}) => {
        let itemsPurRow = workoutDetails ? workoutDetails.length : undefined

        const workoutCards = workoutDetails ? workoutDetails.map(item => (
            <WorkoutMovement week={week} day={item.day} movements={item.movements}/>
        )) : <Card.Description/>

        if (itemsPurRow < 7) {
            itemsPurRow += 1
            workoutCards.push(AddDayCard(week, itemsPurRow))
        }

        if (isMobile) {
            itemsPurRow = undefined
        }
        let weekAndDayMovements;
        let showEditComponent = false;
        if (isEdit && weekEdit == week) {
            showEditComponent = true
            weekAndDayMovements = workoutDetails.filter((dayMovements) => {
                if(dayMovements.day == dayEdit) {
                    return dayMovements
                }
            })
            if(weekAndDayMovements.length > 0) {
                weekAndDayMovements = weekAndDayMovements[0].movements
            }
        }
        return (
            <Card.Content>
                <Card.Header className={"week-card"}>Week {week}</Card.Header>
                {
                    showEditComponent ? <EditWorkout handleSubmit={handleSubmit} day={dayEdit}
                                                     initialMovements={weekAndDayMovements}/> :
                        <Card.Group itemsPerRow={itemsPurRow}>
                            {workoutCards}
                        </Card.Group>
                }
            </Card.Content>
        );
    };

    const AddDayCard = (week, day) => {
        return (
            <Card fluid color='red' onClick={() => handleSetEdit(week, day, [])}>
                <Card.Content>
                    <Card.Description>
                        Add Day
                        <Icon name='plus' size='large'/>
                    </Card.Description>
                </Card.Content>
            </Card>
        )
    }

    const AddWeekCard = (week) => {
        return (
            <Card fluid color='red' onClick={() => handleAddWeek(week)}>
                <Card.Content>
                    <Card.Description>
                        Add Week
                        <Icon name='plus' size='large'/>
                    </Card.Description>
                </Card.Content>
            </Card>
        )
    }

    const buildWorkoutCards = (workoutData) => {
        const workoutCards = workoutData.map(item => (
                <Card fluid color='red'>
                    <FormattedWorkout isMobile={isMobile} week={item.week} workoutDetails={item.days}/>
                    <Card.Content extra>
                        <Button primary onClick={() => handleCopyWeek(item.week)}>Copy Week</Button>
                        <Button negative onClick={() => handleRemoveWeek(item.week)}>Remove Week</Button>
                    </Card.Content>
                </Card>
            )
        )
        workoutCards.push(AddWeekCard(workoutCards.length+1))
        return workoutCards
    }

    return buildWorkoutCards(workoutData)
}

export default WorkoutComponent;