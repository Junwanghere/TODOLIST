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
export const modifyTodoAPI = (id, content, token) => axios.put('https://todoo.5xcamp.us/todos/s',{
  "todo": {
    content
  }
},
{
  headers:{
    Authorization: token,
  },
  params:{
    id:id
  }
})
export const deleteTodoAPI = (id, token) => axios.delete(`https://todoo.5xcamp.us/todos/${id}`,{
  headers:{
    Authorization: token,
  }
})