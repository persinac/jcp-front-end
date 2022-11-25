import React, {useEffect, useState} from "react";
import {Dropdown, Grid, Input} from "semantic-ui-react";
import ButtonComponent from "./General/Button";
import MovementInput from "./Movement";
import MovementListComponent from "./MovementList";

/*****
 * How could we make the input easier to use? Make is a self contained function with its own state
 * function useInput({type ... }) { const [...] = useState(""); const input = <input ...> return [value, input]}
* */
const UserInput = () => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [programName, setProgramName] = useState("");
    const [programType, setProgramType] = useState("");
    const [programStartDate, setProgramStartDate] = useState("");
    const [programEndDate, setProgramEndDate] = useState("");
    const [modList, setModList] = useState([]);
    const [modAttrList, setModAttrList] = useState([]);
    const [file, setFile] = useState(null);
    const [selectVal, setSelectVal] = useState('');
    const [text, setText] = useState([]);
    const [data, setAPIData] = useState([]);
    const [valueOptions, setValueOptions] = useState([]);
    const [helmBuildData, setHelmBuildData] = useState([]);
    const [arms_build_data, setArmsBuildData] = useState([]);
    const [chest_build_data, setChestBuildData] = useState([]);
    const [legs_build_data, setLegsBuildData] = useState([]);
    const [class_build_data, setClassBuildData] = useState([]);
    const [raw_build_data, setRawBuildData] = useState([]);

    useEffect(() => {
        getModData()
        getModAttrData()
    }, [])

    useEffect(() => {
        parseValueOptionsForDropdown()
    }, [modList, modAttrList])

    const parseValueOptionsForDropdown = () => {
        const listOfObjs = []
        modList.forEach((val, idx) => {
            listOfObjs.push({ key: val['id'], value: val['id'], text: val['name'] })
        })
        setValueOptions(listOfObjs)
    }

    const outputBuildData = (data) => {
        console.log(data)
        return (
            <p>{[...data]}</p>
        )
    }

    const DropdownExampleSearchSelection = ({piece, idx}) => (
        <Dropdown
            placeholder='Select Mod'
            fluid
            search
            selection
            clearable
            value={helmBuildData[idx]}
            options={valueOptions}
            onChange={setBuildData}
            piece={piece}
            idx={idx}
        />
    )

    const DropdownNumerical = ({piece, idx}) => (
        <Dropdown
            placeholder='Select Mod'
            fluid
            selection
            clearable
            value={helmBuildData[idx]}
            options={valueOptions}
            onChange={setBuildData}
            piece={piece}
            idx={idx}
        />
    )

    const setBuildData = (event, {value, piece, idx}) => {
        event.persist()
        switch (piece) {
            case 'helm':
                setHelmBuildData(existingItems => {
                    existingItems[idx] = value
                    return [...existingItems]
                })
                break;
            case 'arms':
                setArmsBuildData(value)
                break;
            case 'chest':
                setChestBuildData(value)
                break;
            case 'legs':
                setLegsBuildData(value)
                break;
            case 'class':
                setClassBuildData(value)
                break;
        }
    }

    const translateSymbol = (symbolText) => {
        switch (symbolText) {
            case "percentage":
                return "%";
            case "addition":
                return "+";
            case "subtraction":
                return "-";
            default:
                return "&&";
        }
    }

    const outputRawAsStuff = () => {
        if (!!raw_build_data && raw_build_data.length > 0) {
            return raw_build_data.map((ts, i) => {
                return (
                    <p>{ts['impact']} {translateSymbol(ts['value_modifier'])}{ts['curr_value']}</p>
                )
            });
        }
    }

    const submitValue = () => {
        const frmdetails = {
            'First Name' : inVal,
            'File' : file,
            'Phone' : text,
            'selectVal' : selectVal
        }
        console.log(frmdetails);
    }


    const getModData = () => {
        fetch(`https://destinybuildcraft.io/api/mods`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((apiData) => {
                console.log(apiData)
                apiData.json().then((moreData) => {
                    setModList(moreData['data'])
                })
            });
    }

    const getModAttrData = () => {
        fetch(`https://destinybuildcraft.io/api/mods/attributes`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((apiData) => {
                console.log(apiData)
                apiData.json().then((moreData) => {
                    setModAttrList(moreData['data'])
                })
            });
    }

    const postBuildData = () => {
        fetch(`https://destinybuildcraft.io/api/build`,
            {
                method: "POST",
                body: JSON.stringify({"mod_ids": helmBuildData}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((apiData) => {
                console.log(apiData)
                apiData.json().then((moreData) => {
                    console.log(moreData)
                    setRawBuildData(moreData.data)
                })

            });
    }

    /***
     * Flow:
     *  - Create Program (or select existing one)
     *  - Create the program schedule (start date and end date)
     *  - Add movements and such
     *  - Assign users to the program
     */
    return (
        <div>
            <div className="d-flex flex-row justify-content-center">
                <h2>Inputs</h2>
            </div>
            <div>
                <Grid verticalAlign={"middle"}>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <div>
                                <Input type="text" placeholder="Program Name" onChange={(e) => setProgramName(e.target.value)} />
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div>
                                <input type="text" placeholder="Program Type" onChange={(e) => setProgramType(e.target.value)} />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid verticalAlign={"middle"}>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <div>
                                <input type="text" placeholder="Program Start Date" onChange={(e) => setProgramStartDate(e.target.value)} />
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div>
                                <input type="text" placeholder="Program Start Date" onChange={(e) => setProgramEndDate(e.target.value)} />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <MovementListComponent />
                <ButtonComponent onClickFunction={postBuildData} label={"Submit"}/>
                {/*<div className={`col-md-4 mb-3`}>*/}
                {/*    <Dropdown>*/}
                {/*        <Dropdown.Toggle variant="success" id="dropdown-basic">*/}
                {/*            Dropdown Button*/}
                {/*        </Dropdown.Toggle>*/}

                {/*        <Dropdown.Menu>*/}
                {/*            <Dropdown.Item eventKey="1" onSelect={(e) => setSelectVal(e)}>Action</Dropdown.Item>*/}
                {/*            <Dropdown.Item eventKey="2" onSelect={(e) => setSelectVal(e)}>Another action</Dropdown.Item>*/}
                {/*            <Dropdown.Item eventKey="3" onSelect={(e) => setSelectVal(e)}>Something else</Dropdown.Item>*/}
                {/*        </Dropdown.Menu>*/}
                {/*    </Dropdown>*/}
                {/*    <Table striped bordered hover>*/}
                {/*        <thead>*/}
                {/*            <tr>*/}
                {/*                <th>#</th>*/}
                {/*                <th>Mod Name</th>*/}
                {/*                <th>Slot</th>*/}
                {/*                <th>Affinity</th>*/}
                {/*            </tr>*/}
                {/*        </thead>*/}
                {/*        <tbody>*/}
                {/*        {buildProductHeaderTRs()}*/}
                {/*        </tbody>*/}
                {/*    </Table>*/}
                {/*    <ButtonComponent onClickFunction={getSomeData} label={"Get Data"}/>*/}

                {/*</div>*/}
            </div>
            <div>
                {outputRawAsStuff()}
            </div>
        </div>
    )
}



export default UserInput;