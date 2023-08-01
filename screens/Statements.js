import React,{useState,useEffect} from 'react'
import { Pressable,StyleSheet,Platform, View,TouchableOpacity,Text,Image } from 'react-native'
import Button from '../components/Button'
import Background from '../components/Background'

import Header from '../components/Header'
import TextInput from '../components/TextInput'
import {conn} from '../screens/utils/Conn'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import  DateTimePicker  from '@react-native-community/datetimepicker';
import * as Print from "expo-print";
import { Asset } from 'expo-asset';
import { manipulateAsync } from 'expo-image-manipulator';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import Moment from 'moment';



export default function Statements({navigation}){

    const [loggeduser,setLogged]=  useState('')
    const [from,setFrom]=  useState('')
    const [date,setDate]=  useState(new Date())
    const [date2,setDate2]=  useState(new Date())
    const [to,setTo]=  useState('')
    const [showPicker,setShowPicker]=  useState(false)
    const [showPicker2,setShowPicker2]=  useState(false)
    const [mycontrib,setMyContrib]=useState([])
    const [mybal,setMyBal]=useState([])


const generatePDF=async()=>{
    let totalcont=''
    let mybaltot=''
    let totInv=[]
    let result='';
    let Invs=[]
    
    let MembNo='';

    const url = ''+conn+'/memberstatement';
    const info={
        to:to,
        from:from,
        user:loggeduser._id
    }

      await axios.post(url,info)
                .then(res=>{
                            
                        result=res.data
                            
                        MembNo = loggeduser.membNo          
                        
                        totInv=result.filter(item=>item._id==='cases')
                      
    
                    
                }).catch(err=>console.log(err));
   
    if(mycontrib.length!==0){
        totalcont = mycontrib.map(bill => bill.amount).reduce((acc, bill) => bill + acc)
    }else{
       totalcont=0
    }
    if(mybal.length!==0){
        mybaltot = mybal.map(bill=>bill.amount).reduce((acc,bill)=>bill+acc)
      }else{
       mybaltot=0;
      }
      let totalpay = totInv.map(bill => bill.amount).reduce((acc, bill) => bill + acc);

      let contrib = result.filter(item=>item._id!=='cases')

      if(contrib.length===0){
        alert('No contributions for that period')
        return
        
      
      }
      let bal = parseInt(totalpay)+ parseInt(mybaltot)- parseInt(totalcont)
    
    let res = Object.values(totInv)
    
    const asset = Asset.fromModule(require('../assets/yaralogo.png'));
    const image = await manipulateAsync(asset.localUri ?? asset.uri, [], { base64: true });
    
    const html=
    `<html><head></head><body>
    <center><img src="data:image/jpeg;base64,${image.base64}" style="width: 35vw;" /></center>
    <center><h3>Member No.${MembNo}</h3></center>
    <h3>Total Invoices(USD): ${totalpay}</h3>
    <h3>Total Contributions(USD): ${totalcont}</h3>
    <h3>Total Balance(USD): ${bal}</h3>
    <center><table border="1" style="width:80%">
    <th>Beneficiary Name</th><th>Invoice Date</th><th>Invoice Amount</th>
    ${res.map(val=>`<tr><td>${val.membername}</td><td>${Moment(val.date).format('YYYY-MM-DD')}</td><td>${val.amount}</td></tr>`)}
    
    </table></center>
    <br>
    <h4>Balances</h4>
    <center><table border="1" style="width:80%">
    
    <th>Amount</th><th>Type</th>
    ${mybal.map(val=>`<tr><td>${val.amount}</td><td>${val.type}</td></tr>`)}
    
    </table></center>
    <br>
    <h4>Contributions from ${Moment(from).format('YYYY-MM-DD')} to ${Moment(to).format('YYYY-MM-DD')}</h4>
    <center><table border="1" style="width:80%">
    
    <th>Beneficiary Name</th><th>Amount Paid</th><th>Date</th>
    ${contrib.map(val=>`<tr><td>${val.beneficiaryname}</td><td>${val.amount}</td><td>${Moment(val.date).format('YYYY-MM-DD')}</td></tr>`)}
    
    </table></center>
    
    </body></html>`
        const {uri}=await Print.printAsync({
        orientation:Print.Orientation.portrait,
        html:html,
       

    })
    try{
    if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      } else {
        const permission = await MediaLibrary.requestPermissionsAsync();
  
        if (permission.granted) {
          await MediaLibrary.createAssetAsync(uri);
        }
      }
  
    } catch (error) {
      console.error(error);
    }

}

