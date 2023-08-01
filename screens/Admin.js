import React, {useState,useEffect}from 'react'
import { TouchableOpacity, StyleSheet,TouchableWithoutFeedback,Keyboard,Alert, View } from 'react-native'
import Button from '../components/Button'
import Background from '../components/Background'
import Header from '../components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {conn} from '../screens/utils/Conn'


export default function Admin({navigation}){
    const [loggeduser,setLogged]=  useState('')

    const user=()=>{
        AsyncStorage.getItem('user').then((item) => {
          const val=JSON.parse(item)
          setLogged(val)
        })
        .catch(err=>{console.log(err)});
      }
    const delaccount=async()=>{
      const id =loggeduser._id  
     
      const url=''+conn+'/deletemember/'+id;
      await axios.delete(url)
      .then(res=>alert(res.message))
      .catch(err=>console.log(err))
    }
    const updateaccnt=()=>{
     //   console.log(JSON.stringify(loggeduser))
    }
    useEffect(() => {
        user()
    }, [])
   
    const deleteaccount=()=>{
        Alert.alert(
            "Account Delete ",
            "Are you sure you want to delete account?",
            [
              {
                text: "Yes",
                onPress:()=>{delaccount()},
                style: "cancel"
              },
              {
                text: "No",
                onPress: () => navigation.replace('DashboardForm'),
                style: "cancel"
              },
           
            ]
          );
    }
    return(
        <Background>
            <Header>Account Settings</Header>
            <View style={styles.container}>
            <View >
                <Button 
                mode='contained'
                onPress={deleteaccount}>
                Delete Account
                </Button>
                
               
            </View>
            <View >
                <Button 
                mode='contained'
                onPress={()=>navigation.replace('UpdateScreen')}>
                Update Account
                </Button>
                
               
            </View>
            <View >
                <Button 
                mode='contained'
                onPress={()=>navigation.replace('DashboardForm')}>
                Cancel
                </Button>
                
               
            </View>
            </View>
        </Background>

    )
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center'
    },
    buttonstyle:{
        margin:10
    }


})