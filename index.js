const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const PORT = process.env.PORT || 3001

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info',(request,response)=>{
    const volume = `Phonebook has info for ${persons.length} people <br> ${new Date().toString()}`
    response.send(volume)
})

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    const person = persons.find(person=>person.id === id)
    // console.log(person, id);
    
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

morgan.token('body',(req)=>{return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    persons = persons.filter(person=>person.id !== id)
  
    
    response.status(204).end()
    // response.json(request.body)
})

app.post('/api/persons',(request,response)=>{
  const body = request.body
  const id = Math.floor(Math.random()*1000)
  const nameCheck = persons.map(person=>person.name)


  if(!body.name || !body.number){
    response.status(404).json({error:'name or number is missing'})
  }
  else if(nameCheck.find(name=>name===body.name)){
    response.status(404).json({error:'name must be unique'})
  }
  else{
    const person = {
      id:id.toString(),
      name:body.name,
      number:body.number
    }
    persons = persons.concat(person)

    response.json(person)
  }
})

app.listen(PORT,()=>{
    console.log('app running on ',PORT)
})