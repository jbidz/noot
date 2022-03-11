if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const express_layout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const Notes = require('./models/notesModel')


mongoose.connect('mongodb://127.0.0.1:27017/Mynotes')

app.use(express.urlencoded({ extended: false }))
app.use(express_layout)
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
       console.log(err)
       res.redirect('/create', {note: note})
   }
    
})

app.listen(process.env.PORT)