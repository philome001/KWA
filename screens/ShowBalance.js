import React, { useState,useEffect } from "react";
import Background from '../components/Background';
import axios from 'axios';
import Button from '../components/Button'
import {conn} from '../screens/utils/Conn'
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from '../components/Header'


const ShowBalance=({route,navigation})=>{
   
    const [contributions,setContribution]=useState([])
    const [totalbal,setTotalBal]=useState()
    const[loading,setLoading]=useState(true)
    const[loggeduser,setUser]=useState('')

    useEffect(() => {
    const {
           user
    } = route.params
    setUser(user)
    //api call to getUserContribution
    const url=''+conn+'/getbalance/'+user._id
    axios.get(url)
    .then(res=>{
        setContribution(res.data.result)
        setTotalBal(res.data.totalbal)
        
        setLoading(false)
    }).catch(err=>{
      alert('You have no balances')
      navigation.replace('Statements')
    })

  
    },[])
    const ListEmptyComponent=()=>{
        return <View style={{alignSelf:'center'}}><Text>No Balances</Text></View>
    }
  
    return (
    <View style={{flex:1,paddingVertical:20}}>
    <View style={{flex:1}}>
    <Header>Balances</Header>
      <SafeAreaView style={styles.container}>
        {loading&&(
        <View style={{paddingVertical:200}}><ActivityIndicator color='blue' size='large'/></View>)}

        {!loading&&(<FlatList
          data={contributions}
          renderItem={({item})=>(
             <TouchableOpacity onPress={()=>navigation.navigate('ClearBalance',{
              conmemberid:loggeduser._id,
              amountdue:item.balance,
              InvNo:item.InvNo,
              email:loggeduser.email
             })}>
              <View style={styles.item}>
                <View style={{flexDirection:'row'}}><Text style={styles.textHeading}>InvNo:</Text><Text style={styles.textHeading}>{item.InvNo.substring(0,7)}</Text></View> 
                <View style={{flexDirection:'row'}}><Text style={{color:'#fff'}}>Balance(USD):</Text><Text style={{color:'#fff'}}>{item.balance}</Text></View>
              </View>
            </TouchableOpacity>
          )}
         keyExtractor={(item)=>(item._id)}
         // extraData={''}
        ListEmptyComponent={ListEmptyComponent}
        //ListFooterComponent={<View style={{height:10}}></View>}
        />)}
     
      </SafeAreaView>
    </View>
    {!loading&&(
    <View style={styles.item}>
  
        <View style={{flexDirection:'row'}}><Text style={styles.textHeading}>Total Balances:</Text><Text style={styles.textHeading}>{totalbal[0].balance}</Text></View>
        
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

export default ShowBalance

  
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
