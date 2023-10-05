import React, { useState } from "react";
import { Button, Container, Form, Header } from "semantic-ui-react";
import { registerWithGoogle } from "../firebase";
import {useAuth} from "../AuthContext"; // Update the path

const RegistrationPage = () => {
    const { setIsCheckingRegistration } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState({
        team_name: ""
    });

    const handleGoogleSignUp = async () => {
        try {
            await registerWithGoogle(setIsCheckingRegistration);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const handleInfoSubmit = () => {
        // Here, save the additionalInfo to your database.
        // After saving, you might want to redirect the user to another page or give a confirmation.
        setIsCheckingRegistration(false)
    };

    return (
        <Container style={{ marginTop: "7em" }}>
            <Header as="h2" textAlign="center">
                Complete Your Registration
            </Header>
            {!isAuthenticated ? (
                <Button color="google plus" onClick={handleGoogleSignUp}>
                    <i className="google icon" />
                    Register with Google
                </Button>
            ) : (
                <Form onSubmit={handleInfoSubmit}>
                    <Form.Input
                        label="Team Name"
                        placeholder="The Pain Relievers"
                        value={additionalInfo.team_name}
                        onChange={(e) => setAdditionalInfo({ ...additionalInfo, team_name: e.target.value })}
                    />
                    <Button type="submit">Complete Registration</Button>
                </Form>
            )}
        </Container>
    );
};

export default RegistrationPage;
