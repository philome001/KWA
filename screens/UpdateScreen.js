import React, { useState,useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View,StyleSheet,Alert,Pressable, TouchableOpacity,Image} from 'react-native';
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../themes/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { phoneValidator } from '../helpers/phoneValidator'
import { confirmpasswordValidator } from '../helpers/confirmpasswordValidator'
import { termsValidator } from '../helpers/termsValidator'
import * as ImagePicker from 'expo-image-picker';
import {conn} from '../screens/utils/Conn'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '' })
  const [email, setEmail] = useState({ value: ''})
  const [password, setPassword] = useState({ value: ''})
  const [phone, setPhone] = useState({ value: ''})
  const [confirmpwd, setConfirmpwd] = useState({ value: ''})
  const [muser, setUser] = useState(null);
  const [uid,setUid]=useState([])
  const [oldimage, setOldImage] = useState(null);
  const [image, setImage] = useState(null);
  
  const checkUser=async()=>{
    await AsyncStorage.getItem('user').then((item) => {
        const val=JSON.parse(item)
        setUser(val.email)
        setUid(val._id)
      })
   
}
  const onUpdatePressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    const phoneError = phoneValidator(phone.value)
   
    
    
    if (emailError || passwordError || nameError||phoneError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      setPhone({...phone,error:phoneError})
     
      return
    }else{
       
     if(!image){
         setImage(oldimage)
        

     }
      const formdata = new FormData()

      formdata.append('memberImage',{
        uri:image,
        name: 'memberImage',
        type: ' image/jpeg',
      })
      formdata.append('uid',uid)
      formdata.append('name',name.value)
      formdata.append('email',email.value)
      formdata.append('phone',phone.value)
      formdata.append('password',password.value)
   
    
    const url=''+conn+'/updatemember';
     
    axios.put(url,formdata,{
      headers:{
        Accept:'application/json',
        'Content-Type':'multipart/form-data',
       
      }
    })
    .then(res=>{
     
       AsyncStorage.setItem("user",JSON.stringify(res.data) )
       alert("Update Successful")
       
       navigation.replace('DashboardForm') 
    })
    .catch(error=>{
      console.log('Image is '+image)
        console.log('Error is '+error)
           
       
      }) 
    return
    }

   
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

  
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  useEffect(()=>{
     checkUser()
  
  },[])

  useEffect(() => {
   
    if(muser){
      
          
    const url=''+conn+'/getmember/'+muser
    axios.get(url)
    .then(res=>{
      
       
       setName({value:res.data.name})
       setEmail({value:res.data.email})
       setPhone({value:res.data.phone})
       setPassword({value:res.data.password})
       setOldImage(res.data.memberImage)
      
       
    }).catch(err=>{
      alert('No user')
      
    })

    }
  
}, [muser])

  return (
  
    <Background>
      
    <BackButton goBack={()=>{
      //navigation.goBack()
      if (navigation.canGoBack())
      navigation.goBack()
      else
      navigation.navigate('DashboardForm')
      
      }} />
     
      <Header>Update Account</Header>
      <View >
      <Image
        style={styles.tinyLogo}
        source={{uri:''+conn+'/'+oldimage}}
      /></View>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        editable={false}
        onChangeText={(text) =>{ 
           
            setName({ value: text })}
        }
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
        <TextInput
        label="Phone"
        returnKeyType="next"
        value={phone.value}
        onChangeText={(text) => setPhone({ value: text })}
        error={!!phone.error}
        errorText={phone.error}
        autoCapitalize="none"
        keyboardType="numeric"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
     
      <View style={styles.row}>
      <Pressable style={styles.button}
      onPress={pickImage}>
      <Text style={styles.text}>Upload Image</Text>
       
       </Pressable>
      {image && <Image source={{ uri: image }} style={{ width: 50, height: 50,marginLeft:10 }} />}
      </View>
    
     
      <Button
        mode="contained"
        onPress={() => {
          onUpdatePressed()
      
        }}
        style={{ marginTop: 10 }}
      >
        Update
      </Button>
      <Button
        mode="contained"
        onPress={()=>navigation.replace('DashboardForm')}
        style={{ marginTop: 10 }}
      >
        Cancel
      </Button>
      
    
    </Background>
    
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 1,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft:5
  },
  checkbox:{
    flexDirection: 'row',
    marginTop: 10,
    paddingRight:1
  },
  text:{
    color:'white'
  },
  button: {

    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor:theme.colors.primary
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius:50,
    marginTop:5
  },
 
})
