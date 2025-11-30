import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Axios Base Configuration
const baseURL = process.env.API_BASE_URL 

const API_KEY = process.env.API_KEY 

const axiosParams = { 
  baseURL
}

let axiosInstance: AxiosInstance = axios.create(axiosParams)

const axiosConfig = (axiosInstance: AxiosInstance)  => {
	return {
		get: (url: string, params: any) => axiosInstance.get(url, { params }),
		post: (url: string, body: any, config: InternalAxiosRequestConfig ) => axiosInstance.post(url, body, config),
		patch: (url: string, body: any, config: InternalAxiosRequestConfig) => axiosInstance.patch(url, body, config),
		put: (url: string, body: any, config:InternalAxiosRequestConfig) => axiosInstance.put(url, body, config),
		delete: (url: string, config:InternalAxiosRequestConfig) => axiosInstance.delete(url, config),
	}
}

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Set headers using .set() method
    config.headers.set('Content-Type', 'application/json')
    config.headers.set('Accept', 'application/json')
    
    // API key add to query params
    if (!config.params) {
      config.params = {}
    }

    config.params.appid = API_KEY 

    console.log('API_KEY', API_KEY)
    return config
  },
  (error: AxiosError) => {
    console.error('request Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Error handling
    if (error.response) {
      // Server responded with error
      const status = error.response.status
      const message = error.response.data || error.message
      
      
      // Handle specific status codes
      switch (status) {
        case 500:
          return Promise.reject(new Error('Server error. Please try again later.'))
        default:
          return Promise.reject(new Error(message as string || 'An error occurred'))
      }

    } else if (error.request) {
      // Request was made but no response
      return Promise.reject(new Error('Network error. Please check your internet connection.'))
    } else {
      // Something else happened
      return Promise.reject(error)
    }
  }
)

export default axiosConfig(axiosInstance)

