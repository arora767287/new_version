import React, { Component   } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Image, Pressable,  Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import RadioButtonRN from 'radio-buttons-react-native-expo';
import Checkbox from 'expo-checkbox';
import { customstyles } from "../customstyle";
import { commonPost, getRandomQuestion, getCategories, getQuestionListing, getQuestionsAnswered, getCategoryKeycode } from "../components/functions.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Background from './Background';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign'
import * as Progress from 'react-native-progress';
import fractionUnicode from 'fraction-unicode';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
const windowHeight  = Dimensions.get("window").height-80;
const currImage = require("../assets/Images/new_background.jpg")


class Question extends Component {

    state = {
        user_submission_id: '',
        DataisLoaded: false,
        Questions: [],
        Question_type: [],
        clicked: false,
        text_input: '',
        image_name: '',
        selected: '',
        radio_btn: '',
        number_text: '',
        api_resp: '',
        image_base64: '',
        selectedCheckboxes: [],
        questionOptions: [],
        image: '',
        numQuestions: 1, 
        numAnswered: 1,
        percentValue: 1,
        listCategories: [],
        dropdownData: [],
        value: '',
        isFocus: false,
        question_status: false,
        label: '',
        ques_id: ''
    }

    componentDidMount() {
        try{
            let userId = this.props.route.params.user_id;
            this.getIndQuestionInfo(userId);
            this.setState({ user_submission_id: userId });
            this.getRandomQuestion(userId);
        }
        catch(error){
          //  console.log("error+++++++++++++++++++");
           // console.log(error);
        }
        //this.getCategories(userId);
        //this.getAllQuestionCounts(userId);
      
    }

