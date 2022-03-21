/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, useState, useEffect, useRef} from "react";
import {
  View,
  Text,
  Alert,
  Button,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
  ScrollView,
  TextInput,
  Linking
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import SelectDropdown from "react-native-select-dropdown";
import Auth0 from 'react-native-auth0';
import { useNavigation } from '@react-navigation/native';
//import {accessToken} from '../login/login';
//const accessToken = global.accessToken;
import '../login/login'

var credentials = require('../../../app/auth0-configuration');
const auth0 = new Auth0(credentials);

 export const Home = () => {
    var reactions = []
    var actions = []
    // var tmp = {};
    // for(i in )
//    const [value_a, setValuesA] = React.useState({first: '', second: ''});
//    const [value_rea, setValues] = React.useState({first: '', second: ''});
    var c = ['first', 'second']
    const navigationn = useNavigation();
    const [action, setAction] = useState([]);
    const [parameters, setParam] = useState([]);
    const [reaction, setReaction] = useState([]);
    const [parameter, setParam2] = useState([]);
    const [workflow, onChangeW] = React.useState("");

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
    navigationn.navigate('Login')
  };

  useEffect(() => {
    setTimeout(() => {
      setAction([
        {
          id: "gh_last_commit",
          service: "GitHub",
          name: "Dernière commit",
          parameters: [
            {
              id: "repo",
              name: "Repository", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "gh_last_star",
          service: "GitHub",
          name: "Dernière étoile",
          parameters: [
            {
              id: "repo",
              name: "Repository", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "gh_last_follower",
          service: "GitHub",
          name: "Dernier follower",
          parameters: [
            {
              id: "repo",
              name: "Laisser vide", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "gh_last_issue",
          service: "GitHub",
          name: "Dernier follower",
          parameters: [
            {
              id: "repo",
              name: "Repo", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "gh_last_gist",
          service: "GitHub",
          name: "Dernier Gist",
          parameters: [
            {
              id: "repo",
              name: "Laisser vide", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "gh_last_comment",
          service: "GitHub",
          name: "Dernier commentaire sur le gist",
          parameters: [
            {
              id: "gist",
              name: "Gist id", // username/repo
              placeholder: "Ex: ...",
              type: "string"
            }
          ]
        },
        {
          id: "gh_time",
          service: "Time",
          name: "Timer",
          parameters: [
            {
              id: "interval",
              name: "Intervalle en secondes", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "drive_last_file",
          service: "Google Drive",
          name: "Dernier fichier modifié",
          parameters: [
            {
              id: "repo",
              name: "Laisser vide", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "youtube_last_video",
          service: "Youtube",
          name: "Dernière vidéo de la chaîne",
          parameters: [
            {
              id: "channel_id",
              name: "Channel ID", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "youtube_last_comment",
          service: "Youtube",
          name: "Dernier commentaire sur la vidéo",
          parameters: [
            {
              id: "video_id",
              name: "Video ID", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
        {
          id: "youtube_last_sub",
          service: "GitHub",
          name: "Dernière chaîne suivie",
          parameters: [
            {
              id: "repo",
              name: "Laisser vide", // username/repo
              placeholder: "Ex: TanguyAndreani/monSuperRepo",
              type: "string"
            }
          ]
        },
      ]);
      setReaction([
        {
          id: "gmail_send_mail",
          service: "GMail",
          name: "Envoyer un email",
          parameters: [
            {
              id: "from",
              name: "Expéditeur",
              placeholder: "Ex: dupont@example.com",
              type: "string"
            },
            {
              id: "to",
              name: "Destinataire",
              placeholder: "Ex: dupond@example.com",
              type: "string"
            }
          ]
        },
        {
          id: "gh_create_issue",
          service: "Github",
          name: "Créer un ticket",
          parameters: [
            {
              id: "repo",
              name: "Repo",
              placeholder: "Ex: dupont@example.com",
              type: "string"
            },
            {
              id: "titre",
              name: "Titre du ticket",
              placeholder: "Ex: dupond@example.com",
              type: "string"
            }
          ]
        },
        {
          id: "gh_create_gist",
          service: "Github",
          name: "Créer un Gist",
          parameters: [
            {
              id: "titre",
              name: "Laisser vide",
              placeholder: "Ex: dupond@example.com",
              type: "string"
            }
          ]
        },
        {
          id: "calendar_create_event",
          service: "GMail",
          name: "Envoyer un email",
          parameters: [
            {
              id: "event_summary",
              name: "Event summary",
              placeholder: "Ex: dupont@example.com",
              type: "string"
            },
            {
              id: "date_start",
              name: "Date start",
              placeholder: "YYYY-MM-DDTHH:mm:SS-HH:MM",
              type: "string"
            },
            {
              id: "date_end",
              name: "Date end",
              placeholder: "YYYY-MM-DDTHH:mm:SS-HH:MM",
              type: "string"
            }
          ]
        }
      ]);
    }, 1000);
  }, []);

  const renderHeader = () => {
    loadInBrowser = () => {
        Linking.openURL('https://google.com').catch(err => console.error("Couldn't load page", err));
      };
    return (
      <View>
        <View style={[styles.header, styles.shadow]}>
          <Text style={styles.headerTitle}>{"Home "}</Text>
        </View>
        <View style={styles.button}>
          <Button
            color={'darkblue'}
            onPress={onLogout}
            title={'Log Out'} />
            <Button title="Open in Browser" onPress={loadInBrowser} />
        </View>
      </View>
    );
  };
    var useStateAction = {}
    var c_a = []
    for (let i = 0; i < parameters.length; i++) {
        var p = parameters[i].id
        useStateAction[p] = ''
        c_a[i] = p
    }
    var useStateReaction = {}
    var c_rea = []
    for (let i = 0; i < parameter.length; i++) {
        var p = parameter[i].id
        useStateReaction[p] = ''
        c_rea[i] = p
    }
    const [value_a, setValuesA] = React.useState(useStateAction);
    const [value_rea, setValues] = React.useState(useStateReaction);

  const handleChangeA = (name, value) => {
    setValuesA({
      ...value_a,
      [name]: value,
    });
  };

  const handleChange = (name, value) => {
    setValues({
      ...value_rea,
      [name]: value,
    });
  };

  const ReaJson = () => {
    var ReactionJson = {
        "id": reaction[0].id,
        "typeform": "reaction",
    }
    for (let i = 0; i < parameter.length; i++) {
        var p = parameter[i].id
        ReactionJson[p] = value_rea[p]
    }
    console.log("REACTION", ReactionJson)
    return (ReactionJson)
  };
  const AJson = () => {
    var ActionJson = {
        "id": action[0].id,
        "workflow_name": workflow,
        "typeform": "action",
    }
    for (let i = 0; i < parameters.length; i++) {
        var p = parameters[i].id
        ActionJson[p] = value_a[p]
    }
    console.log("ACTION", ActionJson)
    return (ActionJson)
  };

  var AcReacJson = {};

  const Enregistrer = () => {
    var xx = ReaJson()
    var x = AJson()
    AcReacJson = {"action": x, "reaction": xx}
    const accesstoken = accessToken
    var jsonall = {
        "method": "post",
        headers: {
            'Authorization': `Bearer ${accesstoken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    jsonall["body"] = JSON.stringify(AcReacJson)
    console.log("ALL", jsonall)
    fetch('http://10.0.2.2:3000/workflows/add', jsonall)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  };



  const renderEnter = () => {
    return (
      <View>
        <Button onPress={Enregistrer}
          title={'Submit'}
          color={'darkblue'} />
      </View>
    );
  };

  const renderAction = () => {
    //        var actions = []
    for (let i = 0; i < parameters.length; i++) {
      actions.push(<TextInput key={i} placeholder={parameters[i].name} onChangeText={(text) => handleChangeA(c_a[i], text)} value={value_a} />)
    }

    return (
      <View style={styles.dropdownsRow2}>
        <SelectDropdown
          data={action}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setParam([]);
            setParam(selectedItem.parameters);
          }}
          defaultButtonText={"Select action"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.id;
          }}
          rowTextForSelection={(item, index) => {
            return item.id;
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"black"}
                size={18}
              />
            );
          }}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
        <View style={{ width: 10 }} />
        <TextInput placeholder="workflow_name" onChangeText={onChangeW} value={workflow} />
        {actions}
      </View>
    );
  };

  const renderReaction = () => {
    //    var reactions = []
    for (let i = 0; i < parameter.length; i++) {
      reactions.push(<TextInput key={i} placeholder={parameter[i].name} onChangeText={(text) => handleChange(c_rea[i], text)} value={value_rea} />)
    }
    return (
      <View style={styles.dropdownsRow2}>
        <SelectDropdown
          data={reaction}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setParam2([]);
            setParam2(selectedItem.parameters);
          }}
          defaultButtonText={"Select reaction"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.id;
          }}
          rowTextForSelection={(item, index) => {
            return item.id;
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"black"}
                size={18}
              />
            );
          }}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
        <View style={{ width: 10 }} />
        {reactions}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.saveAreaViewContainer}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={styles.viewContainer}>
        {renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.dropdownsRow}>
            {renderAction()}
            {renderReaction()}
          </View>
        </ScrollView>
        {renderEnter()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    flexDirection: "row",
    position: "relative",
    top: 0,
  },
  header: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
  },
  headerTitle: { color: "darkblue", fontWeight: "bold", fontSize: 26 },
  saveAreaViewContainer: {
    flex: 1, backgroundColor: "#000",
  },
  viewContainer: { flex: 1, width, backgroundColor: "#FFF" },
  scrollViewContainer: {
    flexGrow: 1,
    // justifyContent: "space-between",
    // alignItems: "center",
    paddingVertical: "10%",
  },
  dropdownsRow: {
    flexDirection: "row",
    marginLeft: 20,
  },
  dropdownsRow2: {
    flexDirection: "column",
    maxWidth: "50%",
  },
  dropdown1BtnStyle: {
    flex: 1,
    maxHeight: 50,
    width: '90%',
    backgroundColor: "lightgrey",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "lightgrey",
  },
  dropdown1BtnTxtStyle: { color: "black", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "black", textAlign: "left" },

  dropdown2BtnStyle: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black",
  },
  dropdown2BtnTxtStyle: { color: "black", textAlign: "left" },
  dropdown2DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown2RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown2RowTxtStyle: { color: "black", textAlign: "left" },
});
