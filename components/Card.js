import React from 'react'

import { StyleSheet, TouchableOpacity,Text,View} from 'react-native'

export default function Card({children}){
    return(
        <View style={styles.card}>
            <View style={styles.cardcontent}>
            {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        borderRadius:3,
        elevation:5,
        backgroundColor:'#fff',
        shadowColor:'black',
        shadowOpacity:0.3,
        //textShadowOffset:{width:1,height:1},
        shadowRadius:4,
        marginHorizontal:6,
        marginVertical:4
    },
    cardcontent:{
        marginHorizontal:3,
        marginVertical:6
    }
})  