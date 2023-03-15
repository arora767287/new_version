import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Dimensions, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';
import { customstyles } from "../customstyle";
import * as ImagePicker from 'expo-image-picker';
import { commonPost, getImages, getOneImage, getRecList, commonFilePost, uploaddoc, commonPostText} from "../components/functions.js";
import Carousel , {Pagination} from "react-native-snap-carousel";
import Background from './Background';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LongPressGestureHandler } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import * as FileSystem from 'expo-file-system';
import * as Linking from "expo-linking";
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";
import DocumentScanner from 'react-native-document-scanner-plugin'
import { SYSTEM_BRIGHTNESS } from 'expo-permissions';
import { ListObjectsRequest } from '@aws-sdk/client-s3';


const SLIDER_WIDTH = Dimensions.get('window').width - 40;
const SLIDER_HEIGHT = Math.round(SLIDER_WIDTH * 3 / 4) - 50;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT) - 100;
const IMG_WIDTH = Math.round(ITEM_WIDTH);
const IMG_HEIGHT = Math.round(ITEM_HEIGHT);
function ShowDocs({ user_id, folder_id, folder_name, navigation, route, active, parentCall }){
    const [activeIndex, setActiveIndex] = useState(0);
    const [change, setChange] = useState(false);
    const [allDocs, setListAllDocs] = useState([]);
    const [thisURI, setThisURI] = useState("");
    const [scannedImage, setScannedImage] = useState();
    let scanner = useRef(null);
    const ref = React.useRef(null);
    const renderItem = React.useCallback(({ item, index }) => (
        index == activeIndex + 1 || index == activeIndex || index == activeIndex - 1 ?
            <TouchableOpacity key={index} style={{...customstyles.checkboxlist, ...customstyles.mb5}} onPress={() => getfile(item.path)}>
                <Text style={{...customstyles.mr10,}}>{item.document_title}</Text>
                <View key={item.id} style={{...customstyles.upright,...customstyles.mr5, ...{marginTop: 8,}}}>
                    <TouchableOpacity style={{ ...customstyles.uprightDelete }} onPress={() => deleteUserFile(item.id, userId, folder_id)} >
                        <Ionicons name="close-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity> :
            <View>
            </View>
      ), []);

    const [userId, setUserId] = React.useState('');
    const [folderId, setFolderId] = React.useState('');
    const [folderName, setFolderName] = React.useState('');
    const [image_base64, setImageBase] = React.useState([]);
    const [base64image, setbase64image] = React.useState('');
    const [documents, setDocuments] = React.useState('');
    const [DataisLoaded, setDataisLoaded] = useState(false);
    const [docTitle, setDocTitle] = useState('');
    const [fieldErr, setFieldErr] = useState('');
    const [successResp, setResponse] = useState('');
    const [docCategory, setDocCategory] = useState('');
    const [docCategoryValue, setDocCategoryValue] = useState(0);
    const [dropdownData, setDropdownData] = React.useState([]);
    const [isFocus, setFocus] = useState(dropdownData.length == 0);
    const [isCropping, setisCropping] = useState(true);
    const [visible, setvisible] = useState(false);
    const [visible1, setvisible1] = useState(false);
        const [checkdelstatus, setcheckdelstatus] = useState(false);
    const [checkcatstatus, setcheckcatstatus] = useState(false);
    const [filename, setFilename] = useState('');
    const [reload, setReload] = useState(false);

    const currImage = require("../assets/Images/new_background.jpg");

    React.useEffect(() => {

        const curr = AsyncStorage.getItem('userInfo')
        .then((value) => {
            let userData = JSON.parse(value);
            let currUser = userData.id;
            let folderId = folder_id;
            let folderName = folder_name ? folder_name : '';
            if(active){
                setTimeout(() => {
                    setDataisLoaded(false);
                    setReload(false);
                }, 500);
                setTimeout(() => {
                    setUserId(currUser);
                    setFolderId(folderId);
                    setFolderName(folderName);
                    getDocs(currUser, folderId);
                    getDocNames();
                    allDocIds();
                    }, 1500);
            }
        }).catch((error) => {
            throw error;
        })
    }, []); //reload every time the documents array changes?? Needed or not?


    let renderDropdown = () => {
            return(
                <View>
                    <Text style={{ ...customstyles.h5, ...customstyles.mb5}}>Category</Text>
                    <View style={[styles.container, {borderColor: "grey", borderWidth: 2, marginBottom: 10, borderRadius: 10}]}>
                        <Dropdown
                        style={[styles.dropdown, {borderColor: 'white', borderWidth: 2 }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={{...styles.inputSearchStyle}}
                        iconStyle={styles.iconStyle}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Document Category': ''}
                        searchPlaceholder="Search..."
                        value={docCategoryValue}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        onChange={(item) => {
                            //(item)
                            setDocCategory(item.label);
                            setDocCategoryValue(item.value);
                            setFocus(false);
                            //(docCategoryValue);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                            style={styles.icon}
                            color={isFocus ? 'white' : 'white'}
                            name="Safety"
                            size={20}
                            />
                        )}
                        />
                    </View>
                </View>
            )
    }

    // Docs Listng Api
    let viewDocument = async (folder_id, user_id, document_location, document_title) => {
        try{
            var imageShow = getOneImage(folder_id, user_id, document_location);
            //(imageShow)
            //navigation.navigate("ViewDocument", {imageShow: imageShow, docTitle: docTitle})

        }
        catch(error){
            //(error);
        }
    }
    let getDocs = async (userId, folderId) => {
        let data = {
            user_id: userId,
            folder_id: folder_id,
            api_url: 'getFileList'
        }
        try{
            const result = await commonPost(data)
            if ((result.status == 0)) {
                setDocuments([]);
                setReload(false)
            } else {
                console.log("DocumentsStatus", result);
                setDocuments(result.data);
                setReload(true)
            }
            console.log("AllDocuments: ", result.data)
            //("documents"+documents)
        }
        catch(error){
            setTimeout(() => {
                setFieldErr("Could not load documents, please try again later.")
            }, 1000)
            throw error;
            //(error)
        }
    }

    let doc_cat_search = (doc_catId) => {
        try{
            var listAll = [];
            for(let i = 1; i < 8; i++) {
                getRecList(i).then((listOptions) => {
                    listOptions.data.map((dataOption) => {
                        if(dataOption.value == doc_catId){
                            return dataOption.doc_name;
                        }
                    });
                })
            }
        }
        catch(error){
            console.log(error);
        }
    }

    let allDocIds = () => {
        try{
            setTimeout(() => {
                var listAll = [];
                //DANGER, HARDCODED VALUES
                for(let i = 1; i < 8; i++) {
                    getRecList(i).then((listOptions) => {
                        listOptions.data.map((dataOption) => {
                            listAll.push({label: dataOption.doc_name, value: dataOption.id})
                        });
                    }).catch((error) => {
                        throw error;
                    })
                }
                setDataisLoaded(true);
            }, 1000);
        }
        catch(error){
            //(error);
        }
    }


    let getDocNames = () => {
        console.log("All Names:")
        try{
            var listAll = [];
            getRecList(folder_id).then((listOptions) => {
                console.log("FirstOne");
                console.log(listOptions);
                ("List Options: ", listOptions.data);
                listOptions.data.map((dataOption) => {
                    listAll.push({label: dataOption.doc_name, value: dataOption.id})
                });
                setDropdownData(listAll);
            }).catch((error) => {
                console.log("New Error: ");
                console.log(error);
            })
            //("Dropdown Data: ", dropdownData);
        }
        catch(error){
            //("Getting dropdown");
            //(error.stack);
            console.log(error.stack);
        }
    }
    // Close

    // Image Picker
    let scanfun = async () => {
        //("Scanning");
        setvisible(true)
        setImageBase('');
        const { scannedImages } = await DocumentScanner.scanDocument()
  
        // get back an array with scanned image file paths
        if (scannedImages.length > 0) {
          // set the img src, so we can view the first scanned image
          setScannedImage(scannedImages[scannedImages.length - 1])
          FileSystem.readAsStringAsync(scannedImages[scannedImages.length - 1], {"encoding": 'base64'})
          .then(res =>{
            var newName = res.substring(0, 10);
            var fullJSON = {}
            fullJSON["uri"] = `data:image/jpg;base64,${res}`
            fullJSON["type"] = "image/png"
            fullJSON["name"] = newName
            setbase64image(fullJSON);
            
            //console.log(`data:image/jpg;base64,${res}`);
          }).catch((error) => {
            throw error;
        })
        }
     
      }
    let pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //(permissionResult, "permissionTrue");
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        } else {
            try {
                const res = await DocumentPicker.pickSingle({
                   type: [DocumentPicker.types.allFiles],
                });
                //("URI Found");
                setTimeout(() => {
                    setbase64image(res);
                    setFilename(res.name)
                }, 1000);
              } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                  //("error -----", err);
                } else {
                  throw err;
                }
              }
        }

    };
    // Close 

    // Upload Docs
    let submitDocument = () => {
        let user_id = userId;
        let doc_title = docTitle + " (" + docCategory + ")";
        let folder_id = folderId;
        let base_64 = '';
        base_64 = base64image;
        if ((base_64 == '')) {
            setFieldErr('Please Upload a Document');
            setTimeout(() => {
                setFieldErr('');
            }, 1000);
            return;
        }
        if ((doc_title == '')) {
            setFieldErr('Document title is required to upload a Document');
            setTimeout(() => {
                setFieldErr('');
            }, 1000);
            return;
        }
        if ((doc_title != '') && (base_64 != '')) {
            setcheckcatstatus(true);
        let data = {
            user_id: userId,
            folder_id: folder_id,
            doc_cat_id: docCategoryValue,
            api_url: 'checkCategory'
        }
        ////(data);
        var resp = commonFilePost(data)
            .then(resp => {
                let result = resp;
                //(resp);
                
                let status = result.status;
                //("Status: " + status);
                let message = result.message;
                if ((status == 1)) {
                    setcheckcatstatus(true);
                    Alert.alert(
                        'Add file to current category',
                        'Are you sure you want to add another file to this category?',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => cancelcatstatus(),
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: () => canfirmcatstatus() },
                        ]
                    );
                } else {
                    submitform(1)
                }
            })
            .catch((error) => {
                //(error)
                setResponse("Internet issues. Please try again.");
                setTimeout(() => {
                    setResponse("");
                }, 1000)
                throw error;
            })
        }
    }
    let canfirmcatstatus = () => {
        submitform(1);
        setcheckcatstatus(false);
    }
    let cancelcatstatus = () => {
        submitform(2);
        setcheckcatstatus(false);
    }
    let submitform = (catstatus) => {
        let user_id = userId;
        let doc_title = docTitle + " (" + docCategory + ")";
        let folder_id = folderId;

        let formData = new FormData();
        console.log("Is it base64?");
        var currDoc = {
            uri:base64image.uri,
            type:base64image.type,
            name:base64image.name + ".png"
        };
        formData.append('document', currDoc);
        formData.append('user_id',userId);
        formData.append('folder_id',folderId);
        formData.append('doc_title',doc_title);
        formData.append('filename',base64image.name + ".png");
        formData.append('doc_cat_id',docCategoryValue);
        formData.append('catstatus',catstatus);
        //setDataisLoaded(false);
       var resp = uploaddoc(formData)
            .then(resp => {
                let result = resp;
                console.log("Current Response: ", resp);
                let status = resp.status;
                let message = result.message;
                console.log("Result status", status);
                if ((status == 1)) {
                    console.log("User ID: ", userId);
                    console.log("Folder ID: ", folderId)
                    setDocTitle('');
                    setDocCategoryValue(0);
                    setImageBase('');
                    setResponse("Document uploaded successfully!");
                    getDocs(userId, folderId)
                    setTimeout(() => {
                        setResponse('');
                    }, 2000)
                } else {
                    setFieldErr(message);
                    setDocTitle('');
                    setTimeout(() => {
                        setFieldErr('');
                        setDataisLoaded(true);
                    }, 3000)
                }
                parentCall();
            })
            .catch((error) => {
                console.log("Current Error: ", error);
                throw error;
            })
     }
    // Close

    //View Document File
    
    let getfile = async (url) => {
        setTimeout(() => {
            setDataisLoaded(false);
        }, 1000);
        const f2 = url.split("/");
        const dotSplit = f2[f2.length-1].split(".");
        const fileEnding = dotSplit[dotSplit.length - 1];
        //(fileEnding)
        //(typeof(fileEnding));
        var fileName = f2[f2.length - 1];
        if(fileEnding != "pdf" && fileEnding != "jpeg" && fileEnding != "jpg" && fileEnding != "png"){
            fileName += ".png";
        }
        const localFile = `${FileSystem.documentDirectory}${fileName}`;
        const options = {
          fromUrl: url,
          toFile: localFile,
        };
     //(localFile)
     //File download snippet
        const downloadResumable = FileSystem.createDownloadResumable(
            options.fromUrl,
            options.toFile,
            {});
        try{
            const { uri } = await downloadResumable.downloadAsync();
            //('Finished downloading to ', uri);
            FileViewer.open(uri, {showOpenWithDialog: true}).then(() => {
                //("Opened file");
                setTimeout(() => {
                    setDataisLoaded(true);
                }, 1000);
            }).catch((error) => {
                throw error;
            })
        }
        catch(error){
            //(error);
            throw error;
        }
       }
    

    // Delete User File
    let deleteUserFile = async (doc_id, userId, folder_id) => {
        //(userId, "ThisUser")

        Alert.alert(
            'Delete File',
            'Are you sure you want to delete this file?',
            [
                {
                    text: 'Cancel',
                    onPress: () => ('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => confirmDel(userId, folder_id) },
            ]
        );

        let confirmDel = async (userId, folderId) => {
            var user_id = "";
            const curr = AsyncStorage.getItem('userInfo')
            .then((value) => {
                let userData = JSON.parse(value);
                user_id = userData.id;
            let data = {
                doc_id: doc_id,
                user_id: user_id,
                folder_id: folder_id,
                api_url: 'deleteFile'
            }

            //(data);
            var resp = commonPost(data)
                .then(resp => {
                    let result = resp;
                        let status = result.status;
                        let message = result.message;
                        console.log("Message: ");
                        console.log(message);
                        setTimeout(() => {
    
                        }, 3000);
                        if ((status == 1)) {
                            setResponse(message);
                            setTimeout(() => {
                                setResponse('');
                            }, 3000)
                            getDocs(userId, folder_id);
                        } else {
                            setResponse("Internet issues. Please try again.");
                            setTimeout(() => {
                                setResponse('');
                            }, 3000)
                        }
                        parentCall();
                })
                .catch((error) => {
                    //(error)
                    throw error;
                })
        }).catch((error) => {
            throw error;
        })
    }
}
    // Close

    if (!DataisLoaded) {
        return <Loader />;
    }
    return (
        <View>
            <View>
                {!DataisLoaded ? 
                <Loader/> :
                <View></View>
                }
            </View>
            <SafeAreaView style={styles.scrollArea}>
                <View style={styles.innerView}>
                    <View >
                        <View style={{ ...customstyles.whitebox, ...customstyles.mx10, ...customstyles.my15, ...customstyles.p15, borderRadius: 10, borderColor: "grey", borderWidth: 2}}>
                            {
                                documents.length > 0 ?
                                <View>
                                    <Text style={{alignSelf: "flex-start", color: "#662397", fontSize: 15}}>All Documents</Text>
                                </View>:
                                <View>
                                    <Text style={{textAlign: "center", color: "grey", fontSize: 10}}>No Documents Yet</Text>
                                </View>

                            }
                            {
                                documents.length > 0 &&
                                documents.map((item, index) => (
                                    <TouchableOpacity key={index} style={{...customstyles.checkboxlist, ...customstyles.mb5, borderWidth: 2}} onPress={() => getfile(item.path)}>
                                        <Text style={{...customstyles.mr10,}}>{item.document_title}</Text>
                                        <View key={item.id} style={{...customstyles.upright,...customstyles.mr5, ...{marginTop: 8,}}}>
                                            <TouchableOpacity style={{ ...customstyles.uprightDelete }} onPress={() => deleteUserFile(item.id, userId, folder_id)} >
                                                <Ionicons name="close-outline" size={24} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity> 
                                ))
                                /*
                                <View>
                                    <Carousel
                                    layout="default"
                                    ref={ref}
                                    data={documents}
                                    sliderHeight={70}
                                    style={{alignSelf: "center", justifyContent: "center"}}
                                    itemWidth={ITEM_WIDTH}
                                    itemHeight={70}
                                    renderItem={renderItem}
                                    onSnapToItem={(index) => setActiveIndex(index)}
                                    vertical={true}
                                    />
                            </View>*/
                            }
                        </View>

                        <View style={{ ...customstyles.whitebox,...customstyles.mx10, ...customstyles.mb15, ...customstyles.p15, borderWidth: 0, backgroundColor: "transparent" }}>
                            <View>
                                {
                                    fieldErr != '' && <Text style={{ ...customstyles.mb10, ...customstyles.textred }}>{fieldErr}</Text>
                                }

                                {
                                    successResp != '' && <Text style={{ ...customstyles.mb10, ...customstyles.textgreen }}>{successResp}</Text>
                                }
                            </View>
                            <View style={{...customstyles.mb10, display: "flex", flexDirection: "row", flex: 1}}>

                                <TouchableOpacity onPress={scanfun} style={{ ...customstyles.py15, ...customstyles.bgtheme, ...customstyles.rowverticalcenter, ...customstyles.textCenter, ...customstyles.radius10, flex: 0.5, marginRight: 10}}>
                                    <Ionicons name="scan" size={20} color="#fff"></Ionicons>
                                    <Text style={{ ...customstyles.h5, ...customstyles.textwhite, ...customstyles.ml10, fontSize: 20}}>Scan</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={pickImage} style={{ ...customstyles.py15, ...customstyles.bgtheme, ...customstyles.rowverticalcenter, ...customstyles.textCenter, ...customstyles.radius10, flex: 0.5}}>
                                    <Ionicons name="cloud-upload-outline" size={20} color="#fff"></Ionicons>
                                    <Text style={{ ...customstyles.h5, ...customstyles.textwhite, ...customstyles.ml10, fontSize: 20}}>Upload</Text>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <Text style={{ ...customstyles.h5, ...customstyles.mb5}}>Title</Text>
                                <TextInput
                                    placeholder={'Document Name'}
                                    onChangeText={(docTitle) => setDocTitle(docTitle)}
                                    style={[customstyles.inputtheme, {borderColor: "grey", borderRadius: 10}]}
                                />
                                {

                                }
                                {
                                    dropdownData.length > 0 &&
                                    renderDropdown()
                                }
                            </View>
                            <TouchableOpacity onPress={submitDocument} style={[customstyles.mb10, {borderColor: "#20004A"}]}>
                                <Text style={[customstyles.btnThemexs, {color: "#20004A"}]}>SUBMIT DOCUMENT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView >
        </View>
    )
}

const styles = StyleSheet.create({
    scrollArea: {
        flex: 1,
        width: "100%"
        // paddingTop: StatusBar.currentHeight,
    },
    innerView: {
        height: "100%",
        paddingHorizontal: 10,
    },
    dropdown: {
        height: 50,
        borderColor: '#000',
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
      },
      selectedTextStyle: {
        fontSize: 16,
        color: "#662397",
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

export default ShowDocs;


