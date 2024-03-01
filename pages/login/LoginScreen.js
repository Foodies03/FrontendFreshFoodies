import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import Button from "../components/Button.js";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeHTTPRequest, createFridge } from '../utils/HttpUtils.js';
import LgLogo from '../../assets/LgLogo.png';

const LoginScreen = () => {
  const [userName, setUserName] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const navigation = useNavigation();

  const sendLoginRequest = async (email, password) => {
    if (userEmail == null) {
      alert("Please enter an email.")
      return;
    }

    console.log("making login request");

    var body = {
      email: userEmail.toLowerCase()
    }
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };

    var response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL +  "api/login");

    if (response === null) {
      alert("login failed");
      return;
    }

    if (response.email) {
      AsyncStorage.setItem('user_email', response.email);
      navigation.navigate("Home")
    }
  }

  const sendSignupRequest = async () => {
    if (userName == null) {
      alert("Please enter a name.")
      return;
    }
    if (userEmail == null) {
      alert("Please enter an email.")
      return;
    }

    console.log("making signup request");

    var body = {
      name: userName.toLowerCase(),
      email: userEmail.toLowerCase()
    }
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };

    var response = makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL +   "api/signup");

    if (response === null) {
      alert("signup failed");
      return;
    }
    if (response.email && response._id) {
      AsyncStorage.setItem('user_email', response.email);
      AsyncStorage.setItem('user_id', response._id);

      createFridge(response.email, response.name + "_personal_fridge");
    }
    navigation.navigate("Home")
  }

  const loginDemoAccount = async () => {
    var body = {
      email: "demo@freshfoodies.com"
    }
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };

    var response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL +  "api/login");

    if (response && response.email) {
      AsyncStorage.setItem('user_email', response.email);
      navigation.navigate("Home")
    }
  }

  return (
    <View style={styles.page}>
        <ImageBackground
                  source={LgLogo}
                  style={{width:"100%", height:80}}
        />
      <View style={styles.form}>
        <TextInput
          value={userName}
          onChangeText={(userName) => setUserName(userName)}
          placeholder={'Username'}
          marginTop={"50%"}
          style={styles.input}
        />
        <TextInput
          value={userEmail}
          onChangeText={(userEmail) => setUserEmail(userEmail)}
          placeholder={'Your Email'}
          style={styles.input}
        />
        <TouchableOpacity onPress={sendLoginRequest} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.signUpText}>
            Don't have an account?{' '}
            <TouchableOpacity onPress={sendSignupRequest}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </Text>
        </View>
        <View style={styles.buttonFlex}>
          <Button
            onPress={loginDemoAccount}
            title="Demo"
            color="#2FC6B7"
            width={150}
          />
          <View style={{ width: 20 }} />
          <Button
            onPress={() => { navigation.navigate("Home") } }
            title="Bypass"
            color="#2FC6B7"
            width={150}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#1CC16A",
    paddingTop: "50%",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 35,
    paddingBottom: "1%",
  },
  form: {
    width: "100%",
    height: "87.5%",
    alignItems: "center",
    justifyContent: "start",
    backgroundColor: "#1CC16A",
    paddingTop: 50,
  },
  input: {
    width:"80%",
    height:"8%",
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#e8e8e8'
  },
  buttonFlex: {
    flexDirection:"row",
    justifyContent: "center",
    marginTop: 60,
  },
  signUpText: {
    color: "#FFFFFF",
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  signUpLink: {
    marginTop: 10,
    color: "#FFFFFF",
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  button: {
    width: "80%",
    height: "8%",
    backgroundColor: "#FFC531",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
