import React, {useEffect, useState} from "react";
import {getPrograms} from "../api"
import {Container} from "semantic-ui-react";
import { ProgramContext } from '../programContext';
import ProgramList from "./ProgramList";
import ProgramDetails from "./ProgramDetails";

const Programs = () => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [programData, setProgramData] = useState([]);
    const [currentProgram, setCurrentProgram] = useState(null);
    const [showProgramDetails, setShowProgramDetails] = useState(false);
    const [activeProgramPage, setActiveProgramPage] = useState(1);
    const [isCreateProgram, setIsCreateProgram] = useState(false);

    useEffect(() => {
        if(!isCreateProgram) {
            getPrograms(1, "DESC")
                .then(response => setProgramData(response))
        }
    }, [isCreateProgram]);

    const handleShowProgramDetails = (currentProgram) => {
        setShowProgramDetails(true);
        setCurrentProgram(currentProgram);
    };

    const programPageHandler = (e, pageInfo) => {
        setActiveProgramPage(pageInfo.activePage)
        getPrograms(pageInfo.activePage, "DESC")
            .then(response => setProgramData(response))
    };

    const handleBackClick = () => {
        setShowProgramDetails(false);
    };


    return (
        <Container className={'container-width-100'}>
            <div className="d-flex flex-row justify-content-center">
                {!showProgramDetails ?
                    <ProgramList handleShowProgramDetails={handleShowProgramDetails}
                                 programPageHandler={programPageHandler} programData={programData}
                                 activeProgramPage={activeProgramPage}
                                 isCreateProgram={isCreateProgram}
                                 setIsCreateProgram={setIsCreateProgram}
                    /> :
                    <ProgramContext.Provider value={{ currentProgram, handleBackClick, setCurrentProgram }}>
                        <ProgramDetails />
                    </ProgramContext.Provider>
                }
            </div>
        </Container>
    )
}


export default Programs;