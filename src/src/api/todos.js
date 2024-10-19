import axios from 'axios'

export const getTodosAPI = (token) => axios.get('https://todoo.5xcamp.us/todos',{ 
  headers:{
    Authorization: token
}})

export const addTodoAPI = (todo, token) => axios.post('https://todoo.5xcamp.us/todos',{
  "todo": {
    "content": todo
  }},{
  headers:{
    Authorization: token,
    'accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export const modifyTodoAPI = (id, content, token) => axios.put(`https://todoo.5xcamp.us/todos/${id}`,{
  "todo": {
    content
  }
},
{
  headers:{
    Authorization: token
  }
})

export const deleteTodoAPI = (id, token) => axios.delete(`https://todoo.5xcamp.us/todos/${id}`,{
  headers:{
    Authorization: token,
  }
})

export const toggleCompleteTodoAPI = (id, token) => axios.patch(`https://todoo.5xcamp.us/todos/${id}/toggle`,null,{
  headers:{
    Authorization: token
  }
})