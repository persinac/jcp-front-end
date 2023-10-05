import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react'
import {logout} from "../firebase";

const NavigationBar = () => {

    const handleLogout = () => {
        logout();
    };

    return (
        <Menu pointing secondary>
            <Menu.Item  name='home' href="/"/>
            <Menu.Item  name='programs' href="/programs"/>
            <Menu.Item  name='athletes' href="/athletes"/>
            <Menu.Item  name='settings' href="/settings"/>
            <Menu.Menu position='right'>
                <Menu.Item right name='logout' onClick={handleLogout}/>
            </Menu.Menu>
        </Menu>
    )
}

export default NavigationBar;