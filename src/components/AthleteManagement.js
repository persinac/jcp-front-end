import React, {useEffect, useState} from "react";
import {getAthletes} from "../api"
import {Container} from "semantic-ui-react";
import AthleteList from "./AthleteList";
import {AthleteContext} from "../athleteContext";
import AthleteDetails from "./AthleteDetails";

const Athletes = () => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [athleteData, setAthleteData] = useState([]);
    const [currentAthlete, setCurrentAthlete] = useState(null);
    const [showAthleteDetails, setShowAthleteDetails] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [isCreateAthlete, setIsCreateAthlete] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            setIsMobile(window.innerWidth <= 768);
        }

        // Subscribe to window resize events
        window.addEventListener('resize', handleResize);

        // Unsubscribe from events to avoid memory leaks
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if(!isCreateAthlete) {
            getAthletes(1, "DESC")
                .then(response => setAthleteData(response))
        }
    }, [isCreateAthlete]);

    const handleShowAthleteDetails = (currentAthlete) => {
        setShowAthleteDetails(true);
        setCurrentAthlete(currentAthlete);
    };

    const programPageHandler = (e, pageInfo) => {
        setActivePage(pageInfo.activePage)
        getAthletes(pageInfo.activePage, "DESC")
            .then(response => setAthleteData(response))
    };

    const handleBackClick = () => {
        getAthletes(1, "DESC")
            .then(response => setAthleteData(response))
        setShowAthleteDetails(false);
    };


    return (
        <Container className={'container-width-100'}>
            <div className="d-flex flex-row justify-content-center">
                {!showAthleteDetails ?
                    <AthleteList handleShowAthleteDetails={handleShowAthleteDetails}
                                 gridPageHandler={programPageHandler} athleteData={athleteData}
                                 activePage={activePage}
                                 isCreateAthlete={isCreateAthlete}
                                 setIsCreateAthlete={setIsCreateAthlete}
                    /> :
                    <AthleteContext.Provider value={{ isMobile: isMobile, currentAthlete: currentAthlete, handleBackClick: handleBackClick, setCurrentAthlete: setCurrentAthlete }}>
                        <AthleteDetails />
                    </AthleteContext.Provider>
                }
            </div>
        </Container>
    )
}


export default Athletes;