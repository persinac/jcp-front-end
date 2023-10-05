import React from 'react';
import {Button, Container, Header} from 'semantic-ui-react';
import { signInWithGoogle } from '../firebase';
import {useAuth} from "../AuthContext"; // Update the path to where your function resides

const LoginPage = () => {
    const { setIsCheckingRegistration } = useAuth();
    const handleLoginClick = async () => {
        try {
            await signInWithGoogle(setIsCheckingRegistration);
            // Handle anything after sign-in here if needed
        } catch (error) {
            console.error("Error during sign-in:", error.message);
        }
    };

    return (
        <Container style={{ marginTop: "7em" }}>
            <Header as="h2" textAlign="center">
                Welcome to FitCartographer
            </Header>
            <Button color="google plus" onClick={handleLoginClick} style={{ marginBottom: "1em" }}>
                <i className="google icon" />
                Login with Google
            </Button>
            <br />
            <Button primary onClick={() => window.location.href = "/register"}>
                Register
            </Button>
        </Container>
    );
};

export default LoginPage;
