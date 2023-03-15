import React, { Component } from 'react';
import { Alert, Modal, View, StyleSheet, Text,TextInput, TouchableOpacity, SafeAreaView, Image, Dimensions, ScrollView, StatusBar, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';
//import SideSwipe from 'react-native-sideswipe';
import { customstyles } from "../customstyle";
import { commonGet, commonPost, commonGetwithkey,getUserAddress, getFolderPercent, getQuestionsAnswered, transactionlist, commonPostText, LoginAPI, eKYCStart, eKYCVerify,retriveWallet} from './functions';
import Background from './Background';
import  ModelAlert  from './ModelAlert';
import fractionUnicode from 'fraction-unicode';
import * as Progress from 'react-native-progress';
const slide1 = require('../assets/Images/McDonalds-coupons.jpg');
const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 30;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH) - 200;
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT)
const currImage = require("../assets/Images/image_background.jpg");
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import PaginationDot from "react-native-animated-pagination-dot"
import NormCard from "./NormCard"
import messaging from '@react-native-firebase/messaging';
import Dialog from "react-native-dialog";
const infoData = {
    labels: ["Swim", "Bike", "Run"], // optional
    data: [0.4, 0.6, 0.8]
  };
const percentage = 66;
const chartConfig= {
backgroundColor: "#EFF1F3",
backgroundGradientFrom: "#EFF1F3",
backgroundGradientTo: "#EFF1F3",
decimalPlaces: 2, // optional, defaults to 2dp
color: (opacity = 1) => `rgba(102, 35, 151, ${opacity})`,
labelColor: (opacity = 1) => `rgba(102, 35, 151, ${opacity})`,
style: {
    borderRadius: 16
},
propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
}
}


var coinsIcon = require("../assets/Images/coins.png");
var cards = require("../assets/Images/cards_credit.png");
var vaccount = require("../assets/Images/network_account.png");
var mtransfer = require("../assets/Images/transfer.png")
var valueEnd = 66;
var folderPercents = null;
var listTransactions = [
    {
        "brand_name": "Citibank",
        "imagepath": "../assets/Images/transfer.png",
        "title": "New Account",
        "amount": 50,
        "time": "12:00 11/11/2011"
    },
    {
        "brand_name": "Citibank",
        "imagepath": "../assets/Images/transfer.png",
        "title": "New Account",
        "amount": -50,
        "time": "12:00 11/11/2011"
    },
    {
        "brand_name": "Citibank",
        "imagepath": "../assets/Images/transfer.png",
        "title": "New Account",
        "amount": 50,
        "time": "12:00 11/11/2011"
    },
    {
        "brand_name": "Citibank",
        "imagepath": "../assets/Images/transfer.png",
        "title": "New Account",
        "amount": 50,
        "time": "12:00 11/11/2011"
    },
];

class ProfileScreen extends Component {
    state = {
        userData: '',
        activeIndex: 0,
        carouselItems: [],
        selectedMenu: '',
        generalFolder: '',
        referemail: '',
        email_err: '',
        visible: false,
        is_wallet_check: '',
        isLoading: false,
        isLoading1: false,
        logoutstatus: false,
        deactivateStatus: false,
        kycstatus: false,
        walletstatus: false,
        firstFrac: 1,
        secondFrac:1,
        percentValue:1,
        listTags: [],
        listCategories: [],
        generalFolder: [],
		numAnswered: 1,
		 transactionList: [],
		 kycID: [],
       kycDone: false,
       couponpopup: false,
    }

    componentDidMount() {
        const value = AsyncStorage.getItem('userInfo')
            .then((value) => {
               console.log("This information")
               console.log(value);
               this.setState({
                   userData: JSON.parse(value),
               });
               this.setState({
                kycID: userData.verification_id});
 
               if ((JSON.parse(value).mm_wallet_check == 1)) {
                   this.setState({
                       is_wallet_check: 1,
                   });
               } else {
                   this.setState({
                       is_wallet_check: 0,
                   });
               }
               console.log("Wallet State: " + this.state.is_wallet_check);
               console.log("User ID: ", this.state.userData.id);
               this.getListCategories();
               this.getNumAnswered(this.state.userData.id);
               this.viewtransactionlist(this.state.userData.id)
           });
            console.log("userData"+this.state.userData)
            messaging().onNotificationOpenedApp(remoteMessage => {
                console.log('Message handled', remoteMessage);
                const title= remoteMessage.notification.title;
                const  body = remoteMessage.notification.body;
                const  offerid = remoteMessage.data.offerId;
               
               Alert.alert(
                title,
                body,
                [
                    {
                        text: 'Cancel',
                        onPress: () => this.confirmFun(offerid,3),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => this.confirmFun(offerid,1) },
                ]
            );
              });
            //   messaging().setBackgroundMessageHandler(
            //     async (remoteMessage) => {
            //       console.log(
            //         'Message handled in the background!',
            //         remoteMessage
            //       );})
                this.checklocationstatus();
                this.requestPermission();
                this.getToken();
				 this.getGeneralOffer();
    }
 
