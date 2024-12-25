import React, { useEffect, useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [data, setData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    })
    const valideValue = Object.values(data).every(el => el)
    const handleChange = (e) => {
        const { name, value } = e.target
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (data.newPassword !== data.confirmPassword) {
            toast.error('New Password and Confirm Password not match')
        }
        try {
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data: data
            })
            if (response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success(response.data.message)
                navigate('/login')
                setData({
                    email: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate('/login')
        }
        if (location?.state?.email) {
            setData((preve) => {
                return {
                    ...preve,
                    email: location?.state?.email
                }
            })
        }
    }, [])
    return (
        <section className=' w-full container mx-auto px-2' >
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg'>Enter Your New Password</p>
                <form className=' grid gap-4  py-4' onSubmit={handleSubmit}>
                    <div className=' grid gap-1'>
                        <label htmlFor='password'>New Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id='newPassword'
                                name='newPassword'
                                className='w-full outline-none'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Enter your New Password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className=' cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className=' grid gap-1'>
                        <label htmlFor='confirmPassword'>Confirm Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id='confirmPassword'
                                name='confirmPassword'
                                className='w-full outline-none'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirmPassword'
                            />
                            <div onClick={() => setShowConfirmPassword(preve => !preve)} className=' cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>Change Password</button>
                </form>
            </div >
        </section >
    )
}
export default ResetPassword