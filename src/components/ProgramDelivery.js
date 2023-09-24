import React, {useContext, useEffect, useMemo, useState} from "react";
import {
    Button,
    Card,
    Checkbox,
    Icon,
    Table,
    Divider,
    Dropdown, Input
} from "semantic-ui-react";
import {ProgramContext, ProgramDeliveryContext} from '../programContext';
import ReadEditInput from "./General/ReadEditInput";
import {
    createProgramDeliveryDiscordConfig,
    getProgramDeliveryDiscordConfigs,
    getProgramDeliveryDiscordConfigsByProgramId,
    removeProgramDeliveryDiscordConfigs,
    updateProgramDeliveryDiscordConfigs
} from "../api";

const IProgramDelivery = {
    id: null,
    program_id: null,
    delivery_discord: null,
    delivery_email: null,
    is_active: null
}

const IProgramDeliveryDiscord = {
    id: null,
    program_id: null,
    type: "channel",
    channel: null,
    channel_name: null,
    direct_message: null,
    is_active: true
}

const IProgramDeliveryEmail = {
    id: null,
    program_id: null,
    email_to: null,
    is_active: true
}


const ProgramDelivery = ({isMobile}) => {

    // context from parent
    const {currentProgram} = useContext(ProgramContext);
    const {programDelivery, setProgramDelivery} = useContext(ProgramDeliveryContext);
    const {programDeliveryEmail, setProgramDeliveryEmail} = useContext(ProgramDeliveryContext);

    const [isProgramDeliveryEdit, setIsProgramDeliveryEdit] = useState(false);
    const [deliveryConfigDiscord, setDeliveryConfigDiscord] = useState([]);

    useEffect(() => {
        getProgramDeliveryDiscordConfigsByProgramId(currentProgram['id'], 1, "ASC")
            .then((results) => setDeliveryConfigDiscord(results))
    }, [currentProgram]);

    // Custom functionality can be added here
    const toggleIsProgramDeliveryEdit = () => {
        setIsProgramDeliveryEdit(prevState => !prevState);
    }

    const toggleIsDiscordDeliveryConfigActive = (idx) => {
        const deliveryConfigs = [...deliveryConfigDiscord]
        deliveryConfigs[idx].is_active = !deliveryConfigs[idx].is_active
        setDeliveryConfigDiscord(deliveryConfigs);
    }

    const handleProgramDeliveryDiscordEdit = async (programDeliveryDiscord, submit) => {
        if (isProgramDeliveryEdit) {
            if (submit) {
                const keysToCompare = ['type', 'channel', 'channel_name', 'direct_message', 'is_active'];
                //get the diff
                const diffList = programDeliveryDiscord.filter(newConfig => {
                    let ogConfig = deliveryConfigDiscord.filter(ogDiscordConfig => ogDiscordConfig.id === newConfig.id)
                    if (ogConfig.length > 0) {
                        ogConfig = ogConfig[0]
                        if (!keysToCompare.every(key => ogConfig[key] === newConfig[key])) {
                            return newConfig
                        }
                    }
                })

                // inserts => where program_schedule_id is null AND is_assigned = 1
                let inserts = programDeliveryDiscord.filter(config => {
                    if (config.id === null) {
                        return config
                    }
                })
                inserts = inserts.map(config => {
                    const copy = {...config}
                    copy.program_id = currentProgram.id
                    copy.is_active = config.is_active ? 1 : 0
                    return copy
                })

                // updates => where id is NOT null AND is_active = 1
                let updates = diffList.filter(config => {
                    if (config.id !== null && config.is_active) {
                        return config
                    }
                })
                updates = updates.map(config => {
                    const copy = {...config}
                    copy.is_active = config.is_active ? 1 : 0
                    return copy
                })

                // "deletes" => where program_schedule_id is NOT null AND is_active = 0
                const deletes = diffList.filter(config => {
                    if (config.id !== null && !config.is_active) {
                        return config
                    }
                })

                if (inserts.length > 0) {
                    await createProgramDeliveryDiscordConfig(inserts)
                }
                if (updates.length > 0) {
                    await updateProgramDeliveryDiscordConfigs(updates)
                }
                if (deletes.length > 0) {
                    await removeProgramDeliveryDiscordConfigs(deletes.map(ass => ass.id))
                }
                getProgramDeliveryDiscordConfigsByProgramId(currentProgram['id'], 1, "ASC")
                    .then((results) => setDeliveryConfigDiscord(results))
                // setDeliveryConfigDiscord(programDeliveryDiscord)
            }
            setIsProgramDeliveryEdit(false)
        } else {
            setIsProgramDeliveryEdit(true)
        }
    }

    const contextValue = useMemo(() => ({
        isProgramDeliveryEdit, setIsProgramDeliveryEdit, programDelivery, setProgramDelivery,
        deliveryConfigDiscord, programDeliveryEmail, setProgramDeliveryEmail,
        setDeliveryConfigDiscord, toggleIsProgramDeliveryEdit, toggleIsDiscordDeliveryConfigActive
    }), [isProgramDeliveryEdit, deliveryConfigDiscord]);

    return (<ProgramDeliveryContext.Provider value={contextValue}>
            {
                isProgramDeliveryEdit ?
                    <EditProgramDelivery handleProgramDeliveryDiscordEdit={handleProgramDeliveryDiscordEdit}/> :
                    <ReadOnlyProgramDelivery />
            }
        </ProgramDeliveryContext.Provider>
    )
}

