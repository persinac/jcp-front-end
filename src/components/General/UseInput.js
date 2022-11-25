import React, {useState} from "react";

// this is not working, but on the right track
const useInput = ({ type }) => {
    const [value, setInput] = useState("");
    const input = <input type={type} value={value} onInput={(e) => setInput(e.target.value)} />;
    return [value, input];
};

export default useInput;