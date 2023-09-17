import React, {useContext, useState} from "react";
import {
    Button,
    Card,
    Checkbox,
    Grid,
    Icon,
    Input,
    Tab,
    Form,
    List,
    Table,
    Divider,
    Select,
    Dropdown
} from "semantic-ui-react";
import {ProgramContext} from '../programContext';

const IProgramDelivery = {
    id: null,
    program_id: null,
    delivery_discord: null,
    delivery_email: null,
    is_active: null
}

const IProgramDeliveryDiscord = {
    id: null,
    program_delivery_id: null,
    type: "channel",
    channel: null,
    channel_name: null,
    direct_message: null,
    is_active: true
}

const IProgramDeliveryEmail = {
    id: null,
    program_delivery_id: null,
    email_to: null,
    is_active: true
}

const ProgramDelivery = ({isMobile}) => {

    // context from parent
    const {currentProgram} = useContext(ProgramContext);

    const [programDelivery, setProgramDelivery] = useState(IProgramDelivery);
    const [programDeliveryDiscord, setProgramDeliveryDiscord] = useState([]);
    const [programDeliveryEmail, setProgramDeliveryEmail] = useState([]);
    const [isProgramDeliveryEdit, setIsProgramDeliveryEdit] = useState(false);

    // useEffect(() => {
    //     // getWorkoutsByProgramId(currentProgram['id'])
    //     //     .then(response => setRawWorkouts(response))
    // }, []);

    const handleProgramDeliveryEdit = async (programDelivery, submit) => {
        if (isProgramDeliveryEdit) {
            if (submit) {
                console.log(isProgramDeliveryEdit)
                console.log(submit)
                // const modProgramScheduleResult = await createProgramSchedule(newProgramSchedule)
                // const programSchedules = await getProgramScheduleByProgramId(currentProgram['id'])
                // setProgramSchedule(programSchedules)
                // const dropdownValues = programSchedules.map(item => {
                //     return {
                //         key: item.id,
                //         text: `${formatTimestamp(item.start_date)} - ${formatTimestamp(item.end_date)}`,
                //         value: item.id
                //     }
                // })
                // setProgramScheduleDropdown(dropdownValues)
            }
            setIsProgramDeliveryEdit(false)
        } else {
            setIsProgramDeliveryEdit(true)
        }
    }

    return isProgramDeliveryEdit ?
        <EditProgramDelivery programDelivery={programDelivery} handleProgramDeliveryEdit={handleProgramDeliveryEdit} setProgramDelivery={setProgramDelivery}/> :
        <ReadOnlyProgramDelivery programDelivery={programDelivery} handleProgramDeliveryEdit={handleProgramDeliveryEdit} setProgramDelivery={setProgramDelivery}/>

}

const TableExampleApprove = ({discordDeliveryConfigs, handleAddOrRemoveDiscordDelivery}) => {
    // const [isConfigActive, setIsConfigActive] = useState(!!selectedAthlete['is_active']);
    const options = [
        { key: 'channel', text: 'Channel', value: 'channel' },
        // { key: 'dm', text: 'Direct Message', value: 'dm' }
    ]

    // const handleConfigIsActive = (event, data) => {
    //     setIsActive(data.checked)
    //     updateAthleteValues(data.checked ? 1 : 0, "is_active")
    // }

    const TableRows = () => {
        if(discordDeliveryConfigs === undefined) {
            return (<Table.Row><Table.Cell/> <Table.Cell colSpan={3} textAlign={'center'}>No Configurations Found</Table.Cell> </Table.Row>)
        } else {
            return (
                discordDeliveryConfigs.map((item, idx) => {
                    return (
                        <Table.Row>
                            <Table.Cell collapsing>
                                <Checkbox toggle checked={item.is_active} onClick={() => handleAddOrRemoveDiscordDelivery(idx)}/>
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown
                                    fluid
                                    selection
                                    clearable
                                    value={item['type']}
                                    options={options}
                                    // onChange={setMovementData}
                                    attribute={'type'}
                                    idx={idx}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Input fluid placeholder='remote athletes channel'/>
                            </Table.Cell>
                            <Table.Cell>
                                <Input fluid placeholder='https://discord.com/api/webhooks/...'/>
                            </Table.Cell>
                        </Table.Row>
                    )
                })
            )
        }
    }

    return (<Table compact celled definition>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Nickname</Table.HeaderCell>
                    <Table.HeaderCell>Webhook</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <TableRows />
            </Table.Body>

            <Table.Footer fullWidth>
                <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell colSpan='4'>
                        <Button
                            floated='right'
                            icon
                            labelPosition='left'
                            primary
                            size='small'
                            onClick={() => handleAddOrRemoveDiscordDelivery()}
                        >
                            <Icon name='user'/> Add Config
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    )
}