    getIndQuestionInfo = (user_id) => {
        try{
            let listQuestions = [];
            var categoryInfo = [];
            let resp = getQuestionListing(user_id)
              .then(resp => {
                  let result = resp.data;
                  listQuestions = result;
                  let categories = [];
                  let newResp = getCategoryKeycode()
                    .then(newResp => {
                      let result = newResp.data;
                      categories = result
                    //  console.log(categories);
                      let listGetAnswers = [];
                      let finalResp = getQuestionsAnswered(user_id)
                      .then(finalResp => {
                        let result = finalResp.data;
                        listGetAnswers = result
                        var listAnswered = [];
                        for(let i = 0; i < listGetAnswers.length; i++){
                          listAnswered.push(listGetAnswers[i].questionbank_id);
                        }
                      //  console.log("Questions Answered")
                       // console.log(listQuestions);
                        var categoryNames = [];
                        for(let i = 0; i<categories.length; i++){
                          if(!categoryNames.includes(categories[i].category_name)){
                            categoryNames.push(categories[i].category_name)
                            categoryInfo.push({"category_name" : categories[i].category_name, "category_id": categories[i].category_id, "countAnswered": 0, "countTotal": 0, "fraction": 1});
                          }
                        }
                        categoryInfo.push({"category_name": "Total", "category_id": 0, "countAnswered": 0, "countTotal": 0, "fraction": 1})
                        for(let i = 0; i<listQuestions.length; i++){
                          var currQuestion = listQuestions[i].id
                          var answered = listAnswered.includes(currQuestion);
                          var currKeycode = listQuestions[i].keycode_id;
                          //Search through categories to find which category question keycode belongs to
                          var categoryID;
                          for(let j = 0; j < categories.length; j++){
                            if(currKeycode == categories[j].keycode_id){
                              categoryID = categories[j].category_id;
                            }
                          }
                          //console.log("Category ID " + categoryID);
                          if(categoryID != null && answered){
                            categoryInfo[categoryID - 1].countAnswered += 1;
                            categoryInfo[categoryID - 1].countTotal += 1;
                          }
                          else if(categoryID != null && !answered){
                            categoryInfo[categoryID - 1].countTotal += 1;
                          }
                        }
                        for(let i = 0; i<categoryInfo.length; i++){
                          
                         categoryInfo[i].fraction = categoryInfo[i].countAnswered/categoryInfo[i].countTotal;
                          
                        }
                        for(let i = 0; i<categoryInfo.length - 1; i++){
                            categoryInfo[categoryInfo.length - 1].countAnswered += categoryInfo[i].countAnswered;
                            categoryInfo[categoryInfo.length - 1].countTotal += categoryInfo[i].countTotal;
                          //  console.log(categoryInfo[categoryInfo.length - 1].countTotal);
                        }
                       
                            categoryInfo[categoryInfo.length - 1].fraction = categoryInfo[categoryInfo.length - 1].countAnswered/categoryInfo[categoryInfo.length - 1].countTotal;
                              
                      
                       // console.log(categoryInfo);
                        result = categoryInfo;
                        var finalArray = []
                      
                        console.log("Result: ")
                       // console.log(categoryInfo);
                        for(let i = 0; i< result.length - 1; i++){
                            finalArray.push(result[i])
                        }
                        if((result[result.length - 1].countTotal!=0)&&(result[result.length - 1].countAnswered!=0)){
                            this.setState({
                                listCategories: finalArray,
                                numQuestions: result[result.length - 1].countTotal,
                                numAnswered: result[result.length - 1].countAnswered,
                                percentValue: result[result.length - 1].countAnswered/result[result.length - 1].countTotal
                            });
                        }else{
                            this.setState({
                                listCategories: finalArray,
                            }); 
                        }
                      
                        //console.log(listGetAnswers);
                      })
                    })
                  })
            //console.log("New Amount:" + listQuestions.data);
            //API in variable to hold unanswered questions
        
            //List of all question IDs
            
            //Question IDs of all not answered questions
        
        
            //All category names, ids and counts
          }
          catch(error){
            console.log(error)
          }

        //console.log(getQuestionInfo(user_id));
    }
    getanswer = (answer,id) => {
        console.log(this.state.selected)
        this.setState({
            selected: id,
            image_name: answer
        })

    }
    getCategories = (userId) => {
        let resp = getCategories(userId)
        .then(resp => {
            let result = resp.data;
            this.setState({
                listCategories: result
            })
           
            
        })
        .catch((error) => {
           // console.log(error);
        })
    }

    // Get Question Listing Api
    getRandomQuestion = (userId) => {
        this.setState({
            DataisLoaded: false
        })
        console.log("userId==="+userId)
        let data = {
            user_id: userId,
            api_url: 'getRandomQuestion'
        }
        let resp = commonPost(data)
            .then(resp => {
                console.log("resp+++++++++++++++++");
                console.log(resp);
                if( resp.status==0){
                    this.setState({
                        question_status: true,
                        DataisLoaded: true,
                    })  
                }else{
                let result = resp.data;
                let options = result[0].question_options;
                console.log(result);
                //console.log(options);
                this.setState({
                    Questions: result,
                    questionOptions: options,
                    DataisLoaded: true,
                    question_status: false,
                })
                this.renderAnsOptions(this.state.questionOptions)
            }
            })
            .catch((error) => {
                console.log("error"+error)
                this.setState({
                    DataisLoaded: true
                })
            })
    }
    // Close

    // Start Quiz
    startQuiz = () => {
        this.setState({
            clicked: true
        })
    }
    // Close

    // qus Skip Button
     qusSkip = (qus_id) => {
        console.log("ques_id"+qus_id)
        let ques_id = this.state.qus_id;
        let userId = this.state.user_submission_id;
        let is_interested = '0';

        let data = {
            user_id: userId,
            question_id: qus_id,
            is_interested: is_interested,
            api_url: 'getUserAnswer'
        }

        this.setState({
            DataisLoaded: false,
        })
        console.log(data)
        var resp = commonPost(data)
            .then(resp => {
                console.log(resp)
                let result = resp;
                let status = result.status;
                let message = result.message;
                if ((status === 1)) {
                    this.setState({
                        DataisLoaded: true,
                        number_text: '',
                        text_input: '',
                        radio_btn: '',
                        value: '',
                        selectedCheckboxes: [],
                        image_base64: '',
                    })
                    this.getRandomQuestion(userId);
                } else {
                    // Something Went Wrong
                }

            })
            .catch((error) => {
                console.log(error)
            })
    }
    // Close

