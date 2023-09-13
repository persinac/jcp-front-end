import React, {useContext, useEffect, useState} from "react";
import {
    createProgramAssignments, deleteProgramAssignments, getAthleteById,
    getProgramAssignmentForAssignment,
    getProgramScheduleByProgramId,
    getWorkoutsByProgramId, updateAthlete,
    updateProgram, updateProgramAssignments, updateProgramSchedule
} from "../api"
import {
    Button,
    Card, Checkbox,
    Divider,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Label,
    List,
    Segment
} from "semantic-ui-react";
import '../sidecar.css'; // custom CSS file
import {AthleteContext} from "../athleteContext";

const ReadOnlyAthleteHeader = ({selectedAthlete, handleAthleteEdit}) => {
    return (
        <Card fluid color={"blue"}>
            <Card.Content>
                <Card.Header>{selectedAthlete['name']}</Card.Header>
                <Card.Description>
                    <Grid celled>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                {selectedAthlete['discord_name']}
                            </Grid.Column>
                            <Grid.Column>
                                {selectedAthlete['is_active']}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui one buttons'>
                    <Button basic color='green' onClick={() => handleAthleteEdit()}>
                        Edit
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
}

export const EditAthleteHeader = ({selectedAthlete, handleAthleteEdit}) => {
    const [athleteEdit, setAthleteEdit] = useState(selectedAthlete);
    const [isActive, setIsActive] = useState(!!selectedAthlete['is_active']);

    const updateAthleteValues = (value, attribute) => {
        const athlete = {...athleteEdit};
        athlete[attribute] = value;
        setAthleteEdit(athlete);
    }

    const handleAthleteIsActive = (event, data) => {
        setIsActive(data.checked)
        updateAthleteValues(data.checked ? 1 : 0, "is_active")
    }

    return (
        <Card fluid color='blue'>
            <Card.Content>
                <Card.Header>Athlete</Card.Header>
                <Card.Description>
                    <Form.Group widths='equal'>
                        <Form.Input fluid label='Name' placeholder='Jane Smith'
                                    value={athleteEdit.name}
                                    onChange={(e) => updateAthleteValues(e.target.value, "name")}
                        />
                        <Form.Input fluid label='Discord' placeholder='user#1234'
                                    value={athleteEdit.discord_name}
                                    onChange={(e) => updateAthleteValues(e.target.value, "discord_name")}
                        />
                        <Form.Field/>
                            <br/>
                        <Checkbox toggle
                                  checked={isActive}
                                  onChange={handleAthleteIsActive}
                        />
                    </Form.Group>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => handleAthleteEdit(athleteEdit, true)}>
                        Submit
                    </Button>
                    <Button basic color='red' onClick={() => handleAthleteEdit(athleteEdit, false)}>
                        Cancel
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
};

const AthleteDetails = () => {

    // context from parent
    const {currentAthlete} = useContext(AthleteContext);
    const {setCurrentAthlete} = useContext(AthleteContext);
    const {handleBackClick} = useContext(AthleteContext);
    const {isMobile} = useContext(AthleteContext);
    const [isAthleteEdit, setIsAthleteEdit] = useState(false);


    const handleAthleteEdit = (athlete, submit) => {
        if (isAthleteEdit) {
            if(submit) {
                updateAthlete([athlete])
                    .then((results) => {
                        console.log(results)
                        setCurrentAthlete(athlete)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => setIsAthleteEdit(false))
            } else {
                setIsAthleteEdit(false)
            }
        } else {
            setIsAthleteEdit(true)
        }
    }

    return (
        <div className={"div-card-parent"}>
            {isAthleteEdit ?
                <EditAthleteHeader selectedAthlete={currentAthlete} handleAthleteEdit={handleAthleteEdit} /> :
                <ReadOnlyAthleteHeader handleAthleteEdit={handleAthleteEdit} selectedAthlete={currentAthlete}/>
            }
            <Button primary onClick={handleBackClick}>Back</Button>
        </div>
    )
}


export default AthleteDetails;