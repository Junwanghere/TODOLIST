import axios from 'axios'

export const userRegisterAPI = (data) => axios.post('https://todoo.5xcamp.us/users', data)

export const userLoginAPI = (data) => axios.post('https://todoo.5xcamp.us/users/sign_in', data)

export const userLogoutAPI = (token) => axios.delete('https://todoo.5xcamp.us/users/sign_out', {
  headers:{
    Authorization: token
  }
})