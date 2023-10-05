import React, {createContext, useContext, useEffect, useState} from 'react';
import {auth} from './firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);

    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            if (!isCheckingRegistration) {
                setCurrentUser(user);
                setLoading(false);
            }
        });
    }, [isCheckingRegistration]);


    const contextValue = {
        currentUser,
        isCheckingRegistration,
        setIsCheckingRegistration
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
