import React, { useEffect, useState, useRef } from 'react';
import { Alert, FlatList, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import { commonPost } from "../components/functions.js";
import Moment from 'moment';
function Messages({ navigation, route }) {
    const [isLoading, setisLoading] = useState(false);
    const [msgArr, setMsgArr] =useState([]);
    useEffect(() => {
        getmessagelist(route.params.user_id);
        Moment.locale('en');
    }, []);
    let getmessagelist = (user_id) => {
        setisLoading(true)
        let data = {
            user_id: 51,
            api_url: 'getMessages'
        }
        var resp = commonPost(data)
            .then(resp => {
                setisLoading(false)
                let result = resp;
                console.log(result);
              setMsgArr(result.data);
              
            })
            .catch((error) => {
                setisLoading(false)
                console.log(error)
            })
        }
        let pressfun = (offerid,title,body) => {
            Alert.alert(
                title,
                body,
                [
                    {
                        text: 'Cancel',
                        onPress: () => confirmFun(offerid,3),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => confirmFun(offerid,1) },
                ]
            );
        }
        let confirmFun=(offerid,status) => {
           
            if(offerid!=0){
            let data = {
                user_id: route.params.user_id,
                offer_id: offerid,
                status: status,
                api_url: 'acceptOffer'
            }
            console.log(data);
            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                    console.log(result);
                   // setMessage(result.message);
                    // setTimeout(() => {
                    //     setMessage('');
                    // }, 5000);
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
    return (
        <SafeAreaView style={styles.scrollArea}>
            <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[customstyles.btnThemecircle, { width: 28, height: 28 }]}>
                        <Ionicons name="md-chevron-back-outline" size={16} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={{ ...customstyles.headerHeading, ...customstyles.flexgrow1, }}>Messages</Text>
            </View>
            <ScrollView style={styles.innerView}>
                <View style={styles.container}>
                {isLoading   && <Loader />} 
                <FlatList
        data={msgArr}
        renderItem={({item,index}) =>  
        <TouchableOpacity style={styles.tranBackground} onPress={() => pressfun(item.offer_id,item.title,item.messages)}>
        <View style={styles.textView}>
        <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.message}>{item.messages}</Text>
        </View>
        <Text style={styles.dateTimeText}>{Moment(item.created_at).format('Y-MM-DD HH:MM ')}</Text>
    </TouchableOpacity> 
                             } 
       
      />
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    tranBackground: {
        width: "100%",
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 2,
        flexDirection: "row",
        alignSelf: "center",
        borderRadius:8,
        marginBottom: 10
    },
    imageStyle: {
        width: 50,
        height: 50,
        alignSelf: "center",
        padding: 5
    },
    textView:{
        flexDirection: "column"
    },
    titleText:{
        fontFamily: "Avenir-Next",
        fontSize: 20,
        paddingLeft:15,
        color: "#663297",
    },
    message: {
        fontFamily: "Avenir-Next",
        fontSize: 12,
        paddingLeft:15,
        color: "#663297",
        paddingBottom:5
    },
    dateTimeText: {
        alignSelf: "center",
        fontSize: 12,
        fontFamily: "Avenir-Next",
        padding:3.5,
        color: "#663297",
        marginLeft: "auto",
        marginRight: 15
    },
      inputtheme: {
        // height: "10%",
        height: 46,
        width: "100%",
        borderWidth: 2,
        borderColor: "#663792",
        borderRadius: 30,
        marginBottom: 10,
        //placeholderColor: "#555",
        //placeholderOpacity: .5,
        color: "#555",
        fontSize: 16,
        fontFamily: "Roboto",
        fontWeight: "normal",
        paddingLeft: 35,
        paddingRight: 35,
      },
});


export default Messages;


