import React, { useState,useEffect,Component } from 'react'
import { View,StyleSheet,Alert,ScrollView,Text,ActivityIndicator} from 'react-native'
import Background from '../components/Background'
import Dropdown from '../components/Dropdown'
import axios from 'axios';
import Header from '../components/Header'
import Button from '../components/Button'
import {conn} from '../screens/utils/Conn'
import TextInput from '../components/TextInput'
import { nameValidator } from '../helpers/nameValidator'
import { amountValidator } from '../helpers/amountValidator'


export default function DisburseFunds ({navigation,route}){

    const [membname, setMembName] = useState({ value: '' })
    const [amount, setAmount] = useState({ value: ''})
    const [checkno,setcheckNo] = useState({ value: ''})
    const [date, setDate] = useState({ value: new Date().toDateString()})
    const [descr,setDescr] = useState({ value: ''})
    const [caseload,setCaseload]=  useState([])
   
       
    async function transfer() {
 
      const url3 = ''+conn+'/create-transfer'
      await axios.post(url3,
        {membername:membname.value,
         amount:amount.value,
         date:date.value,            
         checkno:checkno.value,
         description:descr.value
        
        })
      .then(results=>{
      if(results.success===false){
        Alert.alert('Fail!, could not send ')
        //navigation.replace('DashboardForm')
      }else{
        
        Alert.alert(`Success! USD ${results.data.Amount} sent to ${membname.value}`)
        navigation.replace('DashboardForm')
      }
    }).catch(()=>{
      alert('Member does not have an account')
      navigation.replace('DashboardForm')
    })
     
  }      
  
  useEffect(() => {
           
        const url=''+conn+'/getallcases';
        axios.get(url)
       .then(res=>{
       
        setCaseload(res.data)
             
        })
        
       .catch(error=>console.log("Error happened: " +error))
      }, [])
    
      useEffect(() => {

        const {
         membername
        
        } = route.params

        setMembName({value:membername})

               
        }
      ,[])
    return(
     
        <Background>
          
            <Header>Payment Details</Header>
          
              <Dropdown
              data={caseload&&caseload.map(item=>item.membername)}
              type='Pay to...'  
              onSelect={(selectedItem,index)=>{
                  setMembName({value:selectedItem})
              }}
             
            />
            
             <TextInput
            label="Check number"
            returnKeyType="next"
            value={checkno.value}
            onChangeText={(text) => setcheckNo({ value: text })}
            keyboardType="numeric"
            error={!!checkno.error}
            errorText={checkno.error}
            />
             <TextInput
            label="Description"
            returnKeyType="next"
            value={descr.value}
            onChangeText={(text) => setDescr({ value: text })}
            keyboardType="text"
            error={!!descr.error}
            errorText={descr.error}
            />
             <TextInput
            label="Amount"
            returnKeyType="next"
            value={amount.value}
            onChangeText={(text) => setAmount({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            />
          
            <TextInput
            label="Date"
            returnKeyType="next"
            value={date.value}
            onChangeText={(text) => setDate({ value: text })}
            keyboardType="text"
           
            />
           
            <View style={styles.button}>
            
            <Button
            mode="contained"
            onPress={()=>transfer()}
            style={{ marginTop: 10 }}
            >
            Submit
            </Button>
            <Button
            mode="contained"
            onPress={() => {

                Alert.alert(
                    "Cancel Payment",
                    "Are you sure?",

                    [
                      {
                        text: "No",
                        onPress: () => {return},
                        style: "cancel"
                      },
                      {
                        text: "Yes",
                        onPress: () => navigation.replace('DashboardForm'),
                        style: "cancel"
                      },
                     
                
                    ]
                  );

            }}
            style={{ marginTop: 10 }}
            >
            Cancel
            </Button>
            </View>
            
        </Background>
     
    )
}

const styles=StyleSheet.create({
        row: {
            
            flexDirection:'row',
            justifyContent:'center',
            width:'30%'
          },
        button:{
          marginTop: 1,
          width:'100%'
        }
})



