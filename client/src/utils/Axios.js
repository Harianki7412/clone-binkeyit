import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi.js";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

Axios.interceptors.request.use(
    (response) => {
        return response
    },
    async (error) => {
        let originalRequest = error.config

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem('refreshToken')

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken)

                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originalRequest)

                }
            }
        }
        return Promise.reject(error)
    }
)

const refreshAccessToken = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`

            }
        })
        const accessToken = response.data.data.accessToken
        localStorage.setItem('accesstoken', accessToken)
        return accessToken
    } catch (error) {
        console.log(error)
    }
}


export default Axios