import React,{useEffect} from 'react'
import { View,StyleSheet,ActivityIndicator } from 'react-native'

import Background from '../components/Background'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default AuthLoading=({navigation})=>{


const checkUser=async()=>{
    const user = await AsyncStorage.getItem('user')
    if(user)
        navigation.replace('App');
    else
        navigation.replace('Auth');

}  
useEffect(() => {

   checkUser();
         
     }, [])

return(
        <Background>
            <View styles={styles.container}>
              <ActivityIndicator size="large" color="#0000ff"/>  
            </View>
        
         
        </Background>

    )
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
        
    },
  


})