import React, { useState } from 'react'
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';

const verifyEmail = () => {

    const [otp,setOtp] = useState("");
    const dispatch = useDispatch();

    const   {loading} = useSelector((state) => state.auth);


  return (
    <div>

    {
        loading ? (<div className='spinner'></div>) : (
            <div>
                <h1>Verify Email</h1>
                <p> A verification code has been sent to you. Enter the code below</p>
                <form>
                    <OTPInput
                        value=''
                    />
                </form>
            </div>
        )
    }

    </div>
  )
}

export default verifyEmail