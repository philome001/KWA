import { Alert } from 'react-native';
import {conn} from '../screens/utils/Conn'
export async function fetchPublishableKey(){


   try {
    const response = await fetch(
      ''+conn+'/getpublishablekey'
    );

    return response.json();
  } catch (e) {
    console.warn('Unable to fetch publishable key. Is your server running?');
    Alert.alert(
      'Error',
      'Unable to fetch publishable key. Is your server running?'
    );
    return null;
  }

}
 
  

    
 

