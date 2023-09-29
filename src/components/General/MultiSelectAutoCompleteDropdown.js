import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {fuzzySearchForAutoComplete} from "../Settings/api";

const MultiSelectAutoCompleteDropdown = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        if (searchQuery.length >= 3) {
            // Simulating a database query using a setTimeout
            fuzzySearchForAutoComplete(searchQuery)
                .then((results) => {
                    const serializeResults = results.map(value => {
                        return { key: value.id, value: value.id, text: value.channel_name }
                    });
                    setOptions(serializeResults);
                })
        }
    }, [searchQuery]);

    return (
        <Dropdown
            placeholder='Select...'
            fluid
            search
            selection
            options={options}
            value={selectedValues}
            onSearchChange={(e, { searchQuery }) => setSearchQuery(searchQuery)}
            onChange={(e, { value }) => setSelectedValues(value)}
        />
    );
}

export default MultiSelectAutoCompleteDropdown;
