import React, { useState,useEffect } from "react";
import Background from '../components/Background';
import axios from 'axios';
import Button from '../components/Button'
import {conn} from '../screens/utils/Conn'
import { ActivityIndicator, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from '../components/Header'


const ShowInvoice=({route,navigation})=>{
   
    const [invoice,setInvoice]=useState([])
    const[total,setTotalInv]=useState('')
    const[loading,setLoading]=useState(true)

    useEffect(() => {
    const {
           user
    } = route.params
    //api call to get invoices
    const url=''+conn+'/getallcases'
   
    axios.get(url)
    .then(res=>{
       
        setInvoice(res.data)
        let totalinv = res.data.map(bill => bill.amount).reduce((acc, bill) => bill + acc);
        setTotalInv(totalinv)
        setLoading(false)
      
    }).catch(err=>{
      alert('You have no invoices')
      navigation.replace('Statements')
    })

  
    },[])
    const ListEmptyComponent=()=>{
        return <View style={{alignSelf:'center'}}><Text>No Contributions</Text></View>
    }
  
    return (
    <View style={{flex:1,paddingVertical:20}}>
    <View style={{flex:1}}>
    <Header>Invoices</Header>
      <SafeAreaView style={styles.container}>
        {loading&&(
        <View style={{paddingVertical:200}}><ActivityIndicator color='blue' size='large'/></View>)}

        {!loading&&(<FlatList
          data={invoice}
          renderItem={({item})=>(
             
              <View style={styles.item}>
               
                <View style={{flexDirection:'row'}}><Text style={styles.textHeading}>InvNo:</Text><Text style={styles.textHeading}>{item._id.substring(0,7)}</Text></View> 
                <View style={{flexDirection:'row'}}><Text style={{color:'#fff'}}>MemberName:</Text><Text style={{color:'#fff'}}>{item.membername}</Text></View>
                <View style={{flexDirection:'row'}}><Text style={{color:'#fff'}}>Affected:</Text><Text style={{color:'#fff'}}>{item.relationship}</Text></View>
                <View style={{flexDirection:'row'}}><Text style={{color:'#fff'}}>Amount due(USD):</Text><Text style={{color:'#fff'}}>{item.amount}</Text></View>
                <View style={{flexDirection:'row'}}><Text style={{color:'#fff'}}>Date:</Text><Text style={{color:'#fff'}}>{item.date.substring(0, 10)}</Text></View>
             </View>
            
          )}
         keyExtractor={(item)=>(item._id)}
         // extraData={''}
        ListEmptyComponent={ListEmptyComponent}
       
        />)}
     
      </SafeAreaView>
    </View>
    {!loading&&(
    <View style={styles.item}>
        <View style={{flexDirection:'row'}}><Text style={styles.textHeading}>Total Invoices:</Text><Text style={styles.textHeading}>{total}</Text></View>
     
    </View>)}
    <View style={{width:'90%',marginHorizontal: 10}}>
    <Button
    mode="contained"
    onPress={() => {
      navigation.replace('Statements')
  
    }}
    >Close</Button>
    </View>
    

    </View>
    
    );
};

export default ShowInvoice

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      //flexDirection:'row',
      padding: 10,
      backgroundColor:'#6002EE',
      marginVertical: 5,
      marginHorizontal: 10,
      borderRadius:10,
      borderColor:'#ddd',
      borderWidth:1,
      width:'90%'
      
    },
    title: {
      fontSize: 32,
    },
    textHeading:{
        fontSize:15,
        fontWeight:'bold',
        marginBottom:5,
        marginRight:5,
        color:'#fff'

    }
  });