const statementHandler=()=>{
       
        if(new Date(to).getTime()<new Date(from).getTime()){
            alert('Pick a date after '+from)
        }else{
         generatePDF();
        }

        
        //navigation.replace('DashboardForm')
    }
    const confirmIOSDate=()=>{
        setFrom(date.toDateString())
        toggleDatepicker()
    }
    const confirmIOSDate2=()=>{
        setTo(date2.toDateString())
        toggleDatepicker2()
    }
    const toggleDatepicker=()=>{
        setShowPicker(!showPicker)
    }
    const toggleDatepicker2=()=>{
        setShowPicker2(!showPicker2)
    }
    const dateChange=({type},selectedDate)=>{
      
            if(type==='set'){
                const currentDate=selectedDate
                setDate(currentDate)
                if (Platform.OS === 'android') {
                    toggleDatepicker();
                    setFrom(currentDate.toDateString())
                  
                  
                  }

            }else{
                toggleDatepicker()
            }
      
    }
    const dateToChange=({type},selectedDate)=>{
        if(type==='set'){
            const currentDate=selectedDate
           
            setDate2(currentDate)
            if (Platform.OS === 'android') {
               
                toggleDatepicker2();
                setTo(currentDate.toDateString())
              
              }

        }else{
            toggleDatepicker2()
        }
       

    

}
    const user=async()=>{
        await AsyncStorage.getItem('user').then((item) => {
           const val=JSON.parse(item)
           setLogged(val)
         })
         .catch(err=>{console.log(err)});
     }

    useEffect(() => {
        user()
    },[])
    useEffect(()=>{
        
    if(loggeduser._id){
        const url2 = ''+conn+'/getcontribution/'+loggeduser._id;
        
        axios.get(url2)
        .then((res)=>{
          setMyContrib(res.data.result)
     
                 
        }); 
    }
       
       


    },[loggeduser])
    useEffect(()=>{
        if(loggeduser._id){
        const url3 = ''+conn+'/showbalance/'+loggeduser._id;
        
        axios.get(url3)
        .then((res)=>{
          setMyBal(res.data.result)
               
        });

        }
       

    },[mycontrib])

    
    return(
        <Background>
            <BackButton goBack={()=>{
     
                if (navigation.canGoBack())
                navigation.goBack()
                else
                navigation.navigate('DashboardForm')
 
            }} />
            <Header>Statements</Header>
            <View style={styles.container}>
            
            <View>
            {showPicker&&(
                 <DateTimePicker
                 mode='date'
                 display='spinner'
                 value={date}
                 onChange={dateChange}
             />
            )}
            {showPicker&&Platform.OS==='ios'&&(
            <View
            style={{flexDirection:'row',justifyContent:'space-around'}}
            >
                <TouchableOpacity style={[
                    styles.button,
                    styles.pickerButton,
                    {backgroundColor:'#11182711'}
                ]} onPress={toggleDatepicker}>
                    <Text style={[
                        styles.buttonText,
                        {color:'#075985'}
                    ]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    styles.button,
                    styles.pickerButton,
                    {backgroundColor:'#11182711'}
                    
                ]} onPress={confirmIOSDate}>
                    <Text style={[
                        styles.buttonText,
                        {color:'#075985'}
                    ]}>Confirm</Text>
                </TouchableOpacity>
            </View>
             
            )}
           
            
            <Pressable
                 onPress={toggleDatepicker}
                >
                 <TextInput
                     label="From"
                     returnKeyType="done"
                     value={from}
                     onChangeText={from}
                     error={!!from.error}
                     errorText={from.error}
                     editable={false}
                     onPressIn={toggleDatepicker}
                    
                     />
            </Pressable>
            {showPicker2&&(
                 <DateTimePicker
                 mode='date'
                 display='spinner'
                 value={date2}
                 onChange={dateToChange}
             />
            )}
            {showPicker2&&Platform.OS==='ios'&&(
            <View
            style={{flexDirection:'row',justifyContent:'space-around'}}
            >
                <TouchableOpacity style={[
                    styles.button,
                    styles.pickerButton,
                    {backgroundColor:'#11182711'}
                ]} onPress={toggleDatepicker2}>
                    <Text style={[
                        styles.buttonText,
                        {color:'#075985'}
                    ]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    styles.button,
                    styles.pickerButton,
                    {backgroundColor:'#11182711'}
                    
                ]} onPress={confirmIOSDate2}>
                    <Text style={[
                        styles.buttonText,
                        {color:'#075985'}
                    ]}>Confirm</Text>
                </TouchableOpacity>
            </View>
             
            )}

            <Pressable onPress={toggleDatepicker2} >            
                <TextInput
                label="To"
                returnKeyType="done"
                value={to}
                onChangeText={to}
                error={!!to.error}
                errorText={to.error}
                editable={false}
                onPressIn={toggleDatepicker2}
               
            />
            </Pressable>

         
            
            <Button 
                mode='contained'
                onPress={statementHandler}>
                Download 
            </Button>
            
            </View>
            </View>
        </Background>

    )
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        marginTop:50
    },
    buttonstyle:{
        margin:10
    },
    datePicker:{
        height:120,
        marginTop:-10
    },
    pickerButton:{
        paddingHorizontal:20
    },
    buttonText:{
        fontSize:14,
        fontWeight:'500',
        color:'#fff'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#AD436D',
        height: 40,
        borderRadius:5,
        width: 100,
        marginTop: 10,
        justifyContent: 'center',
      },


})