    async confirmFun(offerid,status) {
        console.log('offerid', offerid);
        if(offerid!=0){
        let data = {
            user_id: this.state.userData.id,
            offer_id: offerid,
            status: status,
            api_url: 'acceptOffer'
        }
        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                console.log(result);
                setMessage(result.message);
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }
    
    async requestPermission() {
        try {
          await messaging().requestPermission();
          this.getToken();
        } catch (error) {
          alert('permission rejected');
        }
    }
    async getToken() {
        const fcmToken = await messaging().getToken();
            if (fcmToken) {
               // console.log(fcmToken)
                let data = {
                    api_url: 'insertToken',
                    user_id:this.state.userData.id,
                    fcmToken:fcmToken,
                }
                console.log(data)
                var resp = commonPost(data)
                    .then(resp => {
                        let result = resp.data;
                        console.log(resp);
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
           // console.log('Device_token')
    }
    getlocation = () => {
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
              const currentLongitude = 
                JSON.stringify(position.coords.longitude);
              const currentLatitude = 
                JSON.stringify(position.coords.latitude);
                let data = {
                    api_url: 'insertGeoLoction',
                    user_id:this.state.userData.id,
                    latitude:currentLongitude,
                    longitude:currentLatitude
                }
                console.log(data)
                var resp = commonPost(data)
                    .then(resp => {
                        let result = resp.data;
                        console.log(resp);
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
            (error) => {
      
            },
            {
              enableHighAccuracy: false,
              timeout: 30000,
              maximumAge: 1000
            },
          );
    }
    checklocationstatus = () => {
        let data = {
            api_url: 'profile'
        }
        var resp = commonGet(data)
            .then(resp => {
                let result = resp.data;
                console.log("result+++++++"+resp.location_access_constent)
           if(resp.location_access_constent==1){
            Geolocation.getCurrentPosition(
                //Will give you the current location
                (position) => {
                    this.getlocation();
                },
                (error) => {
                  console.log(error)
                  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                    interval: 10000,
                    fastInterval: 5000,
                  })
                    .then((data) => {
                        this.getlocation();
                    })
                    .catch((err) => {
                        console.log(err)
                    });
                },
                {
                  enableHighAccuracy: false,
                  timeout: 30000,
                  maximumAge: 1000
                },
              );
           }
           
            })
            .catch((error) => {
                console.log(error)
            })
    }

    onPressTags = (indexKey) =>{
        var currListTags = [];
        for(let i = 0; i<this.state.generalFolder.length; i++){
            currListTags.push(i == indexKey);
		}
          this.setState({
           listTags: currListTags,
           firstFrac: this.state.listCategories[indexKey].insertedcount,
           secondFrac: this.state.listCategories[indexKey].totalcount,
           percentValue: this.state.listCategories[indexKey].percentage
       });
        // this.setState({
        //     listTags: currListTags,
        //     firstFrac: this.state.listCategories[indexKey].filled,
        //     secondFrac: this.state.listCategories[indexKey].not_filled,
        //     percentValue: this.state.listCategories[indexKey].filled/this.state.listCategories[indexKey].not_filled
        // });
        

        //Find which tag has been pressed,
        //Unpress all other tags --> change design back to normal
        //Load amount of documents passed out of amount of entered documents --> API needed
    }

    onPressEditProfile = () => {
        this.props.navigation.navigate('EditProfile', {
            userDetails: this.state.userData,
        })
    }
  viewtransactionlist = (user_id) => {
    this.setState({
        isLoading: true
    })
    var resp = transactionlist(user_id,1) 
        .then(resp => {
            let result = resp;
            finalList = [];
            console.log("TransactionsResp", result);
            for(let i = 0; i < result.transactions.length; i++){
                if(result.transactions[i].type != "Get Card"){
                    finalList.push(result.transactions[i]);
                }
            }
            this.setState({
                transactionList: finalList,
                isLoading: false
            });
        })
        .catch((error) => {
            this.setState({
                isLoading: false
            })
            console.log(error)
        })
    }
    onPressCategory = () => {
        this.props.navigation.navigate('Category', {
            userDetails: this.state.userData,
        })
    }
    onPressWallet = () => {
        var resp = retriveWallet(this.state.userData.id)
        .then(resp => {
            console.log("resp", resp.code);
            if(resp.code==404){
                let data = {
                    id: this.state.userData.id,
                    type: 'billing'
                }
                var resp1 = getUserAddress(data)
                .then(resp1 => {
                    console.log("resp"+resp);
                    console.log(resp1);
                    if(resp1.code==403){
                        alert("Please update your billing address")
                        this.props.navigation.navigate('Address', { userDetails: this.state.userData.id })
                    }else{
                        alert("Please create your wallet")
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
            }else{
                console.log("error")
                this.props.navigation.navigate('Wallet', { user_id: this.state.userData.id })
            }
           
        })
        .catch((error) => {
            console.log("error")
            console.log(error)
        })
        // this.props.navigation.navigate('Wallet', {
        //     userDetails: this.state.userData,
        // })
    }
    onPressAdd = () =>{
        this.props.navigation.navigate('Info', {
            userDetails: this.state.userData,
        })
    }
    onPressAddress = () => {
        this.props.navigation.navigate('Address', {
            userDetails: this.state.userData,
        })
    }
	 offerNavigate = () => {
       console.log(this.state.userData);
       let data = {
        id: this.state.userData.id,
        api_url: 'userDetailById'
    }
    var resp = commonPost(data)
        .then(resp => {
            
            let result = resp.data;
            console.log(result);
        if(result.dob){
            this.props.navigation.navigate('Offer', { user_id: this.state.userData.id, userDetails:this.state.userData })
        }else{
            alert("Plesae fill your complete profile details to view offers")
            this.props.navigation.navigate('EditProfile', { userDetails: this.state.userData })    
        }
        })
        .catch((error) => {
            console.log(error)
        })
     
   }
	 offerQuestion = () => {
       console.log(this.state.userData);
       this.props.navigation.navigate('Question', {
           user_id: this.state.userData.id,
       });
   }
    onPressInfo = () => {
        this.props.navigation.navigate('Info', {
            user_id: this.state.userData.id,
        })
    }

    
   onPressQuestion = () => {
    this.props.navigation.navigate('Question', {
        user_id: this.state.userData.id,
    })
   }
    changepassword = () => {
        this.props.navigation.navigate('ChangePassword', {
            userDetails: this.state.userData,
        })
    }

    onPressOffer = () => {
        let data = {
            id: this.state.userData.id,
            api_url: 'userDetailById'
        }
        var resp = commonPost(data)
            .then(resp => {
                
                let result = resp.data;
                console.log(result);
            if(result.dob){
                this.props.navigation.navigate('Offer', { user_id: this.state.userData.id, userDetails:this.state.userData })
            }else{
                alert("Plesae fill your complete profile details to view offers")
                this.props.navigation.navigate('EditProfile', { userDetails: this.state.userData })    
            }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getNotification = () => {
        this.props.navigation.navigate('Messages', {
            user_id: this.state.userData.id,
        })
    }
    getMessages = () => {
        this.props.navigation.navigate('Messages', {
            user_id: this.state.userData.id,
        })
    }

 getNumAnswered = (user_id) => {
        try{
            let listGetAnswers = [];
            let finalResp = getQuestionsAnswered(user_id)
            .then(finalResp => {
            let result = finalResp.data;
            listGetAnswers = result
            var count = 0;
            var currTime = "";
            var date = new Date().getDate();
            if(date.length == 1){
                date = "0" + date;
            }
            var month = new Date().getMonth() + 1;
            if(month.length == 1){
                month = "0" + month;
            }
            var year = new Date().getFullYear();
            var todayDate = year + "-" + month + "-" + date;
            for (let i = 0; i < listGetAnswers.length; i++){
                currTime = listGetAnswers[i].updated_at;
                if(currTime.substring(0, currTime.indexOf(" ")) == todayDate){
                    count += 1;
                }
            }
            if(count >= 5){
                count = 5;
            }
            this.setState({
                numAnswered: count
            })
            })
        } catch(error){
            console.log(error);
        }
    }
    userLogout = () => {
        this.setState({
            logoutstatus: true,
        })
    }
    confirmLogout = () => {
        this.setState({
            logoutstatus: false,
        })
        AsyncStorage.removeItem('userInfo'); this.props.navigation.navigate('HomeScreen');
    }
    cancelLogout = () => {
        this.setState({
            logoutstatus: false,
        })
    }

    LoggedOut = () => {
        console.log('LoggedOut');
    }

    openMenu = () => {
        console.log('openMenu');
        this.setState({
            visible: true,
        })
    }

    closeMenu = () => {
        this.setState({
            visible: false,
        })
    }

    // deactiveAccount
    deactiveAccount = () => {
        this.setState({
            deactivateStatus: true,
        })
    }
    confirmDeactive = () => {
        this.setState({
            deactivateStatus: false,
        })
        let data = {
            id: this.state.userData.id,
            api_url: 'deactivateMMuser'
        }
       // console.log(data); 

        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                let message = result.description;
                // let status = result.status;
                console.log(result);
                this.setState({
                    deactive_msg: message,
                })
                setTimeout(() => {
                    localStorage.clear();
                    this.props.navigation.navigate('Login');
                    this.setState({
                        deactive_msg: '',
                    });
                }, 4000);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    cancelDeactive = () => {
        this.setState({
            deactivateStatus: false,
        })
    }
    // Close

    // check Kyc
 // check Kyc
    initiateKYC = () => {
        //Get verification_id from userData
        Alert.alert(
            'Check KYC Status',
            'Your KYC has not been completed. Would you like to proceed to complete it?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Yes', onPress: () => linkKYC() },
            ]
        );
    
        let linkKYC = () => {
            let userId = this.state.userData.id;
            //console.log(data); return;
    
            var resp = eKYCVerify(userId)
                .then(resp => {
                    let result = resp;
                    let status = result.status;
                    let link = result.links.href;
                    if ((status == 200)) {
                        this.setState({
                            active_msg: 'Redirecting you to complete KYC...',
                        }); 
                        setTimeout(() => {
                            this.setState({
                                active_msg: '',
                            });
                        }, 4000);
                        Alert.alert(
                        'Complete KYC',
                        'Click the "OK" button below to open your KYC in a third-party platform and proceed.\n' + link,
                        [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'Open Link in Browser', onPress: () => openURL(link) },
                        ]
                        );
                    } else if ((status == 201)) {
                    //Missing parameters, go to edit profile page
                        this.setState({
                            deactive_msg: 'Missing parameters in profile needed to complete KYC.',
                        });
                        setTimeout(() => {
                            this.setState({
                                deactive_msg: '',
                            });
                        }, 2000);
                        this.onPressEditProfile();
                    } else {
                    this.setState({
                        deactive_msg: 'Please try again later.',
                    });
                    setTimeout(() => {
                            this.setState({
                                deactive_msg: '',
                            });
                        }, 2000);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    
    }
      
    confirmKYC = () => {
        let userId = this.state.userData.id;
      
        var resp = eKYCStart(userId)
        .then(resp => {
            let result = resp;
            let status = result.verification_details.status;
            let actual_status = result.status;
      
            if(actual_status == 4 && status == "approved"){
                Alert.alert(
                    'KYC Status',
                    'Your KYC has successfully been completed!',
                    [
                        { text: 'OK', onPress: () => this.setState({kycDone: true}) },
                    ]
                );
            } else {
                initiateKYC();
            }
            
        })
        .catch((error) => {
            console.log(error);
        })
      
      
      }
    openURL = ({ url }) => {
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            }
        }, [url]);
    }
    // Close
    // Create Wallet
    
    createcoupon = () => {
        this.setState({
            couponpopup: true,
        })
    }
    cancelbox = () => {
        this.setState({
            couponpopup: false,
        })
    }
    handleSendEmail = () => {
        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        console.log(this.state.referemail);
        if ((this.state.referemail == '')) {
            this.setState({
                email_err: 'Email is required'
            })
            return;
        } else {
            this.setState({
                email_err: ''
            })
        }
        if (pattern.test(this.state.referemail) === false) {
            this.setState({
                email_err: 'Email is not valid'
            })
            return;
        } else {
            this.setState({
                email_err: ''
            })
        }
        this.setState({
            couponpopup: false,
        })
        let data = {
            user_id:this.state.userData.id,
            referemail: this.state.referemail,
            api_url: 'createcoupon'
        }
       // console.log(data); 

        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                let message = result.message;
                // let status = result.status;
                console.log(result);
                if(result.status==1){
                    this.setState({
                        active_msg: message,
                    });
                    setTimeout(() => {
                        this.setState({
                            active_msg: '',
                        });
                    }, 4000);
                }else{
                    this.setState({
                        deactive_msg: message,
                    });
                    setTimeout(() => {
                        this.setState({
                            deactive_msg: '',
                        });
                    }, 4000);
            }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    createWallet = () => {
        if(this.state.userData.current_location==1){
            this.props.navigation.navigate('Wallet', { user_id: this.state.userData.id })
        }else{
        this.setState({
            walletstatus: true,
        })
    }
    }
    confirmWallet = () => {
        this.setState({
            walletstatus: false,
        })
        let data1 = {
            id: this.state.userData.id,
            type: 'billing'
        }
        var resp1 = getUserAddress(data1)
        .then(resp1 => {
            console.log("resp"+resp);
            console.log(resp1);
            if(resp1.code==403){
                alert("Please update your billing address")
                this.props.navigation.navigate('Address', {
                    userDetails: this.state.userData.id
                })
            }else{
                let userId = this.state.userData.id;
                let data = {
                    id: userId,
                    api_url: 'createWallet'
                }
                //console.log(data); return;
                this.setState({
                    isLoading: true,
                });
                var resp = commonPost(data)
                    .then(resp => {
                        let result = resp;
                        console.log(result);
        
                        let message = result.description;
                        let code = result.code;
                        if ((code == 400)) {
                            this.setState({
                                deactive_msg: message,
                                isLoading: false,
                            });
                            setTimeout(() => {
                                this.setState({
                                    deactive_msg: '',
                                });
                            }, 4000);
                        } else {
                            this.setState({
                                active_msg: message,
                                isLoading: false,
                            });
                            setTimeout(() => {
                                this.setState({
                                    active_msg: '',
                                });
                            }, 4000);
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
        .catch((error) => {
            console.log(error)
        })
       
    }
    cancelWallet = () => {
        this.setState({
            walletstatus: false,
        })
    }
	 getGeneralFolder = () => {
       let data = {
           id: '0',
           api_url: 'getCommonFolder'
       }
 
       var resp = commonGet(data)
           .then(resp => {
               let result = resp.data;
               //console.log(result);
               setDataisLoaded(true);    
           })
           .catch((error) => {
               console.log(error)
           })
   }
     getListCategories = () => {
       console.log("User ID: ", this.state.userData.id);
       getFolderPercent(this.state.userData.id).then((folderPercents) => {
           var currListCategories = [];
           for(let i = 0; i<folderPercents.data.length; i++){
               currListCategories.push(folderPercents.data[i]);
               if(folderPercents.data[i].percentage > 100){
                   folderPercents.data[i].percentage = 100;
               }
               if(folderPercents.data[i].insertedcount > folderPercents.data[i].totalcount){
                   folderPercents.data[i].insertedcount = folderPercents.data[i].totalcount;
               }
           }
           console.log("currListCategories", currListCategories);
           var currListTags = [];
           for(let i = 0; i<currListCategories.length; i++){
               currListTags.push(i == 0);
           }
           this.setState({
               listTags: currListTags,
               listCategories: currListCategories,
               firstFrac: currListCategories[0].insertedcount,
               secondFrac: currListCategories[0].totalcount,
               percentValue: currListCategories[0].percentage
           })
       });
 
   } 
   // Get General offer
   getGeneralOffer = () => {
       let data = {
           api_url: 'getGeneralOffer'
       }
       var resp = commonGet(data)
           .then(resp => {
               let result = resp.data;
               console.log(resp);
               if (result) {
                   this.setState({
                       carouselItems: result,
                   })
                   console.log(result);
               }
           })
           .catch((error) => {
               console.log(error)
           })
   }
    // Close
    setmenu = (value) => {
        //console.log(value);
        if ((value == 'Edit Profile')) {
            this.onPressEditProfile();
        } else if ((value == 'Set Prefrence')) {
            this.onPressCategory();
        } else {
            this.userLogout();
        }
        this.setState({
            selectedMenu: value
        });
    }

    _renderItem({ item, index }) {    // coursel
        return (
            <View style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}} key={index}>
                <NormCard color_first={"#662397"} color_darker_second={"black"} four_array={item} width={IMG_WIDTH * 1} height={115} showDescription/>
            </View>
        )
    }
//import AppLoading from 'expo-app-loading';
    render() {
        return (
                <SafeAreaView style={[styles.scrollArea, {display: 'flex', flex: 1}]}>
                      <Provider>
                        <View style={customstyles.header}>
                            <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, marginLeft: 15}}>My Profile</Text>
                            <Menu
                                visible={this.state.visible}
                                onDismiss={this.closeMenu}
                                style={{
                                    width: 200,
                                }}
                                anchor={<Button onPress={this.openMenu}>
                                    <Ionicons name="person-circle-outline" size={32} color="#662397" />
                                </Button>}>

                                <Menu.Item onPress={this.onPressEditProfile} title="Edit Profile" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                                <Menu.Item onPress={this.onPressCategory} title="Categories" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                          { this.state.userData.current_location!=1  &&   
                           
                                <Menu.Item onPress={this.confirmKYC} title="Check KYC Status" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                          }
                                <Menu.Item onPress={this.onPressAddress} title="Set Address" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                                { this.state.userData.current_location!=1  &&       
                                <Menu.Item onPress={this.deactiveAccount} title="Deactivate Account" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                                }    
                                <Menu.Item onPress={this.getNotification} title="Notification" style={{ borderColor: "#ddd", borderBottomWidth: 1, }} />
                                <Menu.Item onPress={this.userLogout} title="Logout" />
                            </Menu>
                        </View>
                        <ScrollView >
                        <Dialog.Container visible={this.state.couponpopup}>
                          <Dialog.Title style={{...customstyles.h4,textAlign:'center'}}>Reference Email Id</Dialog.Title>
                            <Dialog.Description>
                            <Dialog.Input label="Email" onChangeText={(referemail) => this.setState({ referemail })}
                             style={{width:250}}></Dialog.Input>
                            
                            </Dialog.Description>
                            <View>{
                                    this.state.email_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.email_err}</Text>
                                }</View>
                            <Dialog.Button label="Submit" onPress={this.handleSendEmail} style={customstyles.btnThemexs} />
                            <Dialog.Button label="Cancel" onPress={this.cancelbox} style={{ ...customstyles.btnRedxs, ...customstyles.ml5 }} />
                        </Dialog.Container>
                        <View style={customstyles.px15}>
                            {
                                this.state.deactive_msg !== '' &&
                                <Text style={{ color: 'red' }}>{this.state.deactive_msg}</Text>
                            }
                            {
                                this.state.active_msg !== '' &&
                                <Text style={{ color: 'green' }}>{this.state.active_msg}</Text>
                            }
                            <Text style={customstyles.titleText}>Welcome {this.state.userData.fname != '' ? this.state.userData.fname : ''} {this.state.userData.lname != '' ? this.state.userData.lname : ''}</Text>
                        </View>
                        <ModelAlert
         Alert_Visibility={this.state.logoutstatus}
         cancelAlertBox={this.cancelLogout}
         title={"Logout"}
         body={"Are you sure you want to Logout?"}
         confirmalert={this.confirmLogout}
         />
                    <ModelAlert
         Alert_Visibility={this.state.deactivateStatus}
         cancelAlertBox={this.cancelDeactive}
         title={"Deactivate Account"}
         body={"Are you sure you want deactivate your account?"}
         confirmalert={this.confirmDeactive}
         />
                    <ModelAlert
         Alert_Visibility={this.state.kycstatus}
         cancelAlertBox={this.cancelKyc}
         title={"Check KYC Status"}
         body={"Are You Interested To Check Your KYC Status?"}
         confirmalert={this.confirmKyc}
         />
                    <ModelAlert
         Alert_Visibility={this.state.walletstatus}
         cancelAlertBox={this.cancelWallet}
         title={"Create Wallet"}
         body={"Are you sure you want to create a wallet?"}
         confirmalert={this.confirmWallet}
         />
                        <View style={customstyles.px15}>
                            <Text style={customstyles.update}>Here are your updates!</Text>
                        </View>
                        {this.state.userData.coupon_status==0 &&  <View style={customstyles.px15} >
                        <TouchableOpacity  onPress={() => this.createcoupon()}>
                            <Text style={customstyles.update}>Click here create coupon</Text></TouchableOpacity>
                        </View>}
                        <View style={[customstyles.row, customstyles.justifyContentcenter, customstyles.px10, { marginBottom: 10}]}>
                            <View style={[customstyles.p5, customstyles.lightbox, { width: "48%"}]}>
                                {/*<TouchableOpacity onPress={this.onPressInfo} style={[storeStyle.widgetStore]}>*/}
                                    <Text style={[customstyles.titleText, {textAlign: "center", fontWeight: "bold", color: "#663297"}]}>Info Store</Text>
                                    <Text style={{color: "#662397", fontSize: 10, textAlign: "center", padding: 5}}>Upload more documents for easy access!</Text>
                                     <ScrollView persistentScrollbar style={{display: "flex", flexDirection: "row", backgroundColor: "transparent", borderRadius: 16, margin: 2}}>
                                       <View style={{flexDirection: "row", justifyContent: "center", padding: 5}}>
                                           {
                                               this.state.listCategories.map((object, i) => (
                                                   <View style={{display: "flex"}}>
                                                       <TouchableOpacity style={ this.state.listTags[i] ? customstyles.tagStyle2 : customstyles.tagStyle1} key={i} onPress={() => this.onPressTags(i)}>
                                                           <Text style={ this.state.listTags[i] ? customstyles.tagText2: customstyles.tagText1}>{object.folder_name}</Text>
                                                       </TouchableOpacity>
                                                   </View>
                                               ))
                                           }
                                       </View>
                                   </ScrollView>
                                                            <View style={{padding: 10}}>
                                       {
                                           (this.state.percentValue != null && this.state.firstFrac != null && this.state.secondFrac != null) ?
                                           <View style={{borderWidth: 2, borderColor: "#663297", padding: 5, borderRadius: 5}}>
                                               <Text style={[storeStyle.completionText]}>Progress</Text>
                                               <View style={{display: "flex", flexDirection: "row"}}>
                                                   <View style={{flexDirection: 'column', alignSelf: 'flex-start', alignItems: "center"}}>
                                                       <Progress.Circle size={60} animated={true} style={[customstyles.progressChart]} progress={this.state.percentValue} thickness={25} unfilledColor= "#cbb8d9" color="#662397" borderWidth={0}>
                                                       </Progress.Circle>                                          
                                                <Text style={{display: "flex", justifyContent: "center", fontWeight: "bold"}}> {Math.round(this.state.percentValue)}%</Text>
                                            </View>
                                            <View style={{padding: 5, flex: 1, flexDirection: "column", alignSelf: "center", backgroundColor: "transparent"}}>
                                                <Text style={{fontSize: 26, justifyContent: "center", alignSelf: "center", fontWeight: "bold", alignSelf: "center", color: "#662397"}}>{fractionUnicode(this.state.firstFrac,this.state.secondFrac)}</Text>
                                                <TouchableOpacity style={[customstyles.btnThemexs, {marginTop: 5}]} onPress={this.onPressAdd} >
                                                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                                        <Text style={{color: "#fff", fontSize: 10}}>View</Text>
                                                    </View>
                                                </TouchableOpacity>
                                        
                                            </View>
                                        </View>
                                    </View> :
                                           <View>
                                           </View>
                                       }
                               
                            </View>
                            </View>
                            <View style={[customstyles.p15, customstyles.lightbox, { width: "48%" }]}>
                                <Text style={[customstyles.titleText, {marginBottom: 5, textAlign: "center"}]}>Wallet</Text>
                                {
                                    this.state.is_wallet_check !== 1 ?
                                        <View>
                                                       <Text style={{...customstyles.titleText, textAlign: "center", color: "black", opacity: 0.5, fontSize: 20, fontFamily: null, fontWeight: "normal", padding: 20}}>Don't have a wallet?</Text>
                                            <TouchableOpacity onPress={this.createWallet} style={customstyles.textCenter}>
                                                <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                                                    <Text style={customstyles.btnThemexs}>
                                                        {this.state.isLoading ? "Creating..." : "Create Wallet"}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            
                                        </View> :
                                        <View style={{flex: 1.5}}>
                                            <TouchableOpacity style={customstyles.btnThemexs} onPress={this.onPressWallet} >
                                                <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                                    <Text style={{color: "#fff", padding: 5}}>View Details</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <Text style={{fontSize: 10, fontWeight: "bold"}}>Recent Transactions</Text>
                                            <ScrollView style={{ padding: 5, height: 75}}>
                                                {
                                                    listTransactions.map((object, i) => (
                                                            <TouchableOpacity style={ object.amount > 0 ? otherStyles.tranGreenBackground : otherStyles.tranRedBackground }> 
                                                                <Image source={mtransfer} style={otherStyles.imageStyle}></Image>
                                                                <View style={otherStyles.textView}>
                                                                    { object.amount>0 ?
                                                                        <Text style={otherStyles.titleText}>+${object.amount}</Text>
                                                                    :
                                                                        <Text style={otherStyles.titleText}>-${object.amount.toString().split("-")[1]}</Text>
                                                                    } 
                                                                </View>
                                                                <View style={otherStyles.secondTextView}>
                                                                    <Text style={otherStyles.dateTimeText}>{object.time.split(" ")[0]}</Text>
                                                                    <Text style={otherStyles.dateTimeText}>{object.time.split(" ")[1]}</Text>
                                                                </View>
                                                                <View style={{flex: 0.5}}>
                                                                </View>
                                                            </TouchableOpacity>   
                                                    ))    
                                                }
                                            </ScrollView>
                                        </View>
                                } 
                            </View>
                        </View>
                        {/* coursel */}
                        <View style={{display: "flex", flexDirection: "row", ...customstyles.justifyContentcenter, ...customstyles.px10, marginBottom: 10}}>
                       <View style={{...customstyles.filterContainer, display: "flex", flexDirection: 'column',  width: "48%"}}>
                           <View style={{display: "flex", flexDirection: "column", opacity:1}}>
                               <Text style={[customstyles.titleText, {marginBottom: 5, alignSelf: "center"}]}>Offers</Text>
                           </View>
                           <Text style={{fontSize: 10, color: "#662397", textAlign: "center", padding: 10}}>The latest data offers in the marketplace today...</Text>
                           <TouchableOpacity onPress={this.onPressOffer} style={{display: "flex", flexDirection: "column"}}>
                               <Carousel
                                   style={{marginLeft: "auto"}}
                                   layout={"default"}
                                   ref={ref => this.carousel = ref}
                                   data={this.state.carouselItems}
                                   sliderWidth={IMG_WIDTH*0.5}
                                   sliderHeight={125}
                                   itemWidth={IMG_WIDTH*0.5}
                                   itemHeight={125}
                                   renderItem={this._renderItem}
                                   autoplay={true}
                                   autoplayInterval={1500}
                                   loop={true}
                                   vertical={true}
                                   onSnapToItem={index => this.setState({ activeIndex: index })} />
                                <View style={{justifyContent: "center", alignSelf: "center", padding: 2.5}}>
                                    <PaginationDot
                                        activeDotColor={'#662397'}
                                        curPage={this.state.activeIndex}
                                        sizeRatio={0.5}
                                        maxPage={this.state.carouselItems.length}
                                        vertical={false}
                                    />
                                </View>
                           </TouchableOpacity>
                           <TouchableOpacity style={{...customstyles.btnThemexs}} onPress={this.offerNavigate} >
                                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                        <Text style={{color: "#fff", padding: 5}}>Visit Marketplace</Text>
                                    </View>
                            </TouchableOpacity>
                       </View>
                        {/* Close */}
						   <View style={{...customstyles.filterContainer, display: "flex", flexDirection: 'column',  borderRadius: 10, marginLeft: 15, width: "48%"}}>
                           <View style={{display: "flex", flexDirection: "column", opacity:1}}>
                               <Text style={[customstyles.titleText, {marginBottom: 5, alignSelf: "center"}]}>Questions</Text>
                           </View>
                           <View style={{display: "flex", flexDirection: "column"}}>
                                <View style={{display: "flex", flexDirection: "row"}}>
                                    <Text style={{fontSize: 10, color: "#662397", textAlign: "center", padding: 10}}>Answer 5 questions today to meet your daily goal!</Text>
                                </View>
                                <View style={{flexDirection: 'column', alignSelf: 'center', alignItems: "center"}}>
                                    <Progress.Circle size={120} showsText animated={true} style={[customstyles.progressChart]} progress={this.state.numAnswered/5} thickness={25} unfilledColor= "#cbb8d9" color="#662397" borderWidth={0}>
                                    </Progress.Circle>                                         
                                </View>
                                <TouchableOpacity style={{...customstyles.btnThemexs, marginTop: 20}} onPress={this.offerQuestion} >
                                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                                        <Text style={{color: "#fff", padding: 5}}>To Question Store</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                       </View>
                       </View>
                       <View style={{padding: 20}}></View>
                       </ScrollView>
                       </Provider>
                </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    scrollArea: {
        flex: 1,
        width: "100%",
        // paddingTop: StatusBar.currentHeight,
        paddingBottom: 0,
        backgroundColor: "#F2F2F2",
    },
    innerView: {
        //flex: 1,
        height: "100%",
        paddingHorizontal: 20,
        // paddingBottom: 15,
    },

    container: {
        // flex: 1,
        //alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#ecf0f1',
        marginBottom: 30,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%"
    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        marginBottom: 20,
    },
    offerTitleHeading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingHorizontal: 10,
        color: "#fff",
        textAlign: "left",
        backgroundColor: "rgba(0, 0, 0, .5)",
        fontSize: 15,
        //fontWeight: "600",
    },
    company_name: {
        position: "absolute",
        left: 0,
        bottom: 0,
        textAlign: "left",
        backgroundColor: "rgba(0, 0, 0, .5)",
        borderTopRightRadius: 20,
        color: "#fff",
        margin: 0,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 10
    },
    price: {
        position: "absolute",
        bottom: 0,
        right: 0,
        textAlign: "left",
        backgroundColor: "rgba(0, 0, 0, .5)",
        borderTopLeftRadius: 20,
        color: "#fff",
        margin: 0,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 10
    },
    sliderImg: {
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        //inlineSize: '100%',
        //aspectRatio: '16 / 9',
        //objectFit: 'cover',
    },
})
const storeStyle = StyleSheet.create({
    widgetStore: {
        width: "100%",
        padding: 15,
        backgroundColor: "#EFF1F3",
        borderRadius: 10,
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 0.2,
        // shadowRadius: 10,
    },
    rectangle: {
        width: "90%",
        height: "70%",
        backgroundColor: "#963910",
        borderRadius: 10
    },
    storeImage: {
        width: 100,
        height: 100,
    },
    titleText: {
        fontWeight: "700",
        fontSize: 20,
        width: "100%",
        textAlign: 'center',
        alignSelf: "flex-start"
    },
    progress: {
        transform: [{ translateY: "-50%" }],
    },
    completionText: {
        fontWeight: "700",
        textAlign: 'center',
        marginBottom: 10,
    },
    subTitleText: {
        fontSize: 14,
        textAlign: "center",
        color: "#000",
    },
    button: {
        fontWeight: "700",
        backgroundColor: "#963910"
    },
    normalText: {
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }]
    }
})

const otherStyles = StyleSheet.create({
    tranGreenBackground: {
        width: "100%",
        backgroundColor: "#6df291",
        borderColor: "black",
        borderWidth: 1,
        flexDirection: "row",
        borderRadius: 4,
        flex: 1.5,
        marginBottom: 7.5,

    },
    tranRedBackground: {
        width: "100%",
        backgroundColor: "#f27d6d",
        borderColor: "black",
        borderWidth: 1,
        flexDirection: "row",
        borderRadius: 4,
        flex: 1.5,
        marginBottom: 7.5,

    },
    imageStyle: {
        width: 30,
        height: 30,
        color:'#fff'
    },
    imageSmallStyle:{
        width: 10,
        height: 10
    },
    titleText:{
        alignSelf: "center",
        fontSize: 15,
        opacity: 0.5,
        fontWeight: "bold"
    },
    dateTimeText:{
        fontSize: 10,
        opacity: 0.5,
    },
    textView:{
        flexDirection: "column",
        display: "flex",
        alignItems: 'center',
        justifyContent: "center"
    },
    secondTextView:{
        flexDirection: "column",
        padding:2.5,
        marginLeft: "auto",
        alignSelf: "center",
    }


});

export default ProfileScreen;
