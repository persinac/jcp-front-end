import React, {useContext, useEffect, useState} from "react";
import {Container} from "semantic-ui-react";
import SettingList from "./SettingList";
import {getDiscordSettings, getDiscordSettingsCount} from "./api";
import SettingsDetails from "./SettingsDetails";
import {SettingsContext} from "./settingsContext";
import CreateSetting from "./SettingsCreate";

const dataColumnsMap = () => {
    return [
        {
            header: "ID",
            accessor: "id",
            link: 0
        },
        {
            header: "Channel Name",
            accessor: "channel_name",
            link: 1
        },
        {
            header: "Channel",
            accessor: "channel",
            link: 0
        },
        {
            header: "Active?",
            accessor: "is_active",
            link: 0
        },
        {
            header: "Created",
            accessor: "created_at",
            link: 0
        },
        {
            header: "Last Updated",
            accessor: "updated_at",
            link: 0
        }
    ]
}

const SettingWindow = () => {
    const { windowIndex } = useContext(SettingsContext)

    const componentMap = {
        "0": <SettingList />,
        "1": <SettingsDetails />,
        "2": <CreateSetting />
    }

    return componentMap[windowIndex]
}

const SettingsProvider = ({ children }) => {
    const [settingsData, setSettingsData] = useState([]);
    const [currentSetting, setCurrentSetting] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [isCreateSetting, setIsCreateSetting] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [windowIndex, setWindowIndex] = useState(0)

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
        if(!isCreateSetting) {
            getDiscordSettingsCount()
                .then(response => setCount(response[0]['total_count']))
            getDiscordSettings(1, "DESC")
                .then(response => setSettingsData(response))
        }
    }, [isCreateSetting]);

    const handleShowDetails = (currentSetting) => {
        setShowDetails(true);
        setCurrentSetting(currentSetting);
        setWindowIndex(1);
    };

    const pageHandler = (e, pageInfo) => {
        setActivePage(pageInfo.activePage)
        getDiscordSettings(pageInfo.activePage, "DESC")
            .then(response => setSettingsData(response))
    };

    const handleBackClick = () => {
        getDiscordSettings(1, "DESC")
            .then(response => setSettingsData(response))
        setShowDetails(false);
        setWindowIndex(0)
    };

    const handleCreateNew = () => {
        setShowDetails(false);
        setWindowIndex(2)
    };

    return (
        <SettingsContext.Provider value={{
            settingsData, setSettingsData,
            currentSetting, setCurrentSetting,
            showDetails, setShowDetails,
            activePage, setActivePage,
            isCreateSetting, setIsCreateSetting,
            isMobile, setIsMobile,
            data, setData,
            count, setCount,
            windowIndex, setWindowIndex,
            dataColumns: dataColumnsMap(),
            handleShowDetails,
            pageHandler,
            handleBackClick,
            handleCreateNew
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

const Settings = () => {
    const { windowIndex } = useContext(SettingsContext)
    return (
        <Container className={'container-width-100'}>
            <div className="d-flex flex-row justify-content-center">
                <SettingsProvider>
                    <SettingWindow index={windowIndex}/>
                </SettingsProvider>
            </div>
        </Container>
    )
}


export default Settings;