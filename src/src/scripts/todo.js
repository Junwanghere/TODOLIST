// 程式碼寫在這裡

import { createApp } from 'vue/dist/vue.esm-bundler.js'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { userRegisterAPI,userLoginAPI, userLogoutAPI, userCheckTokenAPI } from '../api/user'
import { getTodosAPI, addTodoAPI, modifyTodoAPI, deleteTodoAPI, toggleCompleteTodoAPI } from '../api/todos'



const displayRegister = 0
const displayLogin = 1
const displayTodo = 2




const App = {
  data(){
    return {
      message: 'Hello',
      displayStatus: displayLogin,
      email:'',
      nickname:'',
      password:'',
      token: 'null',
      todoList: [],
      todo:'',
      selectedTodo: -1,
    }
  },
  beforeMount(){
    this.setToken(localStorage.getItem('token'))
    this.checkToken()
  },
  methods:{
    async checkToken(){
      try{
        await userCheckTokenAPI(this.token)
      }catch({ response }){
        this.setToken('null')
        const { data } = response
        if(data.message == '未授權'){
          this.goLogin()
        }
      }
    },
    setToken(data){
      this.token = data
    },
    clearForm(){
      this.email = ''
      this.nickname = ''
      this.password = ''
    },
    goLogin(){
      this.displayStatus = displayLogin
    },
    goRegister(){
      this.displayStatus = displayRegister
    },
    async goTodo(){
      await this.getTodos()
      this.displayStatus = displayTodo
    },
    async userLogout(){
      const res = await Swal.fire({
        title: '貼心小提醒',
        text: '你確定要登出嗎?',
        icon: 'warning',
        showConfirmButton: 'true',
        showCancelButton:'true',
        confirmButtonText: '確認',
        cancelButtonText: '再待一下'
      })
      if(res.isConfirmed == true){
        try{
          await userLogoutAPI(this.token)
          this.setToken('null')
          this.todoList = []
          this.goLogin()
        }catch({response}){
          const { message } = response.data
          console.log(response)
          Swal.fire({
            text: message,
            icon: 'error',
            confirmButtonText: '我知道了'
          })
        }
      }
    },
    async userLogin(){
      if(this.email == '' || this.password == ''){
        Swal.fire({
          title: '貼心小提醒',
          text: '內容不得為空唷~',
          icon: 'error',
          confirmButtonText: '我知道了'
        })
      }else{
        const data = {
          "user": {
            "email": this.email,
            "password": this.password
          }
        }
        try{
          const res = await userLoginAPI(data)
          this.token = res.headers.authorization
          const { message } = res.data
          await Swal.fire({
            title: '恭喜',
            text: message,
            icon: 'success',
            confirmButtonText: '我知道了'
          })
          this.clearForm()
          this.goTodo()
        }catch({response}){
          const { message } = response.data
          Swal.fire({
            text: message,
            icon: 'error',
            confirmButtonText: '我知道了'
          })
          this.clearForm()
        }
      }
    },
    async userRegister(){
      //先進行表單較驗，使用者是否有輸入?
      if(this.email == '' || this.nickname == '' || this.password == ''){
        Swal.fire({
          title: '貼心小提醒',
          text: '內容不得為空唷~',
          icon: 'error',
          confirmButtonText: '我知道了'
        })
      }else{
        const data = {
          "user": {
            "email": this.email,
            "nickname": this.nickname,
            "password": this.password
          }
        }
        try{
          //註冊成功
          const res = await userRegisterAPI(data)
          const token = res.headers.authorization
          localStorage.setItem('token',token)
          await Swal.fire({
            title: '恭喜',
            text: '註冊成功!',
            icon: 'success',
            confirmButtonText: '我知道了'
          })
          this.clearForm()
          this.goLogin()
        }catch({response}){
          //註冊失敗
          const { message, data } = response.data
          Swal.fire({
            title: message,
            text: data,
            icon: 'error',
            confirmButtonText: '我知道了'
          })
        }
      }
    },
    async getTodos(){
      let {data:{todos}} = await getTodosAPI(this.token)
      todos = todos.map(item => { item.isChecked = Boolean(item.completed_at)
        return item
      }).reverse()
      this.todoList = todos
    },
    async addTodo(){
      if(!this.todo){
        Swal.fire({
          icon: "warning",
          title: "內容不得為空",
          showConfirmButton: false,
          timer: 1000
        });
      }else{
        try{
          await addTodoAPI(this.todo, this.token)
          this.todo = ''
          await this.getTodos()
        }catch({response}){
          const { message } = response.data
          console.log(response)
          Swal.fire({
            text: message,
            icon: 'error',
            confirmButtonText: '我知道了'
          })
        }
      }
    },
    async modifyTodo(){
    },
    async deleteTodo(id){
      const res = await Swal.fire({
        title: '貼心小提醒',
        text: '你確定要刪除嗎?',
        icon: 'warning',
        showConfirmButton: 'true',
        showCancelButton:'true',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      })
      if(res.isConfirmed == true){
        try{
          await deleteTodoAPI(id, this.token)
          this.getTodos()
        }catch({response}){
          const { message } = response.data
          console.log(response)
          Swal.fire({
            text: message,
            icon: 'error',
            confirmButtonText: '我知道了'
          })
        }
      }
    },
    setSelected(index=-1){
      this.selectedTodo = index 
    },
    async editTodo(todo){
      //先檢查內容
      const { content, id } = todo
      if(content == ''){
        Swal.fire({
          text: '內容不得為空',
          icon: 'error',
          confirmButtonText: '我知道了'
        })
      }else{
        //0.reset selected 1.發請求 2.重抓資料
        try{
          await modifyTodoAPI(id, content, this.token)
          this.setSelected()
        }catch({response}){
          const { message } = response.data
          console.log(response)
          Swal.fire({
            text: message,
            icon: 'error',
            confirmButtonText: '我知道了'
          })
        }
      }
    },
    async toggleComplete(id, index){
      try{
        await toggleCompleteTodoAPI(id, this.token)
      }catch({response}){
        const { message } = response.data
        Swal.fire({
          text: message,
          icon: 'error',
          confirmButtonText: '我知道了'
        })
      }
    }
  },
  computed:{
    isLogin(){
      return this.displayStatus == displayLogin
    },
    isRegister(){
      return this.displayStatus == displayRegister
    },
    isTodo(){
      return this.displayStatus == displayTodo
    },
    isSignedIn(){
      return (this.token !== 'null')
    },
  },
  watch:{
    token(newValue){
      localStorage.setItem('token',newValue)
    },
    isSignedIn(newValue){
      if(newValue){
        this.goTodo()
      }
    }
  }
}



createApp(App).mount('#app')