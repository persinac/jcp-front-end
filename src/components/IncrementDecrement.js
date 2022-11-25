import React, {useState} from "react";
import ButtonComponent from "./General/Button";

const IncrementDecrementComponent = () => {
    const [counter, setCounter] = useState(1);
    const incrementCounter = () => setCounter(counter + 1);
    const decrementCounter = () => setCounter(counter - 1);

    return (
        <div className="d-flex flex-row justify-content-center">
            <div className="p-2">
                <p>My new component</p>
                <p>Counter: {counter}</p>
                <ButtonComponent variant={"success"} onClickFunction={incrementCounter} label={"Increment"}/>
                <ButtonComponent variant={"danger"} onClickFunction={decrementCounter} label={"Decrement"}/>
            </div>
        </div>
    );
}

export default IncrementDecrementComponent;