import {createContext} from "react";

export const SettingsContext = createContext({
    settingsData: [],
    setSettingsData: () => {},
    currentSetting: {},
    setCurrentSetting: () => {},
    showDetails: false,
    setShowDetails: () => {},
    activePage: 1,
    setActivePage: () => {},
    isCreateSetting: false,
    setIsCreateSetting: () => {},
    isMobile: false,
    setIsMobile: () => {},
    data: [],
    setData: () => {},
    count: 0,
    setCount: () => {},
    windowIndex: 0,
    setWindowIndex: () => {},
    dataColumns: [],
    handleShowDetails: () => {},
    pageHandler: () => {},
    handleBackClick: () => {},
    handleCreateNew: () => {},
});