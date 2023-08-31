import React, {useEffect, useState} from "react";
import {getPrograms} from "../api"
import {Modal} from 'semantic-ui-react';
import {Container} from "semantic-ui-react";
import ProgramList from "./ProgramList";
import ProgramDetails from "./ProgramDetails";

const CustomModal = ({modalOpen, closeModal, data}) => {
    return (
        <Modal
            open={modalOpen}
            onClose={closeModal}
            size="small"
            closeIcon
            closeOnEscape
            closeOnDimmerClick
        >
            <Modal.Header>Centered Modal</Modal.Header>
            <Modal.Content>
                <p>Data: </p>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </Modal.Content>
        </Modal>
    );
};

const Programs = () => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [programData, setProgramData] = useState([]);
    const [currentProgram, setCurrentProgram] = useState(null);
    const [showProgramDetails, setShowProgramDetails] = useState(false);
    const [activeProgramPage, setActiveProgramPage] = useState(1);

    useEffect(() => {
        getPrograms(1, "DESC")
            .then(response => setProgramData(response))
    }, []);

    const handleShowProgramDetails = (currentProgram) => {
        setShowProgramDetails(true);
        setCurrentProgram(currentProgram);
    };

    const programPageHandler = (e, pageInfo) => {
        setActiveProgramPage(pageInfo.activePage)
        getPrograms(activeProgramPage, "DESC")
            .then(response => setProgramData(response))
    };

    const handleBackClick = () => {
        setShowProgramDetails(false);
    };


    return (
        <Container>
            <div className="d-flex flex-row justify-content-center">
                {!showProgramDetails ?
                    <ProgramList handleShowProgramDetails={handleShowProgramDetails}
                                 programPageHandler={programPageHandler} programData={programData}
                                 activeProgramPage={activeProgramPage}/> :
                    <ProgramDetails handleBackClick={handleBackClick} currentProgram={currentProgram}/>}
            </div>
        </Container>
    )
}


export default Programs;