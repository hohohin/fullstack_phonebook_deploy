const express = require('express')
const app = express()
const morgan = require('morgan')
require('dotenv').config()

app.use(express.static('dist'))
app.use(express.json())

const PORT = process.env.PORT || 3001

//db
const Contact = require('./models/contact')

app.get('/info',(request,response)=>{
    Contact.find({}).then(all=>{
      const length = all.length
      const volume = `Phonebook has info for ${length} people <br> ${new Date().toString()}`
      response.send(volume)
    })
})

app.get('/api/persons',(request,response)=>{
  Contact.find({}).then(contacts=>{
    response.json(contacts)
  })
})

app.get('/api/persons/:id',(request,response,next)=>{
  Contact.findById(request.params.id)
  .then(contact=>{
    if(contact){response.json(contact)}
    else{response.status(404).end()}
  })
  .catch(error=>next(error))
  // const id = request.params.id
  // const person = persons.find(person=>person.id === id)
  // if(person){
  //     response.json(person)
  // }
  // else{
  //     response.status(404).end()
  // }
})

morgan.token('body',(req)=>{return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.delete('/api/persons/:id',(request,response,next)=>{
    const id = request.params.id
    // persons = persons.filter(person=>person.id !== id)
    Contact.findByIdAndDelete(id).then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
    
    
    // response.json(request.body)
})

app.post('/api/persons',(request,response)=>{
  const body = request.body
  // const id = Math.floor(Math.random()*1000)
  // const nameCheck = persons.map(person=>person.name)

  if(!body.name || !body.number){
    response.status(404)
    .json({error:'name or number is missing'})
    .end()
  }
  // Using findOneAndUpdate - not recommend cus there's no schema check by default compaired to save()
  // Contact.findOneAndUpdate(
  //   {name:body.name},
  //   {number:body.number},
  //   {returnOriginal:false}
  // ).then(renewed=>{
  //   if(renewed){
  //     console.log(`${renewed.name} is updated`)
  //     response.json(renewed)
  //   }
  // })

  Contact.find({name:body.name}).then(contact=>{
    console.log(contact)
    if(contact.length>0){

    }
    else{
      const contact = new Contact({
        // id:id.toString(),
        name:body.name,
        number:body.number
      })
      contact.save().then(savedContact=>{
        // persons = persons.concat(savedContact)
        response.json(savedContact)
        console.log(`contact ${savedContact.name} saved`)
      })
    }
  })
})

app.put('/api/persons/:id',(req,res)=>{
  const id = req.params.id
  const body = req.body
  Contact.findByIdAndUpdate(id,{number:body.number},{returnOriginal:false})
  .then(updated=>{
    res.json(updated)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log('app running on ',PORT)
})