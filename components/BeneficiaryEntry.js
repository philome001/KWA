import React from 'react'
import Card from '../components/Card'
import { StyleSheet, TouchableOpacity,TouchableWithoutFeedback,Text,View,Alert} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
export default function({item,pressHandler,setmodal}){
    return (
        
        <TouchableOpacity onPress={()=>{
            Alert.alert(
                "Remove Beneficiary",
                "Are you sure?",
                [
                  {
                    text: "Cancel",
                    onPress: () =>setmodal(false),
                    style: "cancel"
                    //insert the record at this point
                  },
                  { text: "OK", onPress: () => {
                      pressHandler(item.beneficiaryname)
                    

                    }
                     }
                ]
              );
            }}>
           
            <Card>
            <View style={styles.item}>
                <MaterialIcons name="delete" size={24} color='grey' />
           
            <Text style={styles.itemtext}>
            {item.beneficiaryname}
            </Text>
            </View>
            </Card>
           
        </TouchableOpacity>
       
    )
}
const styles = StyleSheet.create({
    item:{
        padding:5,
        marginTop:6,
        flexDirection:'row',
        width:'100%',
        alignItems:'center'
        
        
    },
    itemtext:{
        marginLeft:10,
        fontSize:20,
        fontWeight:'bold',
     
        
    }
})

