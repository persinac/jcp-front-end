import React from "react";
import {Input} from "semantic-ui-react";

const ReadEditInput = ({value = "", onChangeHandler, readOnly = false, placeholder = 'Enter value', ...props}) => {
    if (readOnly) {
        return (<div>{value}</div>)
    } else {
        return (
            <Input
                fluid
                value={value}
                readOnly={readOnly}
                placeholder={placeholder}
                onChange={onChangeHandler}
                {...props}
            />
        );
    }
};

export default ReadEditInput;
