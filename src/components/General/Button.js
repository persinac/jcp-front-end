import React from "react";
import Button from "react-bootstrap/Button";

const ButtonComponent = (props) => {
    return (
        <Button variant={props.variant || "primary"} style={{ margin: ".5em"}} onClick={props.onClickFunction}>{props.label}</Button>
    )
};

export default ButtonComponent;