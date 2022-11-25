import React, {useEffect, useState} from "react";
import {Grid} from "semantic-ui-react";
import ButtonComponent from "./General/Button";
import MovementRow from "./Movement";

const MovementListComponent = () => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [movementList, setMovementList] = useState([]);

    useEffect(() => {
        // eventually retrieve movement data
    }, [])

    const setSpecificMovement = (idx, movement) => {
        setMovementList(existingItems => {
            existingItems[idx] = movement
            return [...existingItems]
        });
    }

    const addMovement = () => {
        setMovementList(existingItems => {
            existingItems.push({'day': '', 'week': '', 'description': ''})
            return [...existingItems]
        });
    }

    const removeMovement = () => {
        setMovementList(existingItems => {
            existingItems.pop()
            return [...existingItems]
        });
    }

    const ListOfMovementRows = () => {
        if (!!movementList && movementList.length > 0) {
            console.log("WE GOT MOVEMENTS");
            return movementList.map((ts, i) => {
                console.log(ts)
                /* this could be cleaner, but will do for now */
                // console.log(ts.seq[0]);
                return (
                    <MovementRow idx={i} movementItem={ts} setMovementList={setSpecificMovement}/>
                )
            });
        }
        return null
    }

    const AddMovement = () => (
        <div className="d-flex flex-row justify-content-center">
            <div className="p-2">
                <ButtonComponent variant={"success"} onClickFunction={addMovement} label={"Add Movement"}/>
                <ButtonComponent variant={"danger"} onClickFunction={removeMovement} label={"Remove Movement"}/>
            </div>
        </div>
    );

    /***
     * Add movements and such
     */
    return (
        <div>
            <div>
                <Grid verticalAlign={"middle"}>
                    <ListOfMovementRows />
                </Grid>
            </div>
            <AddMovement />
        </div>
    )
}



export default MovementListComponent;