const DeliveryConfig = () => {
    const {isProgramDeliveryEdit} = useContext(ProgramDeliveryContext);
    const {programDelivery} = useContext(ProgramDeliveryContext);
    const [isDiscordActive, setIsDiscordActive] = useState(!!programDelivery['delivery_discord']);

    const handleDeliveryIsActive = (event, {checked, deliveryType}) => {
        if(deliveryType === "discord") {
            setIsDiscordActive(checked)
        } else {
            setIsEmailActive(checked)
        }
    }

    return (
        <div>
            <h4>Discord <span>
            <Checkbox toggle checked={isDiscordActive}
                      onChange={handleDeliveryIsActive}
                      deliveryType={"discord"}
                      style={{float: "right"}}
                      disabled={!isProgramDeliveryEdit}
            /></span></h4>
        </div>
    )
}

export const ReadOnlyProgramDelivery = () => {
    const { toggleIsProgramDeliveryEdit } = useContext(ProgramDeliveryContext);
    const { deliveryConfigDiscord } = useContext(ProgramDeliveryContext);
    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Delivery Configuration - Discord</Card.Header>
                <Card.Description>
                    <i>
                        Note: Currently all deliveries are set to go out once per week on Sunday. The delivery will include the entire week of programming in a stacked, day-by-day format.
                    </i>
                    <br/>
                </Card.Description>
                <Card.Description>
                    <TableComponent dataList={deliveryConfigDiscord}/>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui one buttons'>
                    <Button basic color='green' onClick={() => toggleIsProgramDeliveryEdit()}>
                        Edit
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
};

export const EditProgramDelivery = ({handleProgramDeliveryDiscordEdit}) => {
    const {deliveryConfigDiscord} = useContext(ProgramDeliveryContext);
    const [dataList, setDataList] = useState(deliveryConfigDiscord);

    const handleUpdate = (idx, updatedData) => {
        const updatedList = [...dataList];
        updatedList[idx] = updatedData;
        setDataList(updatedList);
    };

    const handleAddDeliveryConfigDiscord = () => {
        const deliveryConfigs = [...dataList]
        const deepCopy = JSON.parse(JSON.stringify(IProgramDeliveryDiscord));
        deliveryConfigs.push(deepCopy)
        setDataList(deliveryConfigs)
    }

    const handleRemoveConfig = (idx) => {
        const deliveryConfigs = [...dataList]
        deliveryConfigs.splice(idx, 1)
        setDataList(deliveryConfigs)
    };

    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Delivery Configuration - Discord</Card.Header>
                <Card.Description>
                    <TableComponent
                        dataList={dataList}
                        onUpdate={handleUpdate}
                        handleAddDeliveryConfigDiscord={handleAddDeliveryConfigDiscord}
                        handleRemoveConfig={handleRemoveConfig}
                    />
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => handleProgramDeliveryDiscordEdit(dataList, true)}>
                        Submit
                    </Button>
                    <Button basic color='red' onClick={() => handleProgramDeliveryDiscordEdit({}, false)}>
                        Cancel
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
};

