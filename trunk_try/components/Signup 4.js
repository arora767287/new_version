import React, { Component } from 'react';
import { Image, TouchableHighlight, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import FaceSDK, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, MatchFacesImage, MatchFacesSimilarityThresholdSplit } from '@regulaforensics/react-native-face-api'
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import { customstyles } from "../customstyle";
import Checkbox from 'expo-checkbox';
import Loader from './Loader';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { LoginAPI, commonGet,commonGetwihoutktoken } from './functions';
const url = 'https://docs.google.com/document/d/1RzYLxbaHc8A4wn0fJtMEzZHoMpT0-jdKLEyWxOKB3MM/edit';
class Signup extends Component {
    constructor(props) {
        super(props);
    }

    state = {

        title: '',
        fname: '',
        lname: '',
        reg_email: '',
        paypal_reg_email: '',
        coupon: '',
        country_code: '',
        phone: '',
        gender: '',
        nationality_code: '',
        currentlocation: '',
        password: '',
        conf_pass: '',
        id_type: '',
        id_number: '',
        imgstatus: '',
        img: '',
        img1: require('../assets/Images/portrait.png'),
        fname_err: '',
        lname_err: '',
        email_err: '',
        gender_err: '',
        phone_err: '',
        currentlocation_err: '',
        terms_err: '',
        password_err: '',
        conf_pass_err: '',
        img_err: '',
        terms:false,
        termscon:false,
        termsconval:1,
        userTitles: [],
        userIdTypes: [],
        userMobileCountries: [],
        userNationality: [],
        userCurrentlocation: [],
        userGenders: [],
        api_resp: '',
        api_resp_error: '',
    }

    componentDidMount() {
        this.getUserTitle();
        this.getIdTypes();
        this.getMobileCountry();
        this.getNationalities();
        this.getGenders();
        this.getCurrentlocationlist();
    }

