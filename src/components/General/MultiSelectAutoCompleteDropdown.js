import React, { useState, useEffect } from 'react';
import {Dropdown, Form} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {fuzzySearchForAutoComplete} from "../Settings/api";

const MultiSelectAutoCompleteDropdown = ({ onSelect, excludeIDs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        if (searchQuery.length >= 3) {
            // Simulating a database query using a setTimeout
            fuzzySearchForAutoComplete(searchQuery)
                .then((results) => {
                    // Filter out excluded items.
                    const filteredData = results.filter(
                        (item) => !excludeIDs.includes(item.id)
                    );


                    const serializeResults = filteredData.map(value => {
                        return { key: value.id, value: value.id, text: value.channel_name }
                    });

                    setOptions(serializeResults);
                })
        }
    }, [searchQuery]);

    const handleSelectItem = (e, { value }) => {
        onSelect(value);
        setSelectedValues([]); // Reset the input value after selecting an item.
    };

    return (
        <Form style={{float: "left", width: "50%", marginBottom: "10px"}}>
            <Form.Dropdown
                label="Stored Discord Configs"
                placeholder='Select...'
                fluid
                search
                selection
                options={options}
                value={selectedValues}
                onSearchChange={(e, { searchQuery }) => setSearchQuery(searchQuery)}
                onChange={handleSelectItem} />
        </Form>
    );
}

export default MultiSelectAutoCompleteDropdown;