    // Checkbox Handle
    onChange = id => {
        this.setState({
            is_val_checked: !this.state.is_val_checked,
        });
        const selectedCheckboxes = this.state.selectedCheckboxes;
        const findIdx = selectedCheckboxes.indexOf(id);
        if (findIdx > -1) {
            selectedCheckboxes.splice(findIdx, 1);
        } else {
            selectedCheckboxes.push(id);
        }
        this.setState({
            selectedCheckboxes: selectedCheckboxes
        });
    }

    renderLabel = () => {
        if (this.state.value || this.state.isFocus) {
          return (
            <Text style={{backgroundColor: "transparent", color: "white"}}>
                Options
            </Text>
          );
        }
        return null;
      };
    // Close

    // Submit Answers 
    submitAnswer = (qus_id) => {
        let ques_id = qus_id;
        let userId = this.state.user_submission_id;
        let is_interested = '1';

        let base_64 = this.state.image_base64;
        let final_ans = '';

        if ((base_64)) {
            //console.log('Image');
            final_ans = base_64;
        } else {
            if (this.state.text_input) {
                //console.log('Input');
                final_ans = this.state.text_input;
            } else if (this.state.number_text) {
                //console.log('Number');
                final_ans = this.state.number_text;
            } else if (this.state.radio_btn) {
                //console.log('Radio');
                final_ans = this.state.radio_btn; //Radio button option
            } 
            else if(this.state.label){
                final_ans = this.state.label;
            }
            else if(this.state.image_name){
                final_ans = this.state.image_name;
            }
            else if(this.state.selectedCheckboxes.toString()){
                //console.log('Checbox');
                final_ans = this.state.selectedCheckboxes.toString();
            }
            else{
                final_ans = '';
            }
        }
        this.setState({
            label: '',
            radio_btn: '',
            number_text: '',
            text_input: '',
            selectedCheckboxes: []
        })

        //console.log(final_ans);
        if(final_ans == ''){
            this.qusSkip(qus_id) ;
        }
        else if ((base_64)) {
            this.getDocument(ques_id, userId, is_interested, final_ans);
        } 
        else {
            this.getUserAnswer(ques_id, userId, is_interested, final_ans);
        }
    }
    //   Close

