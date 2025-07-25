import { useState, useEffect, useActionState } from 'react'
import axios from 'axios'
import Form from './components/Form'
import Display from './components/Display'
import Filter from './components/Filter'
import Notification from './components/Notification'
import './index.css'

const baseUrl = '/api/persons' //-add proxy so that backend and frontend can communicate in one termianl
// const baseUrl = 'http://localhost:3001/contacts'


function App() {
  const [searching,setSearch] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [numberInput,setNumberInput] = useState('')
  const [contacts, setContact] = useState([])
  const [blink,setBlink] = useState(0)

  const [message,setMessage] = useState(null)
  const [msgtype,setType] = useState({backgroundcolor:'blue',color:'white'})

  function blinkMessage(type,text) {
    console.log('blinking',type,text)
    
    if(type==='good'){
        setType({backgroundColor:'green', color:'yellowgreen'})
    }
    else if(type==='neutral'){
      setType({backgroundColor:'lightgray', color:'gray'})
    }
    else{
      setType({backgroundColor:'red', color:'yellow'})
    }
    setMessage(text)
    setTimeout(() => {
      setMessage(null)
    }, 3000);
  }

  useEffect(()=>{
    axios.get(baseUrl)
    .then(response=>{
      setContact(response.data)
    })
  },[])

  const handleSearch = (event) => {
    const searching = event.target.value
    setSearch(searching)
  }

  const handleAdd = (event) => {
    event.preventDefault()
    //process name repetition
    const possi_repe = contacts.find(contact=>contact.name === nameInput)
    if (possi_repe) {
      if(window.confirm(`${nameInput} is already added, renew the number?`)){
        confirmChange(possi_repe)
    }}
    else if(nameInput === '' || numberInput ===''){
      window.alert('contact name/number cannot be empty')
    }
    else{
      confirmAdd()
    }
  }

  const confirmChange = (repe_contact) => {
    const newContact = {...repe_contact, number: numberInput}

    axios.put(`${baseUrl}/${repe_contact.id}`, newContact)
    .then(respond=>{
      const renew = contacts.map(contact=>
        contact.id === respond.data.id 
        ? {...contact, number: respond.data.number}
        : contact
    )
      setContact(renew)      
      blinkMessage('good',`${respond.data.name}'s number is renewed`)
    })
    .catch(error=>{
      blinkMessage('error',`Dude ${repe_contact.name} has already been deleted`)
    })
  }

  const confirmAdd = () => {
    const newContact = {
      name: nameInput,  
      number: numberInput
    }

    axios.post(baseUrl, newContact)
    .then(response=>{
      blinkMessage('good',`${response.data.name} is added`)
      setContact(contacts.concat(response.data))
    })
    .catch(error=>{
      // console.log(error)
      blinkMessage('error',error.response.data.error)
    })

    setNameInput('')
    setNumberInput('')
  }

  const handleDelete = (id) => {
    const ptd = contacts.filter(contact=>contact.id === id)
    if (window.confirm(`delete ${ptd[0].name}?`)){
    axios.delete(`${baseUrl}/${id}`)
    .then(respond=>{
      setContact(contacts.filter(contact=>contact.id != respond.data.id))
      // alert(`${respond.data.name} is deleted`)
      blinkMessage('neutral',`${respond.data.name} is deleted`)
      }
    )}
  }

  const handleName = (event) => {
    setNameInput(event.target.value)
  }

  const handleNumber = (event) => {
    setNumberInput(event.target.value)
  }

  return(
    <div>
      <h1>📱Phonebook</h1>
      <Filter searching={searching} handleSearch={handleSearch}/>
      <h2>add contact</h2>
      <Form 
        nameInput={nameInput} 
        numberInput={numberInput}
        handleName={handleName}
        handleNumber={handleNumber} 
        handleAdd={handleAdd}/>
      <Notification text={message} style={msgtype}/>
      <Display
        searching={searching}
        contacts={contacts}
        handleDelete={handleDelete} />
    </div>
  )
}

export default App
