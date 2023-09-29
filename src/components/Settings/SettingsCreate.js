import React, {useContext, useState} from "react";
import {
    Button,
    Card, Checkbox,
    Form
} from "semantic-ui-react";
import '../../sidecar.css';
import {SettingsContext} from "./settingsContext";
import {createDiscordSettings} from "./api"; // custom CSS file

export const EditNewSetting = ({ handleEdit, newSetting, setNewSetting }) => {
    const [isActive, setIsActive] = useState(!!setNewSetting['is_active']);

    const updateSettingValues = (value, attribute) => {
        const setting = {...newSetting};
        setting[attribute] = value;
        setNewSetting(setting);
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
                                    value={newSetting.channel_name}
                                    onChange={(e) => updateSettingValues(e.target.value, "channel_name")}
                        />
                        <Form.Input fluid label='Discord Hook' placeholder='https://discord.com/api/webhooks/114...'
                                    value={newSetting.channel}
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
                    <Button basic color='green' onClick={() => handleEdit(newSetting, true)}>
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

const CreateSetting = () => {
    const { handleBackClick } = useContext(SettingsContext)
    const [newSetting, setNewSetting] = useState({channel: "", channel_name: "", is_active: false});

    const handleEdit = (config, submit) => {
        if(submit) {
            createDiscordSettings([config])
                .then((results) => {
                    console.log(results)
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    handleBackClick()
                })
        } else {
            handleBackClick()
        }
    }

    return (
        <div className={"div-card-parent"}>
            <EditNewSetting handleEdit={handleEdit} newSetting={newSetting} setNewSetting={setNewSetting}/>
            <Button primary onClick={handleBackClick}>Back</Button>
        </div>
    )
}


export default CreateSetting;