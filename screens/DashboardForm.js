import React,{useEffect,useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, StyleSheet,TouchableOpacity,Image, Alert } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';
import Background from '../components/Background'
import {conn} from '../screens/utils/Conn'
import Header from '../components/Header'
import { theme } from '../themes/theme'
import Button from '../components/Button'



export default function DashboardForm({ navigation }) {
  const [usertype, setUserType] = useState('')
  const [userimage, setUserImage] = useState('')
const checkUser=async()=>{
    const user = await AsyncStorage.getItem('user')
    if(user){
      let muser = JSON.parse(user)
     
      setUserType(muser.userType)
      setUserImage(muser.memberImage)
    }

} 

useEffect(() => {

   checkUser();
         
     }, [])
  
  return (
      <Background>
     
      <Header>Dashboard</Header>
      <View >
      <Image
        style={styles.tinyLogo}
        source={{uri:''+conn+'/'+userimage}}
      /></View>
        
        <View style={styles.container}>
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={() => navigation.replace('Beneficiary')}>
                  
            <View style={styles.itemcard}>
           
              <FontAwesome
              name='user'
              size={35}
              color={theme.colors.primary}
              />
              <Text style={styles.itemtext}>Beneficiary</Text>
             
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (usertype=='user'){
            alert('You need admin rights to post')
            return
          }
          
          navigation.replace('Case')}}>
            <View style={styles.itemcard}>
              <FontAwesome
              name='ambulance'
              size={35}
              color={theme.colors.primary}
              />
              <Text style={styles.itemtext}>
                Post Case
              </Text>
            
              </View>
        </TouchableOpacity>        
        
        </View>
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={() => {
           if (usertype=='user'){
            alert('You need admin rights to disburse funds')
            return
          }
          navigation.replace('DisburseFunds',{membername:''})
       
          }}>
            <View style={styles.itemcard}>
              <FontAwesome
              name='dollar'
              size={35}
              color={theme.colors.primary}
              />
              <Text style={styles.itemtext}>Pay</Text>
            
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace('Contribute')}> 
            <View style={styles.itemcard}>
              <FontAwesome
              name='money'
              size={35}
              color={theme.colors.primary}
              />
              <Text style={styles.itemtext}>
                Donate
              </Text>
            
            </View>
            </TouchableOpacity>
        
        </View>
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={() => navigation.replace('Statements')}> 
            <View style={styles.itemcard}>
            <FontAwesome
              name='line-chart'
              size={35}
              color={theme.colors.primary}
            />
            <Text style={styles.itemtext}>Statement</Text>

            
            </View>
            </TouchableOpacity>
         
        <TouchableOpacity  onPress={() => navigation.replace('Admin')}> 
        <View style={styles.itemcard}>
            <FontAwesome
              name='users'
              size={35}
              color={theme.colors.primary}
            />
            <Text style={styles.itemtext}>
              Settings
            </Text>
            
        </View>
        </TouchableOpacity>
                
        
        </View> 
        <Button
        mode="contained"
        onPress={() => {
          navigation.replace('Auth');
          AsyncStorage.removeItem('user');

        }
        }
      
        style={{ marginTop: 10 }}
      > Logout
      </Button> 
        
        </View>
     
      </Background>   
     
      
  
  )
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop:20,
      width:'100%',    
      justifyContent:'flex-start',
      alignItems:'center',
         
  },
  itemcard:{
            padding:20,
            backgroundColor:'white',
            borderRadius: 15,
            justifyContent: 'space-between',
            alignItems:'center',
            shadowColor: 'grey',
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 8,
            //shadowOffset: {width: 0, height: 0},
            margin:10,
            width:149,
            height:130

  },
  itemtext:{
    fontSize:15,
    color:'grey',
    padding:5,
    alignItems:'center',
    justifyContent:'center'
  },
  tinyLogo: {
    width: 60,
    height: 60,
    borderRadius:50,
    marginTop:5
  },
  
  
 
});