const DeliveryConfig = ({programDelivery, setProgramDelivery}) => {
    const [isDiscordActive, setIsDiscordActive] = useState(!!programDelivery['delivery_discord']);
    const [isEmailActive, setIsEmailActive] = useState(!!programDelivery['delivery_email']);
    const [discordDeliveryConfigs, setDiscordDeliveryConfigs] = useState([]);

    const options = [
        { key: 'channel', text: 'Channel', value: 'channel' },
        // { key: 'dm', text: 'Direct Message', value: 'dm' }
    ]

    const updateAthleteValues = (value, attribute) => {
        const delivery = {...programDelivery};
        delivery[attribute] = value;
        setProgramDelivery(delivery);
    }

    const handleDeliveryIsActive = (event, {checked, deliveryType}) => {
        if(deliveryType === "discord") {
            setIsDiscordActive(checked)
        } else {
            setIsEmailActive(checked)
        }
        // updateAthleteValues(data.checked ? 1 : 0, "is_active")
    }

    const handleAddOrRemoveDiscordDelivery = (idx) => {
        if(idx === undefined) {
            const deliveryConfigs = [...discordDeliveryConfigs]
            const deepCopy = JSON.parse(JSON.stringify(IProgramDeliveryDiscord));
            deliveryConfigs.push(deepCopy)
            setDiscordDeliveryConfigs(deliveryConfigs)
        } else {
            const deliveryConfigs = [...discordDeliveryConfigs]
            const toRemove = deliveryConfigs[idx]
            toRemove.is_active = !toRemove.is_active
            deliveryConfigs[idx] = toRemove
            setDiscordDeliveryConfigs(deliveryConfigs)
        }
        // updateAthleteValues(data.checked ? 1 : 0, "is_active")
    }

    return (
        <div>
            <div>
                <h4>Discord <span>
                <Checkbox toggle checked={isDiscordActive}
                          onChange={handleDeliveryIsActive}
                          deliveryType={"discord"}
                          style={{float: "right"}}
                /></span></h4>
                <Divider/>
            </div>
            <div>
                <TableExampleApprove discordDeliveryConfigs={discordDeliveryConfigs} handleAddOrRemoveDiscordDelivery={handleAddOrRemoveDiscordDelivery}/>
            </div>
        </div>
        // <Grid columns={2} celled='internally'>
        //     <Grid.Row>
        //         <Grid.Column>
        //             Discord?
        //             <Checkbox checked={isDiscordActive}
        //                       onChange={handleDeliveryIsActive}
        //                       deliveryType={"discord"}
        //                       style={{float: "right"}}
        //             />
        //         </Grid.Column>
        //         <Grid.Column>
        //             Email?
        //             <Checkbox checked={isEmailActive}
        //                       onChange={handleDeliveryIsActive}
        //                       deliveryType={"email"}
        //                       style={{float: "right"}}
        //             />
        //         </Grid.Column>
        //     </Grid.Row>
        //
        //     <Grid.Row>
        //         <Grid.Column>
        //             {
        //                 discordDeliveryConfigs.map((item, idx) => {
        //                     return (
        //                         <Form.Group widths='equal' key={idx}>
        //                             <Form.Select
        //                                 fluid
        //                                 label='Type'
        //                                 options={options}
        //                                 placeholder='Channel'
        //                             />
        //                             <Form.Input fluid label='webhook' placeholder='https://discord.com/api/webhooks/...' />
        //                             <Form.Input fluid label='name' placeholder='name' />
        //                             <Icon name='x' color="red" onClick={() => handleAddOrRemoveDiscordDelivery(idx)}/>
        //                         </Form.Group>
        //                     )
        //                 })
        //             }
        //             Add Config
        //             <Icon name='plus' color="green" onClick={() => handleAddOrRemoveDiscordDelivery()}/>
        //         </Grid.Column>
        //         <Grid.Column>
        //             Email options
        //         </Grid.Column>
        //     </Grid.Row>
        // </Grid>
    )
}

export const ReadOnlyProgramDelivery = ({programDelivery, handleProgramDeliveryEdit, setProgramDelivery}) => {
    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Delivery Configuration</Card.Header>
                <Card.Description>
                    <DeliveryConfig programDelivery={programDelivery} setProgramDelivery={setProgramDelivery}/>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui one buttons'>
                    <Button basic color='green' onClick={() => handleProgramDeliveryEdit({}, true)}>
                        Edit
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
};

export const EditProgramDelivery = ({currentProgram, handleProgramDeliveryEdit}) => {
    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Delivery Configuration</Card.Header>
                <Card.Description>{currentProgram['description']}</Card.Description>
                <Card.Meta>{currentProgram['type']}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <div className='ui one buttons'>
                    <Button basic color='green' onClick={() => handleProgramDeliveryEdit({}, true)}>
                        Submit
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
};

export default ProgramDelivery;