import React, { useState,useEffect,useRef } from 'react'
import { View,StyleSheet,Alert,TouchableOpacity,Text} from 'react-native'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Header from '../components/Header'
import axios from 'axios';
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { nameValidator } from '../helpers/nameValidator'
import { emailValidator } from '../helpers/emailValidator'
import { amountValidator } from '../helpers/amountValidator'
import {conn} from '../screens/utils/Conn'
export default function Case({navigation}){

    const [membname, setMembName] = useState({ value: '' })
    const [membemail, setMembEmail] = useState({ value: ''})
    const [benname, setBenName] = useState({ value: ''})
    const [date, setDate] = useState({ value: new Date().toDateString()})
    const [amount, setAmount] = useState({ value: ''})
    const [members,setMembers]=useState([])
    const [memberid,setMemberId]=useState({ value: ''})
    const [rel,setRel]=useState({ value: ''})
    const [status, setStatus]=useState('')
      
    const [beneficiary,setBeneficiary]=useState([])
    const [isLoading,setLoading]=useState(true)
    const [notification, setNotification] = useState(false);
  
    let tokenarray=[];
    
    const sendNotification=async(invno)=>{
      members.map(item=>{
      if (item.token!==undefined) {
      tokenarray.push({
            to: item.token,
            title: 'A case happened ',
            body:benname.value=='Self'?`We have lost ${membname.value}. Check your email.`:`We have lost ${benname.value}. Check your email.`
           
        })
        
      }
      })
       
      const url = 'https://exp.host/--/api/v2/push/send'
      
   
      await axios.post(url,tokenarray)
          .then(res=>console.log(res.data))
          .catch(err=>console.log('there was an error'+err))
   
     
     const mailurl = ''+conn+'/sendmail'
     let mail={
      beneficiary:benname.value,
      relationship:rel.value,
      member: membname.value,
      amount:amount.value,
      invoiceNo:invno
     
     }
     axios.post(mailurl,mail)
     .then(res=>{
       console.log(res.data)
     })
     .catch(err=>console.log(err))
    
    }
    const onSubmit = async() => {
      const membnameError = nameValidator(membname.value)
      const membemailError = emailValidator(membemail.value)
      const bennameError = nameValidator(benname.value)
      const amountError = amountValidator(amount.value)
     
      if(membnameError||membemailError||bennameError||amountError){
          setMembName({ ...membname, error: membnameError })
          setMembEmail({...membemail,error: membemailError})
          setBenName({...benname,error:bennameError})
          setAmount({...amount,error:amountError})
      }else{
      
        let selectedben=beneficiary.filter(item=>{
          return item.beneficiaryname===benname.value})

        const data={
        memberid : memberid.value,
        membername:membname.value,
        beneficiary: selectedben.length!==0?selectedben[0]._id:memberid.value,
        relationship:rel.value,
        beneficiaryname:benname.value,
        amount:amount.value,
        date:date.value
          
        }

        
        const url1=''+conn+'/getBeneficiary/'+benname.value
        

        await axios.get(url1)
        .then(response=>{
          
          setStatus(response.data.status)
                        
        })
        .catch((err)=>console.log(err))

        if (status==='Inactive'){
          alert('Beneficiary already posted')
          return

        }else{
         
       
       const url=''+conn+'/case';
        axios.post(url,data)
        .then((res)=>{
          let value = res.data._id
          sendNotification(value);
          Alert.alert(
            "Post Case",
            "Case Posted,members notified!!",
            [
         
            { 
              text: "OK", 
              onPress: () =>  navigation.replace('DashboardForm') 
            }
            ]
        );   

         })
        .catch(error=>console.log("Error happened: " +error))
         }
   
    }
  
    }
    useEffect(() => {
      
      const url=''+conn+'/getallmembers';
       axios.get(url)
       .then(res=>{
         
         setMembers(res.data)
        
        
        })
       .catch(error=>console.err("Error happened: " +error))
      }, [])

    useEffect(() => {
       
       let selectedmember=members.filter(item=>{
        return item.name===membname.value})

      selectedmember.map(val=>{
         setMembEmail({ value: val.email });
         setMemberId({value:val._id})

      })  
    
      },[membname])

      useEffect(() => {
       
        let selectedben=beneficiary.filter(item=>{
         return item.beneficiaryname===benname.value})
 
       selectedben.map(val=>{
          setRel({ value: val.relationship });
     
       })  
     
       },[benname])
       
      useEffect(() => {
     
     
      const url=''+conn+'/getmember/'+membemail.value;
      
      axios.get(url)
          .then(res=>{
              //console.log(res.data.beneficiary)
              if(res.data.beneficiary){
                 setBeneficiary(res.data.beneficiary)
              }
             setLoading(false)
            
           })
          .catch(error=>console.log("Error happened: " +error))
         },[membemail])

    return(
        <Background>
           <BackButton navigation={navigation} goBack={()=>{
             
            if (navigation.canGoBack())
            navigation.goBack()
            else
            navigation.navigate('DashboardForm')
            }
             } />           
            <Header>Case Form</Header>
          
            <Dropdown
              data={members&&members.map((item)=>(item.name))}
              type='Select member name'  
              onSelect={(selectedItem,index)=>{
                
                  setMembName({value:selectedItem})
              }}
              //error={!!selectedItem.error}
             // errorText={selectedItem.error} 
            
            />
     
            <TextInput
            label="Email"
            returnKeyType="next"
            editable={false}
            value={membemail.value}
            error={!!membemail.error}
            errorText={membemail.error}
            />
            
            {isLoading?<View><Text>Loading beneficiary....</Text></View>:<Dropdown
            
              data={[...beneficiary.map(name=>(
                name.beneficiaryname
            )),'Self']}
              type='Select beneficiary'  
              onSelect={(selectedItem,index)=>{
              if(selectedItem==='Self'){
                setBenName({value:membname.value})
              }else{
                 setBenName({value:selectedItem})
              }
             
              }}
            //   error={!!selectedItem.error}
            //  errorText={selectedItem.error} 
            
            />}
            {benname.value=='Self'?null:<TextInput
            label="Type of relationship"
            returnKeyType="next"
            value={rel.value}
            editable={false}
            />}
       
            <TextInput
            label="Date"
            returnKeyType="next"
            value={date.value}
            onChangeText={(text) => setDate({ value: text })}
            editable={false}
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
            
            <View style={styles.row}>
            <Button
            mode="contained"
            onPress={() => {onSubmit()}}>
            
            Post
            </Button>
            <Button
            mode="contained"
            onPress={() => {

                Alert.alert(
                    "Cancel Case",
                    "Are you sure?",
                    [
                      {
                        text: "Yes",
                        onPress: () =>  navigation.replace('DashboardForm') ,
                        style: "cancel"
                      },
                      {
                        text: "No",
                        onPress: () => {return},
                        style: "cancel"
                      },
                   
                    ]
                  );

            }}
         
            >
            Cancel
            </Button>
          </View>
        </Background>
    )
}

const styles=StyleSheet.create({
        row: {
            alignItems:'center',
            marginTop: 1,
            width:'100%'
          
          },
        
          container: {
            position: 'absolute',
            top: 10 + getStatusBarHeight(),
            left: 4,
          },
          image: {
            width: 24,
            height: 24,
          },
})