const DataTableRow = ({ initialData, onUpdate, idx, handleRemoveConfig }) => {
    const {isProgramDeliveryEdit} = useContext(ProgramDeliveryContext);
    const [configData, setConfigData] = useState(initialData);

    useEffect(() => {
        setConfigData(initialData);
    }, [initialData]);

    const options = [
        { key: 'channel', text: 'Channel', value: 'channel' },
        // { key: 'dm', text: 'Direct Message', value: 'dm' }
    ]

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedData = { ...configData, [name]: value };
        setConfigData(updatedData);
        onUpdate(idx, updatedData);
    };

    const handleConfigIsActive = (event, data) => {
        const updatedData = { ...configData, ['is_active']: data.checked };
        setConfigData(updatedData);
        onUpdate(idx, updatedData);
    }

    return (
        <Table.Row>
            <Table.Cell collapsing>
                <Checkbox toggle checked={configData.is_active} name={"is_active"} onClick={handleConfigIsActive} disabled={!isProgramDeliveryEdit}/>
            </Table.Cell>
            <Table.Cell>
                <Dropdown
                    disabled={!isProgramDeliveryEdit}
                    fluid
                    selection
                    clearable
                    value={configData['type']}
                    options={options}
                    // onChange={setMovementData}
                    name={'type'}
                />
            </Table.Cell>
            <Table.Cell>
                <ReadEditInput
                    value={configData.channel_name}
                    onChangeHandler={handleChange}
                    placeholder='remote athletes channel'
                    readOnly={!isProgramDeliveryEdit}
                    name={"channel_name"}
                />
            </Table.Cell>
            <Table.Cell>
                <ReadEditInput
                    value={configData.channel}
                    onChangeHandler={handleChange}
                    placeholder='https://discord.com/api/webhooks/...'
                    readOnly={!isProgramDeliveryEdit}
                    name={"channel"}
                />
            </Table.Cell>
            {
                isProgramDeliveryEdit ?
                <Table.Cell collapsing>
                    {
                        configData.id === null ? <Icon name={"x"} color={"red"} onClick={e => handleRemoveConfig(idx)}/> : <div />
                    }
                </Table.Cell> : <Table.Cell collapsing />
            }
        </Table.Row>
    );
};

const TableComponent = ({ dataList, onUpdate, handleAddDeliveryConfigDiscord, handleRemoveConfig}) => {
    const {isProgramDeliveryEdit} = useContext(ProgramDeliveryContext);
    return (
        <Table compact celled definition>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Nickname</Table.HeaderCell>
                    <Table.HeaderCell>Webhook</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {
                (dataList && dataList.length > 0) ? dataList.map((data, idx) => (
                    <DataTableRow key={data.id} initialData={data} onUpdate={onUpdate} idx={idx} handleRemoveConfig={handleRemoveConfig}/>
                )) : <Table.Row><Table.Cell/> <Table.Cell colSpan={3} textAlign={'center'}>No Configurations Found</Table.Cell> </Table.Row>

            }
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
                            onClick={() => handleAddDeliveryConfigDiscord()}
                            disabled={!isProgramDeliveryEdit}
                        >
                            <Icon name='wrench'/> Add Config
                        </Button>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    );
};


export default ProgramDelivery;