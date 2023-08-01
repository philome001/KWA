
import React, { useState,useEffect } from 'react';
import axios from 'axios'
import { Alert,ImageBackground, StyleSheet, Text, View, Switch } from 'react-native';
import TextInput from '../components/TextInput'
import Button from '../components/CardButton';
import Header from '../components/Header'
import {conn} from '../screens/utils/Conn'
import {theme} from '../themes/theme';
import PaymentScreen from './PaymentScreen';

import { colors } from '../colors';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';

const ClearBalance = ({route,navigation}) => {

  const [email, setEmail] = useState('');
  const [amountdue, setAmountdue] = useState('')
  const [conmemberid,setConId]=  useState('')
  const[caseid,setInvId] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(''+conn+'/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        currency: 'usd',
        amountdue
      }),
    });
    const  clientSecret  = await response.json();

    return clientSecret;
  };

  const handlePayPress = async () => {
    // 1. fetch Intent Client Secret from backend
    const clientSecret = await fetchPaymentIntentClientSecret();
    
    // 2. Gather customer billing information (ex. email)
    const billingDetails = {
      email: 'email@stripe.com',
      phone: '+48888000888',
      addressCity: 'Houston',
      addressCountry: 'US',
      addressLine1: '1459  Circle Drive',
      addressLine2: 'Texas',
      addressPostalCode: '77063',
    }; // mocked data for tests
   

    const {paymentIntent,error} = await confirmPayment(clientSecret.clientSecret, {
      type: 'Card',
      billingDetails,
      setupFutureUsage: saveCard ? 'OffSession' : undefined,
    })
   
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log('Payment confirmation error', error.message);
    } else if (paymentIntent) {
      //save paymentIntent to DB
      
      const data={
        paymentId:paymentIntent.id,
        InvNo:caseid,//pass case id from balances
        conmemberid:conmemberid,//loggeduser
        description:paymentIntent.description,
        type:'clearbalance',
        amount:paymentIntent.amount/100,
        amountdue:amountdue,//amount from balances
        balance:parseInt(amountdue)-parseInt(paymentIntent.amount/100),
        date: new Date().toDateString()
          
        }
       
      const url=''+conn+'/contribute';
      await axios.post(url,data)
      .then(res=>console.log(res.data))
      .catch(err=>console.log(err))
      Alert.alert(
       "Success",
      "The payment confirmed successfully!",
        
        [
         
          { 
            text: "OK", 
            onPress: () =>  navigation.replace('DashboardForm') 
          }
        ]
      );
  
 }
  };
  useEffect(() => {

    const {
      conmemberid,
      amountdue,
      InvNo,
      email
   
    } = route.params
  
    setInvId(InvNo)
    setConId(conmemberid)
    setAmountdue(amountdue)
    setEmail(email)

    console.log('Aount due' +amountdue)
  
    }
  ,[])
  


  return (
  <ImageBackground
  source={require('../assets/background_dot.png')}
  resizeMode="repeat"
  style={styles.background}>
  
  <View style={styles.container}>
     
  <PaymentScreen>
      <View>
      <Text style={styles.titleText}>Enter Card Details</Text>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        editable={false}
        value={email}
      />
      <TextInput
        
        placeholder="Amount"
        value={amountdue}
        editable={false}
       
      />
      <CardField
        postalCodeEnabled={false}
        autofocus
        placeholder={{
          number: '4242 4242 4242 4242',
          postalCode: '12345',
          cvc: 'CVC',
          expiration: 'MM|YY',
        }}
        onCardChange={(cardDetails) => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
        cardStyle={styles.cardStyle}
        style={styles.cardField}
      />
      <View style={styles.row}>
        <Switch
          onValueChange={(value) => setSaveCard(value)}
          value={saveCard}
        />
      <Text style={styles.text}>Save card during payment</Text>
      </View>
      <Button
        variant="primary"
        onPress={handlePayPress}
        title="Pay"
        loading={loading}
      />
      </View>
    </PaymentScreen>
   
    
  </View>
  </ImageBackground>
  
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop: 30,
    paddingBottom:50,
    paddingLeft: 10,
    paddingRight:10,  
    justifyContent: 'center',
   
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    marginLeft: 12,
    color:colors.white
  },
  titleText:{
    color:colors.white,
    fontSize:18,
    alignSelf:'center'
  },
  input: {
    height: 44,
    borderBottomColor: colors.slate,
    borderBottomWidth: 1.5,
  },
  cardStyle:{
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: '#000000',
    borderRadius: 8,
    fontSize: 14,
   
  },
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
});


export  default ClearBalance;