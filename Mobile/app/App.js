/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Auth0 from 'react-native-auth0';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {Login} from '../src/screens/login/login.js'
import {Home} from '../src/screens/home/Home.js'


var credentials = require('./auth0-configuration');
const auth0 = new Auth0(credentials);

//const SreenStack = createNativeStackNavigator();

function HomeScreen() {
    const ScreenStack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <ScreenStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <ScreenStack.Screen name="Login" component={Login}/>
                <ScreenStack.Screen name="Home" component={Home}/>
            </ScreenStack.Navigator>
        </NavigationContainer>
    )
}

const App = () => {
    return (
        <RootSiblingParent>
            {HomeScreen()}
        </RootSiblingParent>
    )
}

export default App;
