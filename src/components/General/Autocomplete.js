import React, { Component, Fragment, useState, useEffect } from "react";
import { Hint } from 'react-autocomplete-hint';


const Autocomplete = (props) => {
    // determine hint data
    const [hintData, setHintData] = useState([]);


    // const getData = async () => {
    //     const res = await axios.get('https://jsonplaceholder.typicode.com/users')
    //     let hintArray = [];
    //     res.data.map((a) => hintArray.push(a.name))
    //     setHintData(hintArray)
    // }
    //
    // useEffect(() => {
    //     getData()
    // });

    return (
        <div className="App">
            <Hint options={hintData} allowTabFill>
                <input className='input-with-hint'
                       value={props.text}
                       onChange={e => props.setText(e.target.value)}
                />
            </Hint>
        </div>
    )
}

export default Autocomplete;