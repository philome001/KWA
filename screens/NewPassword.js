import React, { useState } from 'react'
import axios from 'axios';
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import {conn} from '../screens/utils/Conn'
import { passwordValidator } from '../helpers/passwordValidator'

export default function NewPassword() {
  const [password, setPassword] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = () => {
    const passwordError = passwordValidator(password.value)
    if (passwordError) {
      setPassword({ ...password, error: passwordError })
      return
    }
    //reset email endpoint
   
    const url=''+conn+'/resetpassword/';
    axios.post(url,{password:password.value})
    .then(res=>{
      alert(res.data.message);
   
    }).catch(err=>{
      alert("No such email exists")
      return
    })

  }

  return (
    <div>
      <div className='card'>
        <h2>New password</h2>
        <input 
        type='text'
        placeholder='Enter new password'
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
                
        />
        <button className='btn' onClick={()=>sendResetPasswordEmail()}></button>
       
   </div>
    </div>
   
  )
}
