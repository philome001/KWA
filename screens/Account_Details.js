import React,{useState,useEffect} from 'react'
import Background from '../components/Background'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Account from './Account'
import axios from 'axios';
import BackButton from '../components/BackButton'
import Dropdown from '../components/Dropdown'
import {StyleSheet ,Text, View,ScrollView} from 'react-native';
import {conn} from '../screens/utils/Conn'


export default  Account_Details=({navigation})=>{
    const [amount, setAmount] = useState({ value: ''})
    const [caseload,setCaseload]=  useState([])
    const [membname, setMembName] = useState({ value: '' })
    const[caseid,setCaseId] = useState({value:''});
    const [Day, setDay] = useState({ value:''})
    const [Month, setMonth] = useState({ value: ''})
    const [Year, setYear] = useState({ value: ''})
    const [ssn, setSSN] = useState({ value:'0000'})
    const [phone, setPhone] = useState({ value: '855-030-4463'})
    const [address1, setAddr] = useState({ value: '3275 NW 24th Street Rd'})
    const [postcode, setPostcode] = useState({ value: '33124'})
    const [city, setCity] = useState({ value: 'Miami'})
    const [State, setState] = useState({ value: 'FL'})
    const [country, setCountry] = useState({ value: 'US'})
    const [currency, setCurrency] = useState({ value: 'usd'})
    const [routingno, setRoutingno] = useState({ value: '110000000'})
    const [account_type, setAccount_type] = useState({ value: 'individual'})
    const [account_number, setAccount_number] = useState({ value: '000123456789'})

    useEffect(() => {
       
      let selectedmem=  caseload.filter(item=>{
        return item.membername===membname.value});
      if(selectedmem.length!==0){
      
       setCaseId({value:selectedmem[0]._id}) 
      } 

     },[membname])  
    useEffect(() => {
   
        const url=''+conn+'/getallcases';
        axios.get(url)
       .then(res=>{
        
       setCaseload(res.data)
       
     
        })
        
       .catch(error=>console.log("Error happened: " +error))
      }, [])
    return(
       
      <Background>
        <BackButton goBack={()=>{
     
          if (navigation.canGoBack())
          navigation.goBack()
          else
          navigation.navigate('DashboardForm')
      
          }} />
          <Account 
          //all props here
          
            // token:'',
            navigation={navigation}
            ssn={ssn.value}
            accountName={membname.value}
            Day= {Day.value}
            Month={Month.value}
            Year={Year.value}
            phone={phone.value}
            address1={address1.value}
            postcode={postcode.value}
            State={State.value}
            country={country.value}
            currency={currency.value}
            account_holder_type={account_type.value}
            routing_number={routingno.value}
            bank_account_number={account_number.value}
           


         >
          <Account.Step>
         
          <Header>Personal Info</Header>
         
          <View style={styles.container}>
         
            <Dropdown
              data={caseload&&caseload.map(item=>item.membername)}
              type='Select Member...'  
              onSelect={(selectedItem,index)=>{
              setMembName({value:selectedItem})
            
              
              }}
          
          
              //error={!!selectedItem.error}
             // errorText={selectedItem.error} 
            
            />
            <Text style={{alignSelf:'flex-start'}}>BirthDay</Text>
            <View style={styles.row}>
            
            <TextInput
            label="Day"
            returnKeyType="next"
            value={Day.value}
            onChangeText={(text) => setDay({value : text})}
           
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            style={{marginRight:5}}
           
            />
            
            
            <TextInput
            label="Month"
            returnKeyType="next"
            value={Month.value}
            onChangeText={(text) => setMonth({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            style={{marginRight:5}}
            />
            <TextInput
            label="Year"
            returnKeyType="next"
            value={Year.value}
            onChangeText={(text) => setYear({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            />
            </View>
          
            <TextInput
            label="SSN"
            returnKeyType="next"
            value={ssn.value}
            onChangeText={(text) => setSSN({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            />
            <TextInput
            label="Phone"
            returnKeyType="next"
            value={phone.value}
            onChangeText={(text) => setPhone({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            />
            <TextInput
            label="Address1"
            returnKeyType="next"
            value={address1.value}
            onChangeText={(text) => setAddr({ value: text })}
            keyboardType="text"
            error={!!amount.error}
            errorText={amount.error}
            />
            <TextInput
            label="Postal Code"
            returnKeyType="next"
            value={postcode.value}
            onChangeText={(text) => setPostcode({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            />
            <TextInput
            label="State Code"
            returnKeyType="next"
            value={State.value}
            onChangeText={(text) => setState({ value: text })}
            keyboardType="text"
            error={!!amount.error}
            errorText={amount.error}
            />
          
          </View>
        
          </Account.Step>
          
        
          <Account.Step>
          
          <Header>Account Infomation</Header>
          <View >
          <TextInput
            label="Country"
            returnKeyType="next"
            value={country.value}
            onChangeText={(text) => setCountry({ value: text })}
            keyboardType="text"
            error={!!amount.error}
            errorText={amount.error}
            />
             <TextInput
            label="Currency"
            returnKeyType="next"
            value={currency.value}
            onChangeText={(text) => setCurrency({ value: text })}
            keyboardType="text"
            error={!!amount.error}
            errorText={amount.error}
            />
             <TextInput
            label="Account_holder_type"
            returnKeyType="next"
            value={account_type.value}
            onChangeText={(text) => setAccount_type({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            />
             <TextInput
            label="Routing Number"
            returnKeyType="next"
            value={routingno.value}
            onChangeText={(text) => setRoutingno({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            />
              <TextInput
            label="Account Number"
            returnKeyType="next"
            value={account_number.value}
            onChangeText={(text) => setAccount_number({ value: text })}
            keyboardType="numeric"
            error={!!amount.error}
            errorText={amount.error}
            />
          </View>
          </Account.Step>
         
          </Account>
        </Background>
    
    )
}
const styles=StyleSheet.create({
    container:{
      width:'70%',
      
      alignSelf:'center'
    },
    row: {
            
      flexDirection:'row',
      width:'30%'
    },
 
})