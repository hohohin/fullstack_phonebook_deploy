require('dotenv').config
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

// console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name:{
    type:String,
    minLength:3,
    required:true    
  },
  
  number: {
    type:String,
    validate:{
      validator:(v)=>{
        const pattern = /^\d{2,3}-\d/
        return pattern.test(v)
      }
    },
    required:true,
    message:'number invalid'
  },
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Contact = mongoose.model('Contact', contactSchema)

// console.log(Contact.find({}))

// const initContact = new Contact({
//     name:'initUser',
//     number:2333
// })

// initContact.save().then(inited=>console.log('data initilized'))

module.exports = Contact