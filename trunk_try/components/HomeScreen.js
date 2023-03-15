import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
const image_logo = require('../assets/Images/logo_old+found.png');
import { LinearGradient } from 'expo-linear-gradient';
import { customstyles } from "../customstyle";
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };
import AsyncStorage from '@react-native-async-storage/async-storage';
// 23.09.2020
function HomeScreen({ navigation }) {

  const [userInfo, setUserInfo] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState([]);

  useEffect(() => {
    checkLogin();
  }, []);


  let checkLogin = async () => {
    const login = await AsyncStorage.getItem('userInfo');
    if (login !== null) {
      setUserInfo(JSON.parse(login));
      navigation.navigate('MyTabs', {
        userDetails: userInfo,
      });
    }
    else {
      navigation.navigate('HomeScreen');
    }
  }

  let loginNavigation = () => {
    navigation.navigate('LoginScreen');
  }
  let signupNavigation = () => {
    navigation.navigate('Signup');
  }


  return (
    <View style={styles.screenContainer}>

      <LinearGradient colors={['#20004A', '#20004A', '#20004A']} start={{ x: 0, y: .5 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}
      >
        <View style={customstyles.logincontainer}>
          <View style={{ display: "flex", alignItems: "center" }}>
            <View style={{...customstyles.whiteCircle, backgroundColor: "transparentw"}}>
              <Image
                source={image_logo}
                style={styles.image} />
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={loginNavigation}
              style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowverticalcenter}>
            <Text style={styles.lineseprator}></Text>
            <Text style={styles.orseprator}>OR</Text>
            <Text style={styles.lineseprator}></Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={signupNavigation}
              style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
  },
  linearGradient: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 20
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 10,
    // paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
  },
  appButtonText: {
    fontSize: 20,
    color: "#28445c",
    fontWeight: "700",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  image: {
    width: 100,
    height: 100,
    //top: "50%",
    //left: "50%",
    //transform: translate
    //transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    //position: 'relative',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  title: {
    //position: "fixed",
    top: "25%",
    left: "50%",
    //transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  rowverticalcenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lineseprator: {
    height: 2,
    backgroundColor: "#fff",
    width: "40%"
  },
  orseprator: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
    marginVertical: 5,
    width: "20%"
  },
});

export default HomeScreen;
