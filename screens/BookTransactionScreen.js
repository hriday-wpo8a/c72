import React from 'react';
import {Text,View,TouchableOpacity,StyleSheet,TextInput,Image,KeyboardAvoidingView} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner, requestPermissionsAsync}from 'expo-barcode-scanner';
import * as firebase from 'firebase'
import db from '../config.js'

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
        hasCameraPermissions:null,
        scanned:false,
        scannedBookId:'',
        scannedStudentId:'',
        buttonState:'normal',
        transactionMessage:''
        }
    }
    getCameraPermissions=async(id)=>{
        const {status} =await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status==="granted",
            buttonState:id,
            scanned:false
        }) 
    }
    handleBarCodeScanned = async({type,data})=>{
      const {buttonState}=this.state

      if(buttonState==="BookId"){
          this.setState({
              scanned:true,
              scannedBookId:data,
              buttonState:'normal'
          })
      }
      else if(buttonState==="StudentId"){
        this.setState({
            scanned:true,
            scannedStudentId:data,
            buttonState:'normal'
        })
    }

        
    }
    initiateBookIssue=async()=>{
        db.collection("Transactions").add({
            'studentId':this.state.scannedStudentId,
            'bookId':this.state.scannedBookId,
            'Date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':"Issue"
        })
        db.collection("Books").doc(this.state.scannedBookId).update({
          'bookAvilability':false
        })
        db.collection("Students").doc(this.state.scannedStudentId).update({
            'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
          })
    }
    initiateBookReturn=async()=>{
        db.collection("Transactions").add({
            'studentId':this.state.scannedStudentId,
            'bookId':this.state.scannedBookId,
            'Date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':"Return"
        })
        db.collection("Books").doc(this.state.scannedBookId).update({
          'bookAvilability':true
        })
        db.collection("Students").doc(this.state.scannedStudentId).update({
            'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
          })
    }
handleTransaction = async()=>{
    var transactionMessage=null
    db.collection("Books").doc(this.state.scannedBookId).get()
    .then((doc)=>{
        var book = doc.data();
        if(book.bookAvilabilty){
            this.initiateBookIssue();
            transactionMessage = "BookIssued"
            alert(transactionMessage)
        }
        else{
            this.initiateBookReturn();
            transactionMessage = "BookReturned"
            alert(transactionMessage)
        }

    })
    this.setState({
        transactionMessage:transactionMessage
    })
}
    render(){
       const hasCameraPermissions = this.state.hasCameraPermissions
       const scanned = this.state.scannned;
       const buttonState=this.state.buttonState;
       if (buttonState!=="normal"&&hasCameraPermissions){
           return(
               <BarCodeScanner
               onBarCodeScanned = {scanned?undefined:this.handleBarCodeScanned}
               style = {StyleSheet.absoluteFillObject}
               />
           )
       }else if(buttonState==="normal"){
           return(
               <KeyboardAvoidingView style={ styles.container} behavoir="padding" enabled>
          <View>
          <Image
          source={require("../assets/booklogo.jpg")}
          style={{width:200,height:200}}
          />
          <Text style = {{textAlign:'center',fontSize:30}}>WILY</Text>
          </View>
          <View style = {styles.inputView}>
          <TextInput
          style={styles.inputBox}
          placeholder="bookId"
          onChangeText={text=>this.setState({scanedBookId:text})}
          value= {this.state.scannedBookId}
          />
          <TouchableOpacity
          style={styles.scanButton}
          onPress={()=>{
              this.getCameraPermissions("BookId")
          }}>
              <Text style = {styles.buttonText}>
                Scan
              </Text>
          </TouchableOpacity>
          </View>
          <View style = {styles.inputView}>
          <TextInput
          style={styles.inputBox}
          placeholder="studentId"
          onChangeText={text=>this.setState({scanedStudentId:text})}
          value= {this.state.scannedStudentId}
          />
          <TouchableOpacity
          style={styles.scanButton}
          onPress={()=>{
              this.getCameraPermissions("StudentId")
          }}>
              <Text style = {styles.buttonText}>
                  Scan
              </Text>
          </TouchableOpacity>
          </View>
          <TouchableOpacity
          style = {styles.submitButton}
          onPress = {async()=>{
              var transactionMessage =this.handleTransaction(); 
          }}>
              <Text style = {styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
               </KeyboardAvoidingView> 
           )
       }
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    displayText:{
        fontSize:15,
        textDecorationLine:'underline'
    },
    scanButton:{
        backgroundColor:'#2196f3',
        margin:10,
        padding:10
    },
    buttonText:{
        fontSize:20
    },
    inputView:{
        flexDirection:'row',
        margin:20
    },
    InputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20
    },
    ScanButton:{
       backgroundColor:'#66bB6A',
       width:50,
       borderWidth:1.5,
       borderLeftWidth:0
  

    },
    submitButton:{
        backgroundColor:'#fbc02d',
        width:100,
        height:50
    },
    SubmitButonText:{
        Padding:10,
        textAlign:'center',
        fontSize:20,
        fontWeight:"bold",
        color:'white'
    }
})