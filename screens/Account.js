import React, { PureComponent } from 'react'
import Background from '../components/Background'
import {StyleSheet ,Pressable,View,ActivityIndicator,Text} from 'react-native';
import axios from 'axios';
import { theme } from '../themes/theme'
import {conn} from '../screens/utils/Conn'


class Step extends PureComponent{
     
    render(){
     
    return(
        
    <View>
      <View>
       
       {this.props.children}
      
      </View>
      <View style={styles.row}>
       
      {this.props.currentIndex!==0&&<Pressable
         style={styles.button}
         onPress={this.props.prevStep}
         
        ><Text style={styles.text}>Prev</Text></Pressable>}
        {this.props.isLast?(
            <Pressable 
            style={styles.button}  
            onPress={this.props.onSubmit}
           ><Text style={styles.text}>Submit</Text></Pressable>

        ):(
            <Pressable   
            disabled={this.props.isLast}
            style={styles.button}
            onPress={this.props.nextStep}
           ><Text style={styles.text}>Next</Text></Pressable>  
        )}
         
      </View> 
    </View>  
    ) 
    }
   
    
}

class Account extends PureComponent{
    static Step=(props)=><Step{...props}/>
    
    state={
            index:0,
            loading:false

    }
    _nextStep=()=>{
        if(this.state.index!==this.props.children.length-1){
           this.setState(prevState=>({
            index:prevState.index+1
        })) 
            
        }
    }
    _prevStep=()=>{
        if(this.state.index!==0){
           this.setState(prevState=>({
            index:prevState.index-1
        })) 
            
        }
      
    }
  
    onSubmit=()=>{
   
     this.setState({
         loading:true
     })
     
        const {
          
            ssn,
            accountName,
            Day,
            Month,
            Year,
            phone,
            address1,
            postcode,
            State,
            country,
            currency,
            account_holder_type,
            routing_number,
            bank_account_number
             
       
        }=this.props

        const data={
            country:country,
            business_type:account_holder_type,
            accountName:accountName,
            ssn:ssn,
            Day:Day,
            Month:Month,
            Year:Year,
            address1:address1,
            postcode:postcode,
            State:State,
            currency:currency,
            routing_number:routing_number, 
            phone:phone,
            bank_account_number:bank_account_number

        }
        if(Day==''||Month==''||Year==''){
            alert('Please enter Day,Month and Year born')
            this.setState({
                loading:false
            })
            return
        }else{
        const url1=''+conn+'/create-account'
                        
        axios.post(url1,data)
        .then(res=>{
         
        if(res.data.success==false){
            alert('Account could not be created')
            this.setState({
                  loading:false
              })
            

        }else{
            alert('Account created Successfully')
            this.setState({
                  loading:false
            })
            this.props.navigation.replace('DisburseFunds',{
                membername:accountName
            })
          
        }
       
        })
    

        }

        
    }
    render(){
   
    return(
              
       <View>
                     
        {React.Children.map(this.props.children,(element,index)=>{
                if(index=== this.state.index){
                    return React.cloneElement(element,{
                        currentIndex:this.state.index,
                        nextStep:this._nextStep,
                        prevStep:this._prevStep,
                        onSubmit:this.onSubmit,
                        values:this.state.values,
                        isLast: this.state.index===this.props.children.length-1,
                      
                    })
                }
                return null
            })}
         
            {this.state.loading&&<View style={styles.loading}><ActivityIndicator size="large" color="#0000ff" /></View>}
         
         </View>
      
        
    )
    }
    

}

export default Account
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
    
    },
    row:{
        
        flexDirection:"row",
        justifyContent:'center',
        alignSelf:'center',
        width:"50%",
        margin:10
    },
    button:{
        
        flexDirection:"row",
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
        margin:5,
        elevation: 3,
        width:"70%",
        backgroundColor: theme.colors.primary,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
      loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }

})

