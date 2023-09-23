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
    createProgramDeliveryDiscordConfig, createProgramDeliveryEmailConfig,
    getProgramDeliveryDiscordConfigs,
    getProgramDeliveryDiscordConfigsByProgramId, getProgramDeliveryEmailConfigsByProgramId,
    removeProgramDeliveryDiscordConfigs,
    updateProgramDeliveryDiscordConfigs, updateProgramDeliveryEmailConfigs
} from "../api";

const IProgramDeliveryEmail = {
    id: null,
    program_id: null,
    email_to: null,
    is_active: false
}


const ProgramDeliveryEmail = ({isMobile}) => {

    // context from parent
    const {currentProgram} = useContext(ProgramContext);
    const {programDelivery, setProgramDelivery} = useContext(ProgramDeliveryContext);
    const {programDeliveryEmail, setProgramDeliveryEmail} = useContext(ProgramDeliveryContext);

    const [isProgramDeliveryEdit, setIsProgramDeliveryEdit] = useState(false);
    const [deliveryConfigEmail, setDeliveryConfigEmail] = useState(IProgramDeliveryEmail);

    useEffect(() => {
        getProgramDeliveryEmailConfigsByProgramId(currentProgram['id'], 1, "ASC")
            .then((results) => {
                if(results.length > 0) {
                    results[0].is_active = results[0].is_active === 1
                    setDeliveryConfigEmail(results[0])
                }
            })
    }, [currentProgram]);

    // Custom functionality can be added here
    const toggleIsProgramDeliveryEdit = () => {
        setIsProgramDeliveryEdit(prevState => !prevState);
    }

    const toggleIsDeliveryConfigActive = (idx) => {
        const deliveryConfigs = [...deliveryConfigEmail]
        deliveryConfigEmail.is_active = !deliveryConfigs.is_active
        setDeliveryConfigEmail(deliveryConfigs);
    }

    const handleProgramDeliveryEdit = async (isDeliveryActive, submit) => {
        if (isProgramDeliveryEdit) {
            if (submit) {
                const dbReady = {...deliveryConfigEmail}
                dbReady.is_active = isDeliveryActive ? 1 : 0
                if(dbReady.id === undefined || dbReady.id === null) {
                    dbReady.program_id = currentProgram.id
                    await createProgramDeliveryEmailConfig([dbReady])
                } else {
                    await updateProgramDeliveryEmailConfigs([dbReady])
                }
                getProgramDeliveryEmailConfigsByProgramId(currentProgram['id'], 1, "ASC")
                    .then((results) => {
                        if(results.length > 0) {
                            results[0].is_active = results[0].is_active === 1
                            setDeliveryConfigEmail(results[0])
                        }
                    })
            }
            setIsProgramDeliveryEdit(false)
        } else {
            setIsProgramDeliveryEdit(true)
        }
    }

    const contextValue = useMemo(() => ({
        isProgramDeliveryEdit, setIsProgramDeliveryEdit, programDelivery, setProgramDelivery,
        deliveryConfigEmail, programDeliveryEmail, setProgramDeliveryEmail,
        setDeliveryConfigEmail, toggleIsProgramDeliveryEdit, toggleIsDeliveryConfigActive
    }), [isProgramDeliveryEdit, deliveryConfigEmail]);

    return (<ProgramDeliveryContext.Provider value={contextValue}>
            {
                isProgramDeliveryEdit ?
                    <EditProgramDelivery handleProgramDeliveryEdit={handleProgramDeliveryEdit}/> :
                    <ReadOnlyProgramDelivery />
            }
        </ProgramDeliveryContext.Provider>
    )
}

export const ReadOnlyProgramDelivery = () => {
    const { toggleIsProgramDeliveryEdit } = useContext(ProgramDeliveryContext);
    const { deliveryConfigEmail } = useContext(ProgramDeliveryContext);
    const [iconName, setIconName] = useState(undefined);
    const [iconColor, setIconColor] = useState(undefined);

    useEffect(() => {
        if(deliveryConfigEmail) {
            const icon = deliveryConfigEmail['is_active'] ? "checkmark" : "x"
            const iconColor = deliveryConfigEmail['is_active'] ? "green" : "red"
            setIconName(icon)
            setIconColor(iconColor)
        }
    }, [deliveryConfigEmail]);

    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Delivery Configuration - Email</Card.Header>
                <Card.Description>
                    <i>Note: Currently all deliveries are set to go out once per week on Sunday. The delivery will include the entire week of programming in a stacked, day-by-day format.
                    </i>
                    <br/>
                </Card.Description>
                <Card.Description>
                    <h5>Send Email to All Assigned Athletes <span><Icon name={iconName} color={iconColor}/></span></h5>
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

export const EditProgramDelivery = ({handleProgramDeliveryEdit}) => {
    const {deliveryConfigEmail} = useContext(ProgramDeliveryContext);
    const [isEmailActive, setIsEmailActive] = useState(!!deliveryConfigEmail['is_active']);

    const handleDeliveryIsActive = (event, {checked}) => {
        setIsEmailActive(checked)
    }

    return (
        <Card fluid color='red'>
            <Card.Content>
                <Card.Header>Delivery Configuration - Email</Card.Header>
                <Card.Description>
                    <h4>Send Email to All Assigned Athletes <span>
                    <Checkbox toggle checked={isEmailActive}
                              onChange={handleDeliveryIsActive}
                              style={{float: "right"}}
                    /></span></h4>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button basic color='green' onClick={() => handleProgramDeliveryEdit(isEmailActive, true)}>
                        Submit
                    </Button>
                    <Button basic color='red' onClick={() => handleProgramDeliveryEdit({}, false)}>
                        Cancel
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
};


export default ProgramDeliveryEmail;