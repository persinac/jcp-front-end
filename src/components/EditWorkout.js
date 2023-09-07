import React, {useState} from "react";
import {Button, Card, Form, Icon, Input, Label} from "semantic-ui-react";

const EditWorkout = ({handleSubmit, day, initialMovements}) => {
    const [movements, setMovements] = useState(initialMovements);
    const [movementsToRemove, setMovementsToRemove] = useState([]);

    // Function to update a specific movement description
    const updateMovement = (index, newDescription) => {
        const newMovements = [...movements];
        newMovements[index].movement_description = newDescription;
        setMovements(newMovements);
    };

    const updateMovementNotes = (index, newNotes) => {
        const newMovements = [...movements];
        newMovements[index].movement_notes = newNotes;
        setMovements(newMovements);
    };

    const changeMovementOrder = (index, swapPlace) => {
        const tempArray = [...movements];
        const tempItem = tempArray[index];
        const newIndex = index + swapPlace

        if(newIndex >= 0 && newIndex < tempArray.length) {
            tempArray[index] = tempArray[newIndex];
            tempArray[newIndex] = tempItem;
            tempArray[index].movement_order = index
            tempArray[newIndex].movement_order = newIndex
            setMovements(tempArray);
        }
    };

    // Function to add movement
    const addMovement = () => {
        const newMovements = [...movements];
        newMovements.push({
            id: null,
            movement_description: "",
            movement_notes: "",
        })
        setMovements(newMovements);
    };

    // Function to remove movement
    const removeMovement = (index) => {
        const newMovements = [...movements];
        const copyOfMovements = [...movements];
        const currentMovementsToRemove = [...movementsToRemove];
        newMovements.splice(index, 1)
        currentMovementsToRemove.push(copyOfMovements[index])
        setMovementsToRemove(currentMovementsToRemove)
        setMovements(newMovements);
    };

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>Day {day}</Card.Header>
                <Card.Description>
                    {movements.map((movement, index) => (
                        <div key={movement.id}>
                            <Form>
                                <Form.Group widths='equal'>
                                    <Form.Input fluid label='Movement' placeholder='Back squat 3x5 @ RPE 7'
                                                value={movement.movement_description}
                                                onChange={(e) => updateMovement(index, e.target.value)}/>
                                    <Form.Input fluid label='Movement Notes' placeholder='ass to grass'
                                                value={movement.movement_notes}
                                                onChange={(e) => updateMovementNotes(index, e.target.value)}/>
                                    <Button icon onClick={() => changeMovementOrder(index, -1)}>
                                        <Icon name='angle up'/>
                                    </Button>
                                    <Button icon onClick={() => changeMovementOrder(index, 1)}>
                                        <Icon name='angle down'/>
                                    </Button>
                                </Form.Group>
                                <Form.Button onClick={() => removeMovement(index)}>Remove Movement</Form.Button>
                            </Form>
                        </div>
                    ))}
                    <div>
                        <Button icon labelPosition='left' onClick={() => addMovement()}>
                            <Icon name='plus' />
                            Add Movement
                        </Button>
                    </div>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => handleSubmit(movements, movementsToRemove, true)}>
                        Submit
                    </Button>
                    <Button basic color='red' onClick={() => handleSubmit(movements, movementsToRemove, false)}>
                        Cancel
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
}

export default EditWorkout;