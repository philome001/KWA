import React, { useState,useEffect } from 'react'
import { View,StyleSheet,Alert,Text} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from '../components/Background'
import Dropdown from '../components/Dropdown'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import axios from 'axios';
import {conn} from '../screens/utils/Conn'
import Button from '../components/Button'
import { nameValidator } from '../helpers/nameValidator'
import { amountValidator } from '../helpers/amountValidator'

export default function Contribute ({navigation}){

    const [membname, setMembName] = useState({ value: '' })
    const [date, setDate] = useState({ value: new Date().toDateString()})
    const [amount, setAmount] = useState({value:''})
    const [amountdue, setAmountdue] = useState({value:''})
    const [bal, setBal] = useState({value:''})
    const[prevbal,setPrevBal]=useState(0)
    const [caseload,setCaseload]=  useState([])
    const [loggeduser,setLogged]=  useState('')
    const[benmemberid,setBenMembId] = useState({value:''});
    const[caseid,setCaseId] = useState({value:''});
    
    const user=()=>{
      AsyncStorage.getItem('user').then((item) => {
        const val=JSON.parse(item)
        setLogged(val)
      })
      .catch(err=>{console.log(err)});
    }
    const onSubmit = () => {
      
      const membnameError = nameValidator(membname.value)
      const amountError = amountValidator(amount.value)
     
      if(membnameError||amountError){
          setMembName({ ...membname, error: membnameError })
          setAmount({...amount,error:amountError})
      }else{
     
        let selectedben=caseload.filter(item=>{
           return item.membername===membname.value});
        
        // console.log('BenId '+benmemberid.value+' CaseId '+caseid.value)


        const data={
        InvNo:caseid.value,
        conmemberid:loggeduser._id,
        email:loggeduser.email,
        description:'Donation',
        benmemberid: selectedben[0].memberid,
        amount:amount.value,
        amountdue:amountdue.value,
        balance:bal.value,
        date:date.value,
        beneficiaryname:membname.value,
                
        }

        const url=''+conn+'/contribute';
        let url1=''+conn+'/updatebalance'


        if (bal.value<0){
           
          Promise.all([axios.post(url1,{user:loggeduser._id,new_bal:bal.value}),axios.post(url,data)]).then((results) => {
                                      
              if(results){
                       
              Alert.alert(
              "Donation",
              "Donation Posted",
                [
                { 
                  text: "OK", 
                  onPress: () =>  navigation.replace('DashboardForm') 
                }
                ]
              );
                  
              }
             
          }).catch(err=>console.log(err))
          
         
        
      }

     
      }
  
    }
    useEffect(() => {
   
      const url=''+conn+'/getallcases';
        axios.get(url)
       .then(res=>{
      
       setCaseload(res.data)
       user()
     
        })
        
       .catch(error=>console.log("Error happened: " +error))
      }, [])

      useEffect(() => {
       
        let selectedmem=  caseload.filter(item=>{
          return item.membername===membname.value});
        if(selectedmem.length!==0){
                  
         setAmountdue({value:selectedmem[0].amount.toString()})
         setBenMembId({value:selectedmem[0].memberid})    
         setCaseId({value:selectedmem[0]._id}) 
        } 
 
       },[membname])  
       useEffect(() => {
      
        if(amount.value!==''){
          if(prevbal<0){
            let balance= parseInt(amount.value)+parseInt(prevbal)
      
            setBal(balance.toString())

        }else{
            let balance= parseInt(amountdue.value)-parseInt(amount.value)+parseInt(prevbal)
      
            setBal({value:balance.toString()})

        }

      
        } 
 
       },[amount]) 

      useEffect(() => {
      
        AsyncStorage.getItem('user').then((item) => {
        const val=JSON.parse(item)
        if(val!==''){
          
          const url = ''+conn+'/showbalance/'+val._id;
        
          axios.get(url)
          .then((res)=>{
              
            if(res.data.result.length!==0){
              setPrevBal(res.data.result[0].amount)
            }
          })
         .catch(err=>console.log('there was an error'+err))
          
        }
       
        })
        
        
       },[])

    return(
        <Background>
       
            <Header>Contribution</Header>
            <Dropdown
              data={caseload&&caseload.map(item=>item.membername)}
              type='Donate to...'  
              onSelect={(selectedItem,index)=>{
                  setMembName({value:selectedItem})
                

              }}
              //error={!!selectedItem.error}
             // errorText={selectedItem.error} 
            
            />
        
            <TextInput
            label="Date"
            returnKeyType="next"
            value={date.value}
            onChangeText={(text) => setDate({ value: text })}
            editable={false}
            />
             <TextInput
            label="Amount due"
            returnKeyType="next"
            editable={false}
            value={amountdue.value}
                 
            />
            <TextInput
            label="Amount paid"
            returnKeyType="next"
            value={amount.value}
            onChangeText={(text) => setAmount({ value: text })}
            keyboardType='numeric'
            error={!!amount.error}
            errorText={amount.error}
            />
               <TextInput
            label="Balance"
            returnKeyType="next"
            value={bal.value}
            editable={false}
            error={!!amount.error}
            errorText={amount.error}
            />
            <View style={styles.row}>
            
            <Button
            mode="contained"
            onPress={() => {
              onSubmit()
              navigation.navigate('PurchaseProduct',{
                conmemberid:loggeduser._id,
                amount_pd:amount.value,
                email:loggeduser.email,
                benid: benmemberid.value,
                amountdue:amountdue.value,
                caseid:caseid.value,
                balance:bal.value,
                beneficiaryname:membname.value,
              
              })
            

            }}
            style={{ marginTop: 10 }}
            >
            Post
            </Button>
            <Button
            mode="contained"
            onPress={() => {

                Alert.alert(
                    "Cancel Contribtuion",
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
            width:'100%',
            marginTop: 1,
          },
})



