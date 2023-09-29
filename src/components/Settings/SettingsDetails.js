import React, {useContext, useState} from "react";
import {
    Button,
    Card, Checkbox,
    Form,
    Grid
} from "semantic-ui-react";
import '../../sidecar.css';
import {SettingsContext} from "./settingsContext";
import {updateDiscordSettings} from "./api"; // custom CSS file

const ReadOnlySettings = ({handleEdit}) => {
    const { currentSetting} = useContext(SettingsContext)
    return (
        <Card fluid color={"blue"}>
            <Card.Content>
                <Card.Header>{currentSetting['channel_name']}</Card.Header>
                <Card.Description>
                    <Grid celled>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                {currentSetting['channel']}
                            </Grid.Column>
                            <Grid.Column>
                                {currentSetting['is_active']}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui one buttons'>
                    <Button basic color='green' onClick={() => handleEdit()}>
                        Edit
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
}

export const EditSetting = ({handleEdit}) => {
    const { currentSetting, setCurrentSetting} = useContext(SettingsContext)
    const [isActive, setIsActive] = useState(!!currentSetting['is_active']);

    const updateSettingValues = (value, attribute) => {
        const setting = {...currentSetting};
        setting[attribute] = value;
        setCurrentSetting(setting);
    }

    const handleSettingIsActive = (event, data) => {
        setIsActive(data.checked)
        updateSettingValues(data.checked ? 1 : 0, "is_active")
    }

    return (
        <Card fluid color='blue'>
            <Card.Content>
                <Card.Header>Setting</Card.Header>
                <Card.Description>
                    <Form.Group widths='equal'>
                        <Form.Input fluid label='Channel Name' placeholder='Degenerates'
                                    value={currentSetting.channel_name}
                                    onChange={(e) => updateSettingValues(e.target.value, "channel_name")}
                        />
                        <Form.Input fluid label='Discord Hook' placeholder='https://discord.com/api/webhooks/114...'
                                    value={currentSetting.channel}
                                    onChange={(e) => updateSettingValues(e.target.value, "channel")}
                        />
                        <Form.Field/>
                        <br/>
                        <Checkbox toggle
                                  checked={isActive}
                                  onChange={handleSettingIsActive}
                        />
                    </Form.Group>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => handleEdit(currentSetting, true)}>
                        Submit
                    </Button>
                    <Button basic color='red' onClick={() => handleEdit({}, false)}>
                        Cancel
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
};

const SettingDetails = () => {
    const { handleBackClick,  setCurrentSetting } = useContext(SettingsContext)
    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = (config, submit) => {
        if (isEdit) {
            if(submit) {
                updateDiscordSettings([config])
                    .then((results) => {
                        console.log(results)
                        setCurrentSetting(config)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => setIsEdit(false))
            } else {
                setIsEdit(false)
            }
        } else {
            setIsEdit(true)
        }
    }

    return (
        <div className={"div-card-parent"}>
            {isEdit ?
                <EditSetting handleEdit={handleEdit} /> :
                <ReadOnlySettings handleEdit={handleEdit}/>
            }
            <Button primary onClick={handleBackClick}>Back</Button>
        </div>
    )
}


export default SettingDetails;