    // Dropdown List
    getUserTitle = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'titles',
        }
       // console.log(data);
        var resp = commonGetwihoutktoken(data)
            .then(resp => {
                let result = resp.titles;
                this.setState({
                    userTitles: result
                })
                console.log("resp_______________");
                console.log(resp);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getIdTypes = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'id_types',
        }
        console.log(data);
        var resp = commonGetwihoutktoken(data)
            .then(resp => {
                let respobj = resp.id_types;
                let result = respobj.primary;
                console.log(resp.id_types);
                console.log(result);
                this.setState({
                    userIdTypes: result
                })
               
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getMobileCountry = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'mobile_country_codes',
        }
       // console.log(data);
        var resp = commonGetwihoutktoken(data)
            .then(resp => {
                let result = resp.mobile_country_codes;
                this.setState({
                    userMobileCountries: result
                })
               // console.log(resp);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getGenders = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'genders',
        }
        var resp = commonGetwihoutktoken(data)
            .then(resp => {
                let result = resp.genders;
                console.log(resp);
                this.setState({
                    userGenders: result
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getNationalities = () => {
        let data = {
            api_url: 'getEnumerationsData',
            type: 'nationalities',
        }
        var resp = commonGetwihoutktoken(data)
            .then(resp => {
               // console.log(resp)
                let result = resp.nationalities;
                this.setState({
                    userNationality: result
                })
                //console.log(result);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getCurrentlocationlist = () => {
        let data = {
            api_url: 'currentLocation',
        }
        var resp = commonGet(data)
            .then(resp => {
                console.log("resp||||||+++++++++++++++")
                console.log(resp)
                let result = resp.data;
                this.setState({
                    userCurrentlocation: result
                })
                //console.log(result);
            })
            .catch((error) => {
                console.log("error+++++++++++")
                console.log(error)
            })
    }
    // Close



    // Dropdoewn handling
    setTitle(value) {
        this.setState({
            title: value
        })
    }
    SetTerms(value) {
       if(value){
        this.setState({
            terms: value,
            termsconval:2
        })
    }
    }

    setIdType(value) {
        this.setState({
            id_type: value
        })
    }

    setMobileCountry(value) {
        this.setState({
            country_code: value
        })
    }

    setNationality(value) {
        this.setState({
            nationality_code: value
        })
       
    }
    setCurrentlocation(value) {
        this.setState({
            currentlocation: value
        })
       
    }
    setGender = (value) => {
        //console.log(value);
        this.setState({
            gender: value
        });
    }

   
    pickImage() {
       FaceSDK.presentFaceCaptureActivity(result => {
      this.setState({ img: "data:image/png;base64," + FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap  })
        this.setState({ img1: { uri: "data:image/png;base64," + FaceCaptureResponse.fromJson(JSON.parse(result)).image.bitmap }, imgstatus: 1 })
          }, e => { })
       
      }

    validateInput() {
        const { fname, lname, reg_email, phone, password, conf_pass,imgstatus,terms,gender,currentlocation } = this.state;
        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        //Alert.alert('Credentials', `${username} + ${password}`);
     
        if ((fname == '')) {
            this.setState({
                fname_err: 'First name is required'
            })
            return;
        } else {
            this.setState({
                fname_err: ''
            })
        }

        if ((lname == '')) {
            this.setState({
                lname_err: 'Last name is required'
            })
            return;
        } else {
            this.setState({
                lname_err: ''
            })
        }

        if ((reg_email == '')) {
            this.setState({
                email_err: 'Email is required'
            })
            return;
        } else {
            this.setState({
                email_err: ''
            })
        }
        if ((gender == '')) {
            this.setState({
                gender_err: 'Gender is required'
            })
            return;
        } else {
            this.setState({
                gender_err: ''
            })
        }

        if (pattern.test(reg_email) === false) {
            this.setState({
                email_err: 'Email is not valid'
            })
            return;
        } else {
            this.setState({
                email_err: ''
            })
        }

        if ((phone == '')) {
            this.setState({
                phone_err: 'Phone no is required'
            })
            return;
        } else {
            this.setState({
                phone_err: ''
            })
        }
        if ((currentlocation == '')) {
            this.setState({
                currentlocation_err: 'Current Location is required'
            })
            return;
        } else {
            this.setState({
                currentlocation_err: ''
            })
        }
        if ((!terms)) {
            this.setState({
                terms_err: 'Terms and conditions is required'
            })
            return;
        } else {
            this.setState({
                terms_err: ''
            })
        }

        if ((password == '')) {
            this.setState({
                password_err: 'Password is required'
            })
            return;
        } else {
            this.setState({
                password_err: ''
            })
        }

        if ((conf_pass == '')) {
            this.setState({
                conf_pass_err: 'Confirm Password is required'
            })
            return;
        } else {
            this.setState({
                conf_pass_err: ''
            })
        }
        if ((imgstatus == '')) {
            this.setState({
                img_err: 'Image required for face detection'
            })
            return;
        } else {
            this.setState({
                img_err: ''
            })
        }

        if ((password != conf_pass)) {
            this.setState({
                password_err: 'Confirm Password & Password does not match'
            })
            return;
        }
        else {
            this.setState({
                password_err: ''
            })
        }
    
       
        if ((fname != '') && (lname != '') && (reg_email != '') && (phone != '') && (password != '') && (conf_pass != '')&& (currentlocation != '') && (terms)) {
            this.register();
        }
    }
   
    register = async () => {
        
        
        console.log(this.state.termsconval);
        let data = {
            title: this.state.title,
            fname: this.state.fname,
            lname: this.state.lname,
            gender: this.state.gender,
            email: this.state.reg_email,
            paypal_email: this.state.paypal_reg_email,
            country_code: this.state.country_code,
            phone: this.state.phone,
            nationality_code: this.state.nationality_code,
            currentlocation: this.state.currentlocation,
            password: this.state.password,
            coupon: this.state.coupon,
            //id_type: this.state.id_type,
            //id_number: this.state.id_number,
            faceimage: this.state.img,
            termsandconditions: this.state.termsconval,
            platform: Platform.OS,
            api_url: 'registration'
        }

        console.log(data);
        console.log(data);
        this.setState({
            isLoading: true,
        })
        var response = LoginAPI(data)
            .then(res => {
                console.log("res");
                console.log(res);
                let message = res.message;
                let description = res.description;
                let status = res.status;
                let mm_code = res.code;

                if ((status == 2)) {
                    this.setState({
                        api_resp_error: message,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp_error: '',
                        });
                    }, 5000);
                } else if ((status == 0)) {
                    this.setState({
                        api_resp_error: message,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp_error: '',
                        });
                    }, 5000);
                } else if ((mm_code == 400) || (mm_code == 401) || (mm_code == 403) || (mm_code == 500)) {
                    this.setState({
                        api_resp_error: description,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp_error: '',
                        });
                    }, 5000);
                }
                else {
                    //Alert.alert(message);
                    this.setState({
                        api_resp: message,
                        isLoading: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            api_resp: '',
                        })
                    }, 5000);
                    setTimeout(() => {
                        this.props.navigation.navigate('HomeScreen');
                    }, 7000);
                }
            }) .catch((error) => {
                console.log("error")
                console.log(error)
            })


    }
    render() {
        if (this.state.termscon) return <WebView source={{ uri: url }} />
        return (
            <LinearGradient colors={['#663792', '#3d418b', '#0a4487']} start={{ x: 0, y: .8 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                <SafeAreaView style={styles.scrollArea}>
                    <ScrollView style={styles.innerView}>
                        <View style={styles.logincontainer}>
                            <View style={{ paddingVertical: 20 }}>
                                <Text style={customstyles.headingWhite}>Signup</Text>
                            </View>

                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[customstyles.btnWhitecircle, { width: 36, height: 36, marginBottom: 30 }]}>
                                <Ionicons name="md-chevron-back-outline" size={24} color="#663792" />
                            </TouchableOpacity>
                           

                         
                            <View style={customstyles.dropdownBox}>
                                <Picker
                                    selectedValue={this.state.title}
                                    onValueChange={(value, index) => this.setTitle(value)}
                                    mode="dropdown" // Android only
                                    style={customstyles.dropdown} dropdownIconColor='#fff'
                                >
                                    <Picker.Item label="Select Title" value="" color='black' />
                                    {
                                        this.state.userTitles ?
                                            this.state.userTitles.map((item, i) => (
                                                <Picker.Item key={i} label={item.code} value={item.code} color='black' />
                                            ))
                                            : <Picker.Item label='No Data' value='0' color='black' />
                                    }
                                </Picker>
                            </View>
                            <View>
                                <TextInput
                                    value={this.state.fname}
                                    onChangeText={(fname) => this.setState({ fname })}
                                    placeholder={'Enter First Name *'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.fname_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.fname_err}</Text>
                                }
                            </View>

                            <View>
                                <TextInput
                                    value={this.state.lname}
                                    onChangeText={(lname) => this.setState({ lname })}
                                    placeholder={'Enter Last Name *'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.lname_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.lname_err}</Text>
                                }
                            </View>

                            <View>
                                <TextInput
                                    value={this.state.reg_email}
                                    onChangeText={(reg_email) => this.setState({ reg_email })}
                                    placeholder={'Enter Email *'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                               
                             
                            </View>
                            <View style={customstyles.dropdownBox}>
                            <Picker
                                selectedValue={this.state.gender}
                                onValueChange={(value, index) => this.setGender(value)}
                                mode="dropdown" // Android only
                                style={customstyles.dropdown} dropdownIconColor='#fff'
                            >
                                <Picker.Item label="Select Gender *" value="" color='black' />
                                {
                                    this.state.userGenders ?
                                        this.state.userGenders.map((item, i) => (
                                            <Picker.Item key={i} label={item.description} value={item.code} color='black' />
                                        ))
                                        : <Picker.Item label='No Data' value='0' />
                                }
                            </Picker>
                            
                        </View>
                        <View>{
                                    this.state.gender_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.gender_err}</Text>
                                }</View>
                            <View style={customstyles.dropdownBox}>
                                <Picker
                                    selectedValue={this.state.country_code}
                                    onValueChange={(value, index) => this.setMobileCountry(value)}
                                    mode="dropdown" // Android only
                                    style={customstyles.dropdown} dropdownIconColor='#fff'
                                >
                                    <Picker.Item label="Select ISD Code" value="" color='black' />
                                    {
                                        this.state.userMobileCountries ?
                                            this.state.userMobileCountries.map((item, i) => (
                                                <Picker.Item key={i} label={ item.description} value={item.description} color="black" />
                                            ))
                                            : <Picker.Item label='No Data' value='0' />
                                    }
                                </Picker>
                            </View>

                            <View>
                                <TextInput
                                    value={this.state.phone}
                                    keyboardType={'numeric'}
                                    onChangeText={(phone) => this.setState({ phone })}
                                    placeholder={'Enter Phone No *'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.phone_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.phone_err}</Text>
                                }
                               
                               
                            </View>

                            <View style={customstyles.dropdownBox}>
                                <Picker
                                    selectedValue={this.state.nationality_code}
                                    onValueChange={(value, index) => this.setNationality(value)}
                                    mode="dropdown" // Android only
                                    style={customstyles.dropdown} dropdownIconColor='#fff'
                                >
                                    <Picker.Item label="Select Nationality" value="" color='black' />
                                    {
                                        this.state.userNationality ?
                                            this.state.userNationality.map((item, i) => (
                                                <Picker.Item key={i} label={item.code} value={item.code} color="black" />
                                            ))
                                            : <Picker.Item label='No Data' value='0' />
                                    }
                                </Picker>
                            </View>

                            <View style={customstyles.dropdownBox}>
                                <Picker
                                    selectedValue={this.state.currentlocation}
                                    onValueChange={(value, index) => this.setCurrentlocation(value)}
                                    mode="dropdown" // Android only
                                    style={customstyles.dropdown} dropdownIconColor='#fff'
                                >
                                    <Picker.Item label="Select Current Location *" value="" color='black' />
                                    {
                                        this.state.userCurrentlocation ?
                                            this.state.userCurrentlocation.map((item, i) => (
                                                <Picker.Item key={i} label={item.country_name} value={item.country_code} color="black" />
                                            ))
                                            : <Picker.Item label='No Data' value='0' />
                                    }
                                </Picker>
                            </View>
                            {
                                    this.state.currentlocation_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.currentlocation_err}</Text>
                                }
                            {
                                    this.state.currentlocation == 1 &&
                            <View>
                                <TextInput
                                    value={this.state.paypal_reg_email}
                                    onChangeText={(paypal_reg_email) => this.setState({ paypal_reg_email })}
                                    placeholder={'Enter PayPal Email '}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                               
                             
                            </View>
                            }
                            <View>
                                <TextInput
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    onChangeText={(password) => this.setState({ password })}
                                    placeholder={'Enter Password *'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.password_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.password_err}</Text>
                                }
                            </View>

                            <View>
                                <TextInput
                                    value={this.state.conf_pass}
                                    secureTextEntry={true}
                                    onChangeText={(conf_pass) => this.setState({ conf_pass })}
                                    placeholder={'Enter Confirm Password *'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.conf_pass_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.conf_pass_err}</Text>
                                }
                               
                            </View>
                            <View>
                                <TextInput
                                    value={this.state.coupon}
                                    onChangeText={(coupon) => this.setState({ coupon })}
                                    placeholder={'Enter Coupon Code'}
                                    style={customstyles.input}
                                    placeholderTextColor="#aaa"
                                />
                                {
                                    this.state.phone_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.phone_err}</Text>
                                }
                               
                               
                            </View>
                            {/* <View style={customstyles.dropdownBox}>
                                <Picker
                                    selectedValue={this.state.id_type}
                                    onValueChange={(value, index) => this.setIdType(value)}
                                    mode="dropdown" // Android only
                                    style={customstyles.dropdown} dropdownIconColor='#fff'
                                >
                                    <Picker.Item label='Select ID Types' value='' color='black' />
                                    {
                                        this.state.userIdTypes ?
                                            this.state.userIdTypes.map((item, i) => (
                                                <Picker.Item key={i} label={item.description['display_name']} value={item.code} color="black" />
                                            ))
                                            : <Picker.Item label='No Data' value='0' />
                                    }
                                </Picker>
                            </View> */}

                            {/* <TextInput
                                value={this.state.id_number}
                                onChangeText={(id_number) => this.setState({ id_number })}
                                placeholder={'Enter ID Number'}
                                style={customstyles.input}
                                placeholderTextColor="#aaa"
                            /> */}
                            {/* <Text style={this.state.conf_pass_err ? customstyles.alertdanger : ''}>{this.state.conf_pass_err}</Text> */}

                           <View style={{ flexDirection: "column", alignItems: "center" }}>
              <TouchableHighlight onPress={() => this.pickImage()}>
                <Image
                  style={{
                    height: 150,
                    width: 150,
                  }}
                  source={this.state.img1}
                  resizeMode="contain" />
              </TouchableHighlight>
              <Text style={{fontSize:12,color:"#fff",paddingBottom:5}}>Face Detection *</Text>
              {
                                    this.state.img_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.img_err}</Text>
                                }
            </View> 
            {
                                this.state.api_resp.length > 0 &&
                                <Text style={customstyles.alertPrimary}>{this.state.api_resp}</Text>
                            }
                              <View style={{...customstyles.mb15,paddingLeft:30}}>
                              <Checkbox
                            value={this.state.terms}
                            onValueChange={(checked) => this.SetTerms(checked)}
                            color={this.state.terms ? 'transparent' : undefined}
                            checked={this.state.terms ? true : false}
                            style={{ ...customstyles.mr5, ...customstyles.signupcheckbox }}
                        />
                                <Text>
                                    <TouchableOpacity  onPress={() => this.setState({ termscon: true})}>
                                        <Text style={{ ...customstyles.labelwhite, ...customstyles.underline }}>I agree Terms & Conditions *</Text>
                                    </TouchableOpacity>
                                </Text>
                            </View>
                            {
                              this.state.terms_err.length > 0 &&
                                    <Text style={customstyles.alertdanger}>{this.state.terms_err}</Text>
                                }
                                 {
                                this.state.api_resp_error.length > 0 &&
                                <Text style={customstyles.alertdanger}>{this.state.api_resp_error}</Text>
                            }
                            <TouchableOpacity onPress={this.validateInput.bind(this)}>
                                <View
                                    style={{
                                        ...styles.button, ...customstyles.shadowBlock,
                                        backgroundColor: this.state.isLoading ? "#fff" : "#FFF",
                                    }}
                                >
                                    <Text style={styles.buttonText}>
                                        {this.state.isLoading ? "SENDING..." : "SUBMIT"}
                                    </Text>
                                    {this.state.isLoading && <Loader />}
                                </View>
                            </TouchableOpacity>

                            <View style={{ ...customstyles.rowverticalcenter, ...customstyles.mb25 }}>
                                <Text style={customstyles.labelwhite}>Already have an account  </Text>
                                <Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                        <Text style={{ ...customstyles.labelwhite, ...customstyles.underline }}>Login Here</Text>
                                    </TouchableOpacity>
                                </Text>
                            </View>

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        width: "100%",
    },
    scrollArea: {
        flex: 1,
        width: "100%",
        paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 20,

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
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 10,
        marginBottom: 20,
        borderRadius: 30,
    },
    buttonText: {
        color: "#663792",
        fontWeight: "bold",
        fontSize: 20
    },
    picker: {
        marginVertical: 30,
        width: 300,
        padding: 10,
        borderWidth: 1,
        borderColor: "#fff",
        color: '#fff'
    },

});

export default Signup;