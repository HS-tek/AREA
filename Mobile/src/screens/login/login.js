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
 import { useNavigation } from '@react-navigation/native';

 var credentials = require('../../../app/auth0-configuration');
 const auth0 = new Auth0(credentials);

 export const Login = () => {
    const navigation = useNavigation();
    let [accessToken, setAccessToken] = useState(null);

    const onLogin = () => {
        auth0.webAuth
            .authorize({
                scope: 'openid profile email'
            })
            .then(credentials => {
                console.log(credentials)
                Alert.alert('AccessToken: ' + credentials.accessToken);
                setAccessToken(credentials.idToken);
            })
            .catch(error => console.log(error));
        navigation.navigate('Home')
    };
/*
    const onLogout = () => {
        auth0.webAuth
            .clearSession({})
            .then(success => {
                Alert.alert('Logged out!');
                setAccessToken(null);
            })
            .catch(error => {
                console.log('Log out cancelled');
            });
    };
*/
    let loggedIn = accessToken !== null;
    global.accessToken = accessToken;
    return (
        <View style={styles.container}>
            <Text style={styles.header}> Area - Login </Text>
            <Text style={styles.text}>You are{loggedIn ? ' ' : ' not '}logged in. </Text>
            <Button onPress={onLogin}
                color={'darkblue'}
                title={'Log In'} />
        </View >
        /*
        <View style={styles.container}>
            <Text style={styles.header}> Auth0Sample - Login </Text>
            <Text>You are{loggedIn ? ' ' : ' not '}logged in. </Text>
            <Button onPress={loggedIn ? onLogout : onLogin}
                title={loggedIn ? 'Log Out' : 'Log In'} />
        </View >
        */
    );
 }

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'center',
        margin: 10,
        color: 'darkblue'
    },
    text: {
        fontSize: 19,
        textAlign: 'center',
        marginBottom: 10
    }
});