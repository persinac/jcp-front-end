import React, {useEffect, useState} from "react";
import {Card, Header, List} from "semantic-ui-react";

export const EditProgramAssignment = ({initialAssignment, originalAssignment}) => {
    const [assignment, setAssignment] = useState(initialAssignment);

    useEffect(() => {
        setAssignment(initialAssignment);
    }, [initialAssignment]);

    const handleAddOrRemoveAssignment = (idx, addOrRemove) => {
        console.log(originalAssignment)
        const assignments = [...assignment]
        assignments[idx].assigned_to_program = addOrRemove
        setAssignment(assignments)
    }

    return (
        <Card.Content>
            <Card.Header>Athletes</Card.Header>
            <Card.Description>
                <Header as='h4'>Assigned</Header>
                <List divided>
                    {assignment.length > 0 ?
                        assignment.map((ass, idx) => {
                            if(ass.assigned_to_program === 1) {
                                return (
                                    <List.Item>
                                        <List.Content style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <List.Description>{ass.name}</List.Description>
                                            <List.Icon name='cancel' color="red" onClick={() => handleAddOrRemoveAssignment(idx, 0)}/>
                                        </List.Content>
                                    </List.Item>
                                )
                            }
                        }) : <div/>
                    }
                </List>
                <br/>
            </Card.Description>
            <Card.Description>
                <Header as='h4'>Not Assigned</Header>
                <List divided>
                    {
                        assignment.map((ass, idx) => {
                            if(ass.assigned_to_program === 0) {
                                return (
                                    <List.Item>
                                        <List.Content style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <List.Description>{ass.name}</List.Description>
                                            <List.Icon name='plus' color="green" onClick={() => handleAddOrRemoveAssignment(idx, 1)}/>
                                        </List.Content>
                                    </List.Item>
                                )
                            }
                        })
                    }
                </List>
            </Card.Description>
        </Card.Content>
    );
};