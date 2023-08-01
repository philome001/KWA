import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { theme } from '../themes/theme'
import FontAwesome from 'react-native-vector-icons/Ionicons'
import SelectDropdown from 'react-native-select-dropdown'

export default function Dropdown({ errorText, description,data,type,...props }) {
  return (
    <View >
        <SelectDropdown
              
              defaultButtonText={type}
              buttonStyle={styles.dropdownbuttonstyle}
              buttonTextStyle={styles.dropdowntextstyle}
              data={data}
              rowTextStyle={{fontSize:25}}
              renderDropdownIcon={()=>{
                return(<FontAwesome 
                  name='chevron-down' 
                  color={'#444'} 
                  size={18} 
                                  
                />)
              }}
              {...props}
              dropdownIconPosition={'right'}
             
              buttonTextAfterSelection={(selectedItem,index)=>{
                  return(selectedItem )                 
              }}
              rowTextForSelection={(item,index)=>{
                  return item
              }}
                       
        />
            {description && !errorText ? (
            <Text style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
  dropdownbuttonstyle:{
            
    width:'100%',
    height:60,
    marginTop:8,
    marginBottom:8,
    backgroundColor:theme.colors.surface,
    borderRadius:8,
    borderWidth:1,
    borderColor:theme.colors.secondary

   },
   dropdowntextstyle: {
     
   color:theme.colors.secondary,
   fontSize: 24,
   color:'black',
   textAlign:'left',
    
   },


})
