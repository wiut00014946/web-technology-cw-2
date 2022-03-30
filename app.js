// third party libraries
const express = require('express')
const app = express()

// node libraries
const fs = require('fs')
const PORT = 8000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    fs.readFile('./data/todos.json', (err, data) => {
        if (err) throw err

        const todos = JSON.parse(data)

        res.render('home', { todos: todos })
    })
})

app.post('/add', (req, res) => {
    const formData = req.body
    
    if (formData.todo.trim() == '') {
        fs.readFile('./data/todos.json', (err, data) => {
            if (err) throw err

            const todos = JSON.parse(data)

            res.render('home', { error: true, todos: todos })
        })
    } else {
        fs.readFile('./data/todos.json', (err, data) => {
            if (err) throw err
            
            const todos = JSON.parse(data)
            
            const todo = {
                id: id(),
                description: formData.todo,
                done: false
            }
            
            todos.push(todo)
            
            fs.writeFile('./data/todos.json', JSON.stringify(todos), (err) => {
                if (err) throw err

                fs.readFile('./data/todos.json', (err, data) => {
                    if (err) throw err

                    const todos = JSON.parse(data)

                    res.render('home', { success: true, todos: todos })
                })
            })
        })
    }
})

app.listen(PORT, (err) => {
    if (err) throw err

    console.log('This app is running on port' + PORT)
})

function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}