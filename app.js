// include 'express' web application framework
const express = require('express')
const app = express()

// include the file system module
const fs = require('fs')

// define PORT number
const PORT = 8000

// using 'pug' template engine
app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.use(express.urlencoded({ extended: false }))

// route handler for GET requests to a URL "/"
app.get('/', (req, res) => {
    // read students.json file
    fs.readFile('./database/students.json', (err, data) => {
        if (err) throw err

        // parse a JSON string
        const students = JSON.parse(data)

        // render home.pug page
        res.render('home', { students: students })
    })
})

// route handler for POST requests to a URL "/add"
app.post('/add', (req, res) => {
    const formData = req.body
    
    if (formData.studentName.trim() == '' || formData.studentSurname.trim() == '') {
        // read students.json file
        fs.readFile('./database/students.json', (err, data) => {
            if (err) throw err

            // parse a JSON string
            const students = JSON.parse(data)

            // render home.pug page
            res.render('home', { error: true, students: students })
        })
    } else {
        // read students.json file
        fs.readFile('./database/students.json', (err, data) => {
            if (err) throw err
            
            // parse a JSON string
            const students = JSON.parse(data)
            
            const student = {
                id: id(),
                name: formData.studentName,
                surname: formData.studentSurname,
                course: formData.studentCourse
            }
            
            // add new elements to the end of array
            students.push(student)
            
            // write data to students.json file
            fs.writeFile('./database/students.json', JSON.stringify(students), (err) => {
                if (err) throw err
                
                // read students.json file
                fs.readFile('./database/students.json', (err, data) => {
                    if (err) throw err

                    // parse a JSON string
                    const students = JSON.parse(data)

                    // render home.pug page
                    res.render('home', { success: true, students: students })
                })
            })
        })
    }
})

// route handler for GET requests to a URL "/:id/delete"
app.get('/:id/delete', (req, res) => {
    const id = req.params.id

    // read students.json file
    fs.readFile('./database/students.json', (err, data) => {
        if (err) throw err

        // parse a JSON string
        const students = JSON.parse(data)

        // checks each element of array for provided condition and returns new array with elements that pass the condition
        const filteredStudents = students.filter(student => student.id != id)

        // write data to students.json file
        fs.writeFile('./database/students.json', JSON.stringify(filteredStudents), (err) => {
            if (err) throw err

            // render home.pug page
            res.render('home', { students: filteredStudents, deleted: true })
        })
    })
})

// route handler for GET requests to a URL "/:id/update"
app.get('/:id/update', (req, res) => {
    const id = req.params.id

    // read students.json file
    fs.readFile('./database/students.json', (err, data) => {
        if (err) throw err

        // parse a JSON string
        const students = JSON.parse(data)
        
        // checks each element of array for provided condition and returns new array with elements that pass the condition
        const student = students.filter(student => student.id == id)[0]

        // render update.pug page
        res.render('update', { student: student })
    })
})

// route handler for POST requests to a URL "/:id/update"
app.post('/:id/update', (req, res) => {
    const id = req.params.id
    const formData = req.body

    if (formData.studentName.trim() == '' || formData.studentSurname.trim() == '') {
        // read students.json file
        fs.readFile('./database/students.json', (err, data) => {
            if (err) throw err

            // parse a JSON string
            const students = JSON.parse(data)

            // checks each element of array for provided condition and returns new array with elements that pass the condition
            const student = students.filter(student => student.id == id)[0]

            // render update.pug page
            res.render('update', { student: student, error: true })
        })
    } else {
        // read students.json file
        fs.readFile('./database/students.json', (err, data) => {
            if (err) throw err
            
            // parse a JSON string
            const students = JSON.parse(data)

            // checks each element of array for provided condition and returns new array with elements that pass the condition
            const student = students.filter(student => student.id == id)[0]
            
            // return the first index at which given element is found
            const studentIdx = students.indexOf(student)

            // replace existing element in an array with updated one
            const splicedStudent = students.splice(studentIdx, 1)[0]
            
            splicedStudent.name = formData.studentName
            splicedStudent.surname = formData.studentSurname
            splicedStudent.course = formData.studentCourse
            
            // add new elements to the end of array
            students.push(splicedStudent)
            
            // write data to students.json file
            fs.writeFile('./database/students.json', JSON.stringify(students), (err) => {
                if (err) throw err
    
                // render home.pug page
                res.render('home', { students: students, updated: true })
            })
        })    
    }
})

// listen the connection on PORT 8000
app.listen(PORT, (err) => {
    if (err) throw err

    console.log('This application is running on port ' + PORT)
})

// function to automatically generate Student ID
function id() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}