import React,{useState, useEffect, useRef} from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Beneficiary from '../screens/Beneficiary';
import PurchaseProduct from '../screens/PurchaseProduct';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardForm from '../screens/DashboardForm';
import Case from '../screens/Case';
import Contribute from '../screens/Contribute';
import DisburseFunds from '../screens/DisburseFunds';
import Statements from '../screens/Statements';
import Admin from '../screens/Admin';
import ShowContribution from '../screens/ShowContribution';
import ShowInvoice from '../screens/ShowInvoice';
import ShowBalance from '../screens/ShowBalance';
import ClearBalance from '../screens/ClearBalance';
import AuthLoading from '../screens/AuthLoading';
import Account_Details from '../screens/Account_Details';
import Account from '../screens/Account';
import NewPassword from '../screens/NewPassword';
import ResetPasswordScreen from '../screens/ResetPasswordScreen'
import UpdateScreen from '../screens/UpdateScreen'
const BeforeStack = createNativeStackNavigator();
const AfterStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const BeforeSignin=()=>{
  return(
  
    <BeforeStack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerShown: false
    }}>
    <BeforeStack.Screen name="Login" component={Login}/>
    <BeforeStack.Screen name="RegisterScreen" component={RegisterScreen}/>
    <BeforeStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>
    <BeforeStack.Screen name="NewPassword" component={NewPassword}/>
    </BeforeStack.Navigator>
 
  )
}

const AfterSignin=()=>{
  return(
 
  <AfterStack.Navigator
  initialRouteName="DashboardForm"
  screenOptions={{
    headerShown: false
  }}>
 
  <AfterStack.Screen name="Beneficiary" component={Beneficiary}/>
  <AfterStack.Screen name="DashboardForm" component={DashboardForm}/>
  <AfterStack.Screen name="Case" component={Case} />
  <AfterStack.Screen name="Contribute" component={Contribute} />
  <AfterStack.Screen name="DisburseFunds" component={DisburseFunds} />
  <AfterStack.Screen name="Account_Details" component={Account_Details} />
  <AfterStack.Screen name="Account" component={Account}/>
  <AfterStack.Screen name="PurchaseProduct" component={PurchaseProduct} />
  <AfterStack.Screen name="Statements" component={Statements} /> 
  <AfterStack.Screen name="ShowInvoice" component={ShowInvoice} />
  <AfterStack.Screen name="ShowContribution" component={ShowContribution} />
  <AfterStack.Screen name="ShowBalance" component={ShowBalance} />
  <AfterStack.Screen name="ClearBalance" component={ClearBalance} />
  <AfterStack.Screen name="Admin" component={Admin} /> 
  <AfterStack.Screen name="UpdateScreen" component={UpdateScreen} />
  </AfterStack.Navigator>

  )
}

export default  AppMain = ()=>{

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return(
  <NavigationContainer>
  <AppStack.Navigator
  initialRouteName="AuthLoading"
  screenOptions={{
    headerShown: false
  }}>
  <AppStack.Screen name="Auth" component={BeforeSignin}/>
  <AppStack.Screen name="App" component={AfterSignin}/>
  <AppStack.Screen name="AuthLoading" component={AuthLoading}/>
  
  </AppStack.Navigator>
</NavigationContainer>
  )

}




