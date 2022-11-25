import React, {useEffect, useState} from "react";
import {Dropdown, Grid, Input} from "semantic-ui-react";

const MovementRow = ({idx, movementItem, setMovementList}) => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [movement, setMovement] = useState({'day': '', 'week': '', 'description': ''});
    const [movementDescription, setMovementDescription] = useState(movementItem['description']);
    const [dayOptions, setDayOptions] = useState([]);
    const [weekOptions, setWeekOptions] = useState([]);

    useEffect(() => {
        parseValueOptionsForDayDropdown()
        parseValueOptionsForWeekDropdown()
        setMovement(movementItem)
    }, [movementItem])

    const parseValueOptionsForDayDropdown = () => {
        const listOfObjs = []
        for (let step = 0; step < 8; step++) {
            listOfObjs.push({ key: step, value: step, text: step })
        }
        setDayOptions(listOfObjs)
    }

    const parseValueOptionsForWeekDropdown = () => {
        const listOfObjs = []
        for (let step = 0; step < 5; step++) {
            listOfObjs.push({ key: step, value: step, text: step })
        }
        setWeekOptions(listOfObjs)
    }

    const DayDropdown = ({idx}) => (
        <Dropdown
            placeholder='Day'
            fluid
            selection
            clearable
            value={movement['day']}
            options={dayOptions}
            onChange={setMovementData}
            attribute={'day'}
            idx={idx}
        />
    )

    const WeekDropdown = ({idx}) => (
        <Dropdown
            placeholder='Week'
            fluid
            selection
            clearable
            value={movement['week']}
            options={weekOptions}
            onChange={setMovementData}
            attribute={'week'}
            idx={idx}
        />
    )

    const setMovementData = (event, {value, attribute, idx}) => {
        event.persist()
        switch (attribute) {
            case 'day':
            case 'week':
                setMovement(existingItem => {
                    existingItem[attribute] = value
                    return {...existingItem}
                })
                setMovementList(idx, movement)
                break;
        }

    }

    const setTextMovementData = (value, attribute, idx) => {
        const x = movement
        switch (attribute) {
            case 'description':
                setMovementDescription(value)
                // x['description'] = value
                // setMovement(x)
                // setMovementList(idx, movement)
                break;
        }
    }

    /***
        Day: DD
        Week: DD
        Description
        Sets
        Reps
        Load Type: RPE, Percentage, Add Weight -> DD
        Is RM: checkbox
        Is Accessory: checkbox
     */
    return (
        <Grid.Row key={idx} columns={3}>
            <Grid.Column>
                <div>
                    <DayDropdown idx={idx}/>
                </div>
            </Grid.Column>
            <Grid.Column>
                <div>
                    <WeekDropdown idx={idx}/>
                </div>
            </Grid.Column>
            <Grid.Column>
                <div>
                    <Input
                        type="text"
                        placeholder="Movement Description"
                        onChange={(e) => setTextMovementData(e.target.value, 'description', idx)}
                        value={movementDescription}
                        idx={idx}
                        attribute={'description'}
                    />
                </div>
            </Grid.Column>
        </Grid.Row>
    )
}



export default MovementRow;