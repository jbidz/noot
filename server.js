if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const express_layout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const Notes = require('./models/notesModel')
const method_override = require('method-override')


mongoose.connect('mongodb://127.0.0.1:27017/Mynotes')

app.use(express.urlencoded({ extended: false }))
app.use(express_layout)
app.use(method_override('_method'))
app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'ejs')



app.get('/', async (req, res) => {

    const notes = await Notes.find()
    
    res.render('index', {layout: 'layouts/layout', notes: notes})
})

app.get('/create', (req, res) => {
    res.render('create', {layout: 'layouts/layout'})
})

app.post('/create', async (req, res) => {

   let note = new Notes({
       title: req.body.title,
       content: req.body.content
   })

   try {
       note = await note.save()
       res.redirect('/')
   } catch(err) {
       console.log(err.message)
       res.status(301).render('create', {layout: 'layouts/layout', message: 'all fields are required!'})
   }
    
})


app.delete('/:id', async (req, res) => {
    await Notes.findByIdAndDelete(req.params.id)
    res.redirect('/')
})



app.listen(process.env.PORT)