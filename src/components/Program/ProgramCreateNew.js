import React, {useEffect, useState} from "react";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import {Button, Card, Checkbox, Container, Divider, Icon, Input, Form, TextArea} from "semantic-ui-react";
import ButtonComponent from "../General/Button";
import {postProgramAndSchedule} from "../../api";

/*****
 * How could we make the input easier to use? Make is a self contained function with its own state
 * function useInput({type ... }) { const [...] = useState(""); const input = <input ...> return [value, input]}
* */
const ProgramCreateNew = ({handleNewProgramSubmit}) => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [newProgram, setNewProgram] = useState({name: "", type: "", description: ""});
    const [newProgramSchedule, setNewProgramSchedule] = useState({program_id: null, start_date: new Date(), end_date: new Date()});

    useEffect(() => {}, [])

    const programInputHandler = (e, {value, attribute}) => {
        const copyProgram = {...newProgram}
        copyProgram[attribute] = value
        setNewProgram(copyProgram);
    };

    const programScheduleInputHandler = (e, {value, attribute}) => {
        const copyProgramSchedule = {...newProgramSchedule}
        copyProgramSchedule[attribute] = value
        setNewProgramSchedule(copyProgramSchedule);
    };

    return (
        <div>
            <div className="d-flex flex-row justify-content-center">
                <h2>New Program</h2>
            </div>
            <Form>
                <Form.Group style={{ display: "flex" }}>
                    <Form.Field style={{ flexGrow: "1" }}>
                        <Input placeholder='Program name' value={newProgram.name} onChange={programInputHandler} attribute={"name"}/>
                    </Form.Field>
                    <Form.Field style={{ flexGrow: "1" }}>
                        <Input placeholder='Program Type' value={newProgram.type} onChange={programInputHandler} attribute={"type"}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group style={{ display: "flex" }}>
                    <Form.Field style={{ flexGrow: "1" }}>
                        <SemanticDatepicker  placeholder='Start Date' value={newProgramSchedule.start_date} onChange={programScheduleInputHandler} attribute={"start_date"}/>
                    </Form.Field>
                    <Form.Field style={{ flexGrow: "1" }}>
                        <SemanticDatepicker  placeholder='End Date' value={newProgramSchedule.end_date} onChange={programScheduleInputHandler} attribute={"end_date"}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group style={{ display: "flex" }}>
                    <Form.Field style={{ flexGrow: "1" }}>
                        <TextArea iconPosition='left' placeholder='Program Description' value={newProgram.description} onChange={programInputHandler} attribute={"description"}/>
                    </Form.Field>
                </Form.Group>
            </Form>
            <div>
                {/*<MovementListComponent />*/}
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
                <ButtonComponent onClickFunction={() => handleNewProgramSubmit({program: newProgram, programSchedule: newProgramSchedule}, true)} label={"Submit"}/>
                <ButtonComponent onClickFunction={() => handleNewProgramSubmit({}, false)} label={"Cancel"}/>
            </div>
        </div>
    )
}



export default ProgramCreateNew;