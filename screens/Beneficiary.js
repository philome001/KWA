import React, { useState,useEffect } from 'react'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Background from '../components/Background'
import axios from 'axios';
import {conn} from '../screens/utils/Conn'
import AsyncStorage from '@react-native-async-storage/async-storage';
import BeneficiaryEntry from '../components/BeneficiaryEntry'
import {theme} from '../themes/theme'
import { View,StyleSheet, FlatList,Modal,Alert,TouchableWithoutFeedback,Keyboard,Text} from 'react-native'
import { nameValidator } from '../helpers/nameValidator'
import { ageValidator } from '../helpers/ageValidator'
import {locationValidator} from '../helpers/locationValidator'
import {selectionValidator} from '../helpers/selectionValidator'
import Dropdown from '../components/Dropdown'
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge'

export default function Beneficiary({navigation}){
    const [beneficiaryname, setBenName] = useState({ value: '' })
    const [age, setAge] = useState({ value: ''})
    const [location, setLocation] = useState({ value: ''})
    const [modalOpen,setModalOpen]=useState(false)
    const [selectedItem, setCaseType] = useState({value:''})
    const [beneficiary, setBeneficiary]= useState([]);
    const [membid,setMemberid]=useState('');


    const getUser=async()=>{
   
        await AsyncStorage.getItem('user').then((item) => {
        const val=JSON.parse(item)
        setMemberid(val)
      })
      .catch(err=>{console.log(err)});
    }
   
    useEffect(() => {
        
        return function cleanup() {
            
        }
    })
    useEffect(() => {
     
        getUser()
      
      }, [beneficiaryname]);  
   
     
    const reltypes=['Parent','Sibling','Spouse','Child']
    
    const pressHandler=(val)=>{
        setBeneficiary((prev)=>{
            return prev.filter(item=>item.beneficiaryname!=val)
        })
    }
    const addHandler=()=>{
                     
            setBeneficiary(prevlist=>{
              
                   return( [
                        {
                        beneficiaryname:beneficiaryname.value,
                        age:age.value,relationship:selectedItem.value,location:location.value,parent:membid._id},
                        ...prevlist
                    ])
                
                 
            }
           )
            
           setModalOpen(true)
           
    }
    const sendData=async()=>{
       
        const url=''+conn+'/beneficiary';
          
        await axios.post(url,beneficiary)
        .then(res=>{
            alert("Beneficiary Inserted")
            
        })
        .catch(error=>console.log(error))
    }
      
    const onSubmit = () => {

          
        const beneficiarynameError = nameValidator(beneficiaryname.value)
        const ageError = ageValidator(age.value)
        const locationError=locationValidator(location.value)
        const selectionError=selectionValidator(selectedItem.value)
       
        if(beneficiarynameError||ageError||locationError||selectionError){
            setBenName({ ...beneficiaryname, error: beneficiarynameError })
            setAge({...age,error: ageError})
            setLocation({...location,error:locationError})
            setCaseType({...selectedItem,error:selectionError})
            
        }else{
                 
           addHandler();
           
        }
    
      }
    
    return(
    <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}} accessible={false}>
    
    <Background>
        <Header>Beneficiaries</Header>
        <Modal visible={modalOpen} animationType='slide'>
            <View style={{alignItems:'center'}}><Header>List of Beneficiaries</Header></View>
            <View style={{width:'80%',flex:1,alignSelf:'center',marginTop:30,marginBottom:10}}>
            
                <FlatList
                    keyExtractor={(item)=>item.beneficiaryname}
                    data={beneficiary}
                    refreshing={true}
                    showsVerticalScrollIndicator={true}
                    
                    renderItem={({item})=>(
                <BeneficiaryEntry item={item} pressHandler={pressHandler} setmodal={setModalOpen}/>

                )}/>
            <Button
            mode="contained"
            onPress={()=>{
                Alert.alert(
                    "Beneficiary",
                    "Add more?",
                    [
                     
                     
                        { text: "No", onPress: () =>{
                          
                            navigation.replace('DashboardForm') 
                            setModalOpen(false)
                            sendData()
                        }},
                        { text: "Yes", onPress: () =>{
                        
                        
                        setModalOpen(false)
                        setBenName({value:''})
                        setAge({value:''})
                        //setCaseType({value:''})
                        setLocation({value:''})
                      
                   

                        
                        }},
                    
                      ]

                  );
                
            
            }}

            > Submit
            </Button>
            <View >
            
            </View>
          
        </View>
        </Modal>
        <View style={styles.formcontainer}>
      
        <TextInput
        label="Beneficiary Name"
        returnKeyType="next"
        value={beneficiaryname.value}
        onChangeText={(text) => setBenName({value:text})}
        error={!!beneficiaryname.error}
        errorText={beneficiaryname.error}
        />
        <TextInput
        label="Age"
        returnKeyType="next"
        value={age.value}
        onChangeText={(text) => setAge({ value: text})}
        error={!!age.error}
        errorText={age.error}
        keyboardType='numeric'
        
        />
        <Dropdown 
        data={reltypes}
        type='Select type of relationship' 
        onSelect={(selectedItem,index)=>{
            setCaseType({value:selectedItem})
        }}
        error={!!selectedItem.error}
        errorText={selectedItem.error} 
        
        />
       
        <TextInput
        label="Location"
        returnKeyType="next"
        value={location.value}
        onChangeText={(text) => setLocation ({ value: text })}
        error={!!location.error}
        errorText={location.error}
      
        />
        <Button
            mode="contained"
            onPress={()=>onSubmit()}
            > Add
        </Button>
        <Button
            mode="contained"
            onPress={()=>navigation.replace('DashboardForm')}
            > Cancel
        </Button>
        </View>
        
    </Background>
    
    </TouchableWithoutFeedback>
         
    )}
const styles = StyleSheet.create({

    formcontainer:{
        flex:1,
       
        width:'100%',
        justifyContent:'center'
   },
   dropdownbuttonstyle:{
            
    width:'100%',
    height:60,
    marginTop:8,
    marginBottom:8,
    backgroundColor:theme.colors.surface,
    borderRadius:8,
    borderWidth:1,
    borderColor:theme.colors.secondary

   },
   dropdowntextstyle: {
     
   color:theme.colors.secondary,
   fontSize: 23,
   color:'grey',
   textAlign:'left',
     
   },

})