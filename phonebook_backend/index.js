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
})

morgan.token('body',(req)=>{return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.delete('/api/persons/:id',(request,response,next)=>{
    const id = request.params.id
    Contact.findByIdAndDelete(id).then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
})

app.post('/api/persons',(request,response,next)=>{
  const body = request.body
  if(!body.name || !body.number){
    response.status(404)
    .json({error:'name or number is missing'})
    .end()
  }

  Contact.find({name:body.name})
  .then(contact=>{
    console.log(contact)
    if(contact.length>0){
      Contact.findOneAndUpdate(
        {name:body.name},
        {number:body.number},
        {returnOriginal:false},
        {runValidators:true}
      ).then(renewed=>{
        if(renewed){
          console.log(`${renewed.name} is updated`)
          response.json(renewed)
        }
      })
      .catch(error=>next(error))
    }
    else{
      const contact = new Contact({
        name:body.name,
        number:body.number
      })
      contact.save().then(savedContact=>{
        response.json(savedContact)
        console.log(`contact ${savedContact.name} saved`)
      })
      .catch(error=>next(error))
    }
  })
})

app.put('/api/persons/:id', (req,res)=>{
  const id = req.params.id
  const body = req.body
  Contact.findByIdAndUpdate(
    id,
    {number:body.number},
    {returnOriginal:false},
    {runValidators:true}
  )
  .then(updated=>{
    console.log(`${updated.name}'s number has been changed`)
    res.json(updated)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error('error message: ',error.message)
  console.error('error name: ',error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log('app running on ',PORT)
})