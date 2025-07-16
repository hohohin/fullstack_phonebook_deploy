import { useState, useEffect } from 'react'
import axios from 'axios'
import Form from './components/Form'
import Display from './components/Display'
import Filter from './components/Filter'
import Notification from './components/Notification'
import './index.css'

const baseUrl = 'http://localhost:3001/contacts'

function App() {
  const [searching, setSearch] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [numberInput, setNumberInput] = useState('')
  const [contacts, setContact] = useState([])

  // 合并消息状态管理
  const [notification, setNotification] = useState({
    message: null,
    type: 'neutral',
    visible: false
  })

  // 添加加载和错误状态
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 消息样式配置
  const messageStyles = {
    good: { backgroundColor: '#4caf50', color: 'white' },
    neutral: { backgroundColor: '#9e9e9e', color: 'white' },
    error: { backgroundColor: '#f44336', color: 'white' }
  }

  function blinkMessage(type, text, duration = 3000) {
    console.log('blinking', type, text, notification.message);
    
    // 验证类型是否有效
    if (!messageStyles[type]) {
      console.warn(`Invalid message type: ${type}`);
      type = 'neutral';
    }
    
    setNotification({
      ...notification,
      type: messageStyles[type],
      message: text
    });
    
    setTimeout(() => {
      setNotification({
        ...notification,
        message: null
      });
    }, duration);
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    axios.get(baseUrl)
    .then(response => {
      setContact(response.data)
    })
    .catch(error => {
      console.error('Failed to fetch contacts:', error)
      setError('无法加载联系人列表')
      blinkMessage('error', '无法加载联系人列表')
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])

  const handleSearch = (event) => {
    const searching = event.target.value
    setSearch(searching)
  }

  const handleAdd = (event) => {
    event.preventDefault()
    //process name repetition
    const possi_repe = contacts.find(contact => contact.name === nameInput)
    if (possi_repe) {
      if (window.confirm(`${nameInput} 已存在，是否更新号码？`)) {
        confirmChange(possi_repe)
      }
    }
    else if (nameInput === '' || numberInput === '') {
      window.alert('联系人姓名和号码不能为空')
    }
    else {
      confirmAdd()
    }
  }

  const confirmChange = (repe_contact) => {
    const newContact = { ...repe_contact, number: numberInput }
    setLoading(true)

    axios.put(`${baseUrl}/${repe_contact.id}`, newContact)
    .then(response => {
      const updatedContacts = contacts.map(contact =>
        contact.id === response.data.id 
        ? { ...contact, number: response.data.number }
        : contact
      )
      setContact(updatedContacts)
      blinkMessage('good', `${response.data.name} 的号码已更新`)
      setNameInput('')
      setNumberInput('')
    })
    .catch(error => {
      console.error('Failed to update contact:', error)
      blinkMessage('error', `更新 ${repe_contact.name} 失败`)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const confirmAdd = () => {
    const newContact = {
      name: nameInput,
      number: numberInput
    }
    setLoading(true)

    axios.post(baseUrl, newContact)
    .then(response => {
      blinkMessage('good', `${response.data.name} 已添加`)
      setContact(contacts.concat(response.data))
      setNameInput('')
      setNumberInput('')
    })
    .catch(error => {
      console.error('Failed to add contact:', error)
      blinkMessage('error', '添加联系人失败')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const handleDelete = (id) => {
    const contactToDelete = contacts.find(contact => contact.id === id)
    if (!contactToDelete) {
      blinkMessage('error', '联系人不存在')
      return
    }
    
    if (window.confirm(`删除 ${contactToDelete.name}?`)) {
      setLoading(true)
      
      axios.delete(`${baseUrl}/${id}`)
      .then(response => {
        setContact(contacts.filter(contact => contact.id !== id))
        blinkMessage('neutral', `${contactToDelete.name} 已删除`)
      })
      .catch(error => {
        console.error('Failed to delete contact:', error)
        blinkMessage('error', `删除 ${contactToDelete.name} 失败`)
      })
      .finally(() => {
        setLoading(false)
      })
    }
  }

  const handleName = (event) => {
    console.log(event.target.value)
    setNameInput(event.target.value)
  }

  const handleNumber = (event) => {
    setNumberInput(event.target.value)
  }

  return (
    <div>
      <h1>📱Phonebook</h1>
      {loading && <div style={{ color: 'blue', fontStyle: 'italic' }}>加载中...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Filter searching={searching} handleSearch={handleSearch} />
      <h2>add contact</h2>
      <Form 
        nameInput={nameInput} 
        numberInput={numberInput}
        handleName={handleName}
        handleNumber={handleNumber} 
        handleAdd={handleAdd} />
      <Notification text={notification.message} style={notification.type} />
      <Display
        searching={searching}
        contacts={contacts}
        handleDelete={handleDelete} />
    </div>
  )
}

export default App 