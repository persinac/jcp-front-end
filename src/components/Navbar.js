import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react'

const NavigationBar = () => {

    return (
        <Menu pointing secondary>
            <Menu.Item  name='home' href="/"/>
            <Menu.Item  name='programs' href="/programs"/>
            <Menu.Item  name='athletes' href="/athletes"/>
            <Menu.Menu position='right'>
                <Menu.Item right name='login' href="/login"/>
            </Menu.Menu>
        </Menu>
    )
}

export default NavigationBar;