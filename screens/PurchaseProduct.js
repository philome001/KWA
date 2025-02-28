
import React, { useState,useEffect } from 'react';
import axios from 'axios'
import { Alert,ImageBackground, StyleSheet, Text, View, Switch } from 'react-native';
import TextInput from '../components/TextInput'
import Button from '../components/CardButton';
import Header from '../components/Header'
import {conn} from '../screens/utils/Conn'
import {theme} from '../themes/theme';
import PaymentScreen from './PaymentScreen';
import { fetchPublishableKey } from '../helpers/fetchPublishableKey';
import { colors } from '../colors';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { PlatformPayButton, usePlatformPay,PlatformPay,StripeProvider } from '@stripe/stripe-react-native';


const PurchaseProduct = ({route,navigation}) => {

  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const [amountdue, setAmountdue] = useState('')
  const [balance, setBal] = useState('')
  
  const [conmemberid,setConId]=  useState('')
  const[benid,setBenMembId] = useState('');
  const[beneficiaryname,setBenName] = useState('');
  const[caseid,setCaseId] = useState('');
  const [publishableKey, setPublishableKey] = useState('');
  const {isPlatformPaySupported,confirmPlatformPayPayment}=usePlatformPay();
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
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
        amount
      }),
    });
    const  clientSecret  = await response.json();

    return clientSecret;
  };

  const handlePayPress = async () => {
    // 1. fetch Intent Client Secret from backend
    const clientSecret = await fetchPaymentIntentClientSecret();
    
    // 2. Gather customer billing information (ex. email)
   //optional billing details    
    const {paymentIntent,error} = await confirmPayment(clientSecret.clientSecret, {
      paymentMethodType: 'Card',
      //optional billing details
      setupFutureUsage: saveCard ? 'OffSession' : undefined,
    })
   
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log('Payment confirmation error', error.message);
    } else if (paymentIntent) {
      //save paymentIntent to DB
      
      const data={
        paymentId:paymentIntent.id,
        InvNo:caseid,
        conmemberid:conmemberid,
        description:paymentIntent.description,
        benmemberid: benid,
        amount:paymentIntent.amount/100,
        amountdue:amountdue,
        balance:balance,
        beneficiaryname:beneficiaryname,
        email:email,
        date: new Date().toDateString()
          
        }
        
      const url=''+conn+'/contribute';
      await axios.post(url,data)
      .then(res=>{
        
        if(res){
          alert("The payment confirmed successfully!");
                  navigation.replace('DashboardForm'); 
        }
      })
      .catch(err=>console.log(err))
     
      
    }
  };


  const pay = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret()
        
    const { paymentIntent,error } = await confirmPlatformPayPayment(
      clientSecret,
      {
        applePay: {
          cartItems: [
            {
              label: 'Donation amount',
              amount: amount,
              paymentType: PlatformPay.PaymentType.Immediate,
            },
            {
              label: 'Total',
              amount: amount,
              paymentType: PlatformPay.PaymentType.Immediate,
            },
          ],
          merchantCountryCode: 'US',
          currencyCode: 'USD',
         
        },
      }
    );
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log('Payment confirmation error', error.message);
    } else {
      //Alert.alert('Success', 'Check the logs for payment intent details.');
      //console.log(JSON.stringify(paymentIntent, null, 2));
      const data={
        paymentId:paymentIntent.id,
        InvNo:caseid,
        conmemberid:conmemberid,
        description:paymentIntent.description,
        benmemberid: benid,
        amount:paymentIntent.amount/100,
        amountdue:amountdue,
        balance:balance,
        beneficiaryname:beneficiaryname,
        email:email,
        date: new Date().toDateString()
          
        }
        
      const url=''+conn+'/contribute';
      await axios.post(url,data)
      .then(res=>{
        
        if(res){
          alert("The payment confirmed successfully!");
                  navigation.replace('DashboardForm'); 
        }
      })
      .catch(err=>alert(err.message))
     
    }
  };
  useEffect(() => {
    
    const {
      amount_pd,
      email,
      conmemberid,
      benid,
      amountdue,
      caseid,
      balance,
      beneficiaryname,
    
    } = route.params
    setAmount(amount_pd.toString())
    setEmail(email)
    setCaseId(caseid)
    setBal(balance)
    setConId(conmemberid)
    setBenMembId(benid)
    setBenName(beneficiaryname)
    setAmountdue(amountdue)
    
    }
  ,[])

  // useEffect(() => {
  //   (async function () {
      
  //     const res = await isPlatformPaySupported()
  //     setIsApplePaySupported(res);
  //     console.log('Apple support is '+res)
    
  //   })();
    
  // }, [isApplePaySupported]); 2nd comment
  
  // useEffect(() => {
  //   async function initialize() {
  //     const data = await fetchPublishableKey();
  //     const publishableKey = data.key;
  //     setPublishableKey(publishableKey)

  //    }
  //    initialize();
   
  // }, []); 1st comment 
  

  return (
  <ImageBackground
  source={require('../assets/background_dot.png')}
  resizeMode="repeat"
  style={styles.background}>
  
  <View style={styles.container}>
     
 <PaymentScreen>
  {/* {isApplePaySupported ?<View>
    <StripeProvider merchantIdentifier='merchant.com.philome.KWA' publishableKey={publishableKey}> 
      (
        <PlatformPayButton
          onPress={pay}
          type={PlatformPay.ButtonType.Pay}
          appearance={PlatformPay.ButtonStyle.Black}
          borderRadius={4}
          style={{
            width: '100%',
            height: 50,
          }}
        />
      )
    </StripeProvider>
    </View>:
     Alert.alert(
      'Appe Pay Alert',
      'Apple Pay not supported,check if card is properly loaded!!',
      [
      
        
        {text: 'OK', onPress: ()=>{navigation.replace('Contribute')},
        style:"cancel"
        },
      

      ],
     
    ) */}
  
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
        value={amount}
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
    {/*}*/}
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


export  default PurchaseProduct;