    // Image Picker
    pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });
            let imageUri = result ? `data:image/jpg;base64,${result.base64}` : null;
            this.setState({
                image_base64: imageUri
            });
        }

    };
    // Close

    // Submitting Asn
    getUserAnswer = (ques_id, userId, is_interested, final_ans) => {

        let data = {
            user_id: userId,
            question_id: ques_id,
            is_interested: is_interested,
            answer: final_ans,
            api_url: 'getUserAnswer'
        }
        console.log(data);
        this.setState({
            DataisLoaded: false,
        });

        var resp = commonPost(data)
            .then(resp => {
                let result = resp.data;
                let message = result.message;
                let status = result.status;
                console.log(result);

                if ((status != 1)) {
                    this.setState({
                        api_resp: message
                    });
                } else {
                    this.setState({
                        api_resp: '',
                    });
                }


                setTimeout(() => {
                    this.setState({
                        api_resp: '',
                        text_input: '',
                        number_text: '',
                        value: '',
                        selectedCheckboxes: [],
                        radio_btn: '',
                    });
                }, 3000);

                setTimeout(() => {
                    this.getRandomQuestion(userId);
                    this.setState({
                        DataisLoaded: true,
                    });
                }, 5000);

            })
            .catch((error) => {
                console.log(error)
            })

    }

    renderAnsOptions = (option_list) =>{
        const newData = []
        option_list.map((currOption, j) => {
            newData.push({label: currOption.option, value: j})
        })
        this.setState({
            dropdownData: newData
        })
        return newData;
    }

    getDocument = (ques_id, userId, is_interested, final_ans) => {
        let data = {
            user_id: userId,
            question_id: ques_id,
            is_interested: is_interested,
            document: final_ans,
            api_url: 'getUserAnswer'
        }
        console.log(data);

        var resp = commonPost(data)
            .then(resp => {
                let result = resp;
                console.log(result);
                let status = result.status;
                let message = result.message;

                if ((status != 1)) {
                    this.setState({
                        api_resp: message
                    });
                } else {
                    this.setState({
                        api_resp: ''
                    });
                }

                setTimeout(() => {
                    this.setState({
                        api_resp: '',
                        text_input: '',
                        number_text: '',
                        radio_btn: '',
                        value: '',
                        selectedCheckboxes: [],
                        image_base64: '',
                    });
                }, 3000);

                setTimeout(() => {
                    this.getRandomQuestion(userId);
                    this.setState({
                        DataisLoaded: true,
                    });
                }, 5000);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    setFocus = (amount) =>{
        this.setState({isFocus: amount})
    }
    renderDropdown = () => {
        
        return(
            <View style={styles.container}>
                <Dropdown
                style={[styles.dropdown, {borderColor: 'white', borderWidth: 2 }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={{...styles.inputSearchStyle}}
                iconStyle={styles.iconStyle}
                data={this.state.dropdownData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder='Select option'
                searchPlaceholder="Search..."
                value={this.state.value}
                onFocus={() => this.setFocus(true)}
                onBlur={() => this.setFocus(false)}
                onChange={(item) => {
                    console.log(item)
                    this.setState({
                        value: item.value,
                        label: item.label,
                        isFocus: false
                    })
                }}
                renderLeftIcon={() => (
                    <AntDesign
                    style={styles.icon}
                    color={this.state.isFocus ? 'white' : 'white'}
                    name="Safety"
                    size={20}
                    />
                )}
                />
            </View>
        )
    }
    /*
    renderLabel = () => {
        if (value || isFocus) {
          return (
            <Text style={[styles.label, isFocus && { color: 'blue' }]}>
              Options
            </Text>
          );
        }
        return null;
      };
    */
    // Close

    render() {

        const { DataisLoaded, items} = this.state;
        if (!DataisLoaded) {
            return <Loader />;
        }

        if (!this.state.clicked) {

            return (
                <SafeAreaView style={styles.scrollArea}>
                    <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                        <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, marginLeft: 15}}>Question Store</Text>
                    </View>
                    <ScrollView style={{...styles.innerView, borderRadius: 10}}>
                        <View style={{...styles.container, justifyContent: "space-around",height:600}}>

                            <View style={{ ...customstyles.filterContainer, marginBottom: 20, padding: 15, ...customstyles.mt30, backgroundColor: "#662397", opacity: 0.75, borderRadius:20, borderColor: "transparent"}}>
                                <Text style={{ ...customstyles.textCenter, fontSize: 15, color: "white", fontFamily: "Thonburi"}}>Answer questions about your identity to make more data available for offers in the marketplace!</Text>
                             {
                                this.state.question_status?
                             
                                <TouchableOpacity 
                                    style={{ ...customstyles.px30, ...customstyles.my20 }}>
                                    <Text style={{...customstyles.btnThemexs, color: "white", borderColor: "white"}}>Completed</Text>
                                </TouchableOpacity>
                                :<TouchableOpacity onPress={this.startQuiz}
                                    style={{ ...customstyles.px30, ...customstyles.my20 }}>
                                    <Text style={{...customstyles.btnThemexs, color: "white", borderColor: "white"}}>START</Text>
                                </TouchableOpacity>
        }
                            </View>

                            <View style={{...customstyles.filterContainer, display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                                    <View style={{ backgroundColor: "transparent", padding: 5, borderRadius:20, borderColor: "transparent", width: "48%", justifyContent: "space-around"}}>
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                                            <View style={{padding: 5, flexDirection: "column", justifyContent: "center", alignSelf: "center", backgroundColor: "#cbb8d9", borderColor: "#662397", borderRadius:10, borderWidth: 5, alignItems: "center", width: 100, height: 100}}>
                                                <Text style={{fontSize: 35, justifyContent: "center", alignSelf: "center", fontWeight: "bold", alignSelf: "center", color: "#662397"}}>{fractionUnicode(this.state.numAnswered,this.state.numQuestions)}</Text>
                                                {/*<Text style={{fontSize: 10, justifyContent: "center", alignSelf: "center", flex: 0.25, textAlign: "center"}}>of</Text>
                                                <Text style={{fontSize: 15, justifyContent: "center", alignSelf: "center", flex: 0.375, fontWeight: "bold"}}>50</Text>*/}
                                            </View>
                                        </View>
                                        <Text style={{ ...customstyles.textCenter, fontSize: 20, fontFamily: "Thonburi", color: "#662397"}}> QUESTIONS ANSWERED </Text>
                                    </View>
                                    
                                    <View style={{ backgroundColor: "transparent", padding: 15, backgroundColor: "transparent", opacity: 0.75, borderRadius:20, borderColor: "transparent", width: "48%"}}>
                                        <View style={{flexDirection: 'column', justifyContent: "center", alignSelf: 'center', alignItems: "center"}}>
                                            <Progress.Circle size={120} indeterminateAnimationDuration={2000} animated={true} style={[customstyles.progressChart]} progress={this.state.percentValue} thickness={20} unfilledColor= "#cbb8d9" fill= "white" color="#662397" borderWidth={1}>
                                                <Text style={{display: "flex", alignSelf: "center", justifyContent:"center", fontWeight: "normal", color: "#662397", fontSize: 20}}>{Math.round(this.state.percentValue*100)}%</Text>
                                            </Progress.Circle>                                          
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    {
                                        this.state.listCategories.length > 0 &&
                                        this.state.listCategories.map((item, index) => (
                                            <View style={{display: "flex", flexDirection: "row",}}>
                                                <View style={{alignSelf: "center", justifyContent: "flex-start", marginLeft: 5, marginRight: 15}}>
                                                    <View style={{color: "#662397", opacity: (index+1)/7, borderColor: "#662397", borderWidth: 2, width: 10, height: 10}}> 
                                                    </View>
                                                </View>
                                                <View style={{alignSelf: "center"}}>
                                                    <Text style={{fontFamily: "Thonburi", fontSize: 15, fontWeight: "normal", color: "#662397"}}>{item.category_name}</Text>
                                                </View>
                                                <View style={{display: "flex", flexDirection: "row", marginLeft: "auto", marginRight: 15, justifyContent: "center", alignSelf: "space-around"}}>
                                                    <Progress.Bar progress={item.fraction} width={100} animationType= "spring" color="#662397" unfilledColor="#cbb8d9" borderColor="white" borderWidth={1.5} alignSelf="center"/>
                                                    <Text style={{...customstyles.titleText, color: "#663297", fontWeight: 'normal', marginLeft: 15, alignSelf: "flex-end", fontSize: 20}}>{Math.round(item.fraction*100)}%</Text>
                                                </View>
                                            </View>

                                        ))
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView >);
        }

        return (
            <SafeAreaView style={styles.scrollArea}>
                <View style={{ ...customstyles.header, ...customstyles.px15 }}>
                    <Text style={{...customstyles.titleText, fontSize: 35, color: "#663297", fontWeight: 'bold', flex: 1, marginLeft: 15}}>Question Store</Text>
                </View>
                <ScrollView style={{...styles.innerView}}>
                    <View style={{...styles.container, justifyContent: "center", alignSelf: "center", width: "100%"}}>
                        <View style={{ ...customstyles.filterContainer, marginBottom: 20, padding: 15, ...customstyles.mt30, backgroundColor: "#662397", opacity: 0.75, borderRadius:20, borderColor: "transparent"}}>
                            {
                                this.state.Questions ?

                                    this.state.Questions.map((item, i) => (
                                        <View key={i} >

                                            <View >
                                                <Text style={{ ...customstyles.h3, ...customstyles.textwhite, fontFamily: "Thonburi"}}>Question</Text>
                                            </View>

                                            <View>
                                                <Text style={{ ...customstyles.h5, ...customstyles.my10, color: "white", fontFamily: "Thonburi", fontWeight: "normal"}}>{item.question}</Text>
                                            </View>

                                            {
                                                item.question_mode == '1' &&
                                                <View>
                                                    <TextInput
                                                        placeholder={'Answer'}
                                                        onChangeText={(text_input) => this.setState({ text_input })}
                                                        style={{ ...customstyles.inputtheme, color: "white" }}
                                                    />
                                                </View>
                                            }

                                            {
                                                item.question_mode == '2' &&

                                                <View>
                                                    {
                                                        this.renderDropdown()
                                                        /*
                                                        this.state.questionOptions.map((radioItem, j) => (

                                                            <View key={j}>

                                                                <TouchableOpacity style={{ ...customstyles.radiolist }}
                                                                    onPress={() => {
                                                                        this.setState({
                                                                            radio_btn: radioItem.id,
                                                                        });
                                                                    }}>
                                                                    <View style={customstyles.radiolistCircle} />
                                                                    {radioItem.id === this.state.radio_btn && <View style={customstyles.radiolistCircleselected} />}
                                                                    <Text style={customstyles.radiolistText}>{radioItem.option}</Text>
                                                                </TouchableOpacity>

                                                            </View>
                                                        ))
                                                        */
                                                    }

                                                </View>


                                            }

                                            {
                                                item.question_mode == '3' &&
                                        <View style={{height:150, overflow: "hidden", flex: 1}}>
                                                      <ScrollView contentContainerStyle={{ flexGrow: 1 }}> 
                                                    {
                                                        this.state.questionOptions.map((checkBoxItem, k) => (
                                                            
                                                           
                                                            <View style={{ ...customstyles.checkboxlist, }} key={k}>
                                                                <Checkbox
                                                                    value={!!this.state.selectedCheckboxes.includes(checkBoxItem.id)}
                                                                    onValueChange={() => this.onChange(checkBoxItem.id)}
                                                                    selected={this.state.selectedCheckboxes.includes(checkBoxItem.id)}
                                                                    color={!!this.state.selectedCheckboxes.includes(checkBoxItem.id) ? 'transparent' : undefined}
                                                                    style={{ ...customstyles.mr10, ...customstyles.checkboxhidden }}
                                                                />
                                                                <Text style={{ ...customstyles.checkboxarea }}>
                                                                    {
                                                                        this.state.selectedCheckboxes.includes(checkBoxItem.id) ? <View style={customstyles.checkboxlistsquareselected} ><Ionicons name="checkbox-outline" size={28} color="#663792" /></View> : <View style={customstyles.checkboxlistsquare} ><Ionicons name="square-outline" size={28} color="#663792" /></View>
                                                                    }
                                                                </Text>
                                                                <Text style={{ ...customstyles.checkboxlistText }}>{checkBoxItem.option}</Text>
                                                            </View>
                                                            
                                                        ))
                                                    }
                                                  </ScrollView>     
                                                </View>
                                            }

                                            {
                                                item.question_mode == '4' &&

                                                <View>
                                                    <TouchableOpacity onPress={this.pickImage} style={{ ...customstyles.py15, ...customstyles.bgtheme, ...customstyles.rowverticalcenter, ...customstyles.textCenter, ...customstyles.radius10 }}>

                                                        <Ionicons name="cloud-upload-outline" size={36} color="#fff"></Ionicons>
                                                        <Text style={{ ...customstyles.h5, ...customstyles.textwhite, ...customstyles.ml10 }}>Upload File</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }

                                            {
                                                item.question_mode == '5' &&
                                                <View>
                                                    <TextInput
                                                        placeholder={'Numeric Value'}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(number_text) => this.setState({ number_text })}
                                                        style={{ ...customstyles.inputtheme, color: "white"}}
                                                    />
                                                </View>

                                            }

                                            {
                                                item.question_mode == '6' &&
                                                <View>
                                                    <TextInput
                                                        placeholder={'Answer'}
                                                        onChangeText={(text_input) => this.setState({ text_input })}
                                                        style={{ ...customstyles.inputtheme }}
                                                    />
                                                </View>

                                            }
                                            {
                                                item.question_mode == '7' &&
                                                <View style={{height:150, overflow: "hidden", flex: 1,borderStyle: 'solid', borderWidth: 2, borderColor:"#fff"}}>
                                                <ScrollView contentContainerStyle={{ flexGrow: 1 }}> 
                                              {
                                                  this.state.questionOptions.map((checkBoxItem, k) => (
                                                  
                                                      <View  key={k}>
                                                           <TouchableOpacity onPress={() => this.getanswer(checkBoxItem.option,checkBoxItem.id)}  style={{marginBottom:10}}>
                                                          
                                                <Image source={{uri: checkBoxItem.path}} style={(this.state.selected == checkBoxItem.id) ? styles.boxSelected : styles.boxStyle}></Image>
                                                         </TouchableOpacity>
                                                      </View>
                                                      
                                                  ))
                                              }
                                            </ScrollView>     
                                          </View>

                                            }

                                            {/* Skip & Submit button */}
                                            <View style={customstyles.mt10}>
                                                <TouchableOpacity onPress={() => this.qusSkip(item.id)} style={customstyles.px30}>
                                                    <Text style={customstyles.btnRedsmall}>SKIP</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => this.submitAnswer(item.id)} style={customstyles.px30}>
                                                    <Text style={customstyles.btnThemesmall}>SUBMIT</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {/* Close */}
                                        </View>
                                    ))
                                    : 'No Data'
                            }
                        </View>
                        <View style={customstyles.mb10}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack(), this.setState({
                                        clicked: false
                                    })
                                }} style={customstyles.my15}>
                                <Text style={customstyles.btnRed}>EXIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >
        );
    }
}


const styles = StyleSheet.create({

    scrollArea: {
        flex: 1,
        width: "100%",
        backgroundColor: "white"
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 15,
    },
    container: {
        flex: 1,
        //alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#ecf0f1',
        marginBottom: 30,
    },
    boxStyle:{
        height:150,width:150,borderStyle: 'solid', borderWidth: 2, borderColor:"#663792"
    },
    boxSelected:{
        height:150,width:150,borderStyle: 'solid', borderWidth: 2, borderColor:"red"
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        shadowColor: 'red',
        shadowOffset: { width: 10, height: 2 },
        shadowOpacity: .5,
        shadowRadius: 7,
        borderColor: "#eee",
        borderWidth: 2,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
    },
    button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 10,
        marginBottom: 20,
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: "#663792",
        fontWeight: "bold",
        fontSize: 20
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
        color: "white",
        fontFamily: "Thonburi"
      },
      selectedTextStyle: {
        fontSize: 16,
        color: "white",
        fontFamily: "Thonburi"
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },

});
export default Question;