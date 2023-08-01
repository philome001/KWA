import React from 'react'
import {  StyleSheet, KeyboardAvoidingView,Platform } from 'react-native'

export default function KeyboardAvoiding({children}){
    return (
        <KeyboardAvoidingView style= {styles.container} behavior={Platform.OS === "ios" ? "padding" :null} keyboardVerticalOffset={100}>
            {children}
        </KeyboardAvoidingView>
    )
}
const styles= StyleSheet.create({
    
        container: {
            flex: 1,
            padding: 20,
            width: '100%',
            maxWidth: 340,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
    
})