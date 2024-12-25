import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails.js';
import { setUserDetails } from './store/userSlice.js';
import { useDispatch } from 'react-redux';
import { setAllCategory } from './store/productSlice.js';
import Axios from './utils/Axios.js';
import SummaryApi from './common/SummaryApi.js';
import AxiosToastError from './utils/AxiosToastError.js';


function App() {

  const dispatch = useDispatch()


  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    try {

      const response = await Axios({
        ...SummaryApi.getCategory

      })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))


      }
    } catch (error) {
      AxiosToastError(error)


    } finally {

    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
  }, [])

  return (
    <>
      <Header />
      <main className='min-h-[78vh]'>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}

export default App



