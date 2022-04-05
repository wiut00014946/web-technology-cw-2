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

app.get('/', (req, res) => {
    fs.readFile('./database/students.json', (err, data) => {
        if (err) throw err

        const students = JSON.parse(data)

        res.render('home', { students: students })
    })
})

app.post('/add', (req, res) => {
    const formData = req.body
    
    if (formData.studentName.trim() == '' || formData.studentSurname.trim() == '') {
        fs.readFile('./database/students.json', (err, data) => {
            if (err) throw err

            const students = JSON.parse(data)

            res.render('home', { error: true, students: students })
        })
    } else {
        fs.readFile('./database/students.json', (err, data) => {
            if (err) throw err
            
            const students = JSON.parse(data)
            
            const student = {
                id: id(),
                name: formData.studentName,
                surname: formData.studentSurname,
                course: formData.studentCourse,
                done: false
            }
            
            students.push(student)
            
            fs.writeFile('./database/students.json', JSON.stringify(students), (err) => {
                if (err) throw err

                fs.readFile('./database/students.json', (err, data) => {
                    if (err) throw err

                    const students = JSON.parse(data)

                    res.render('home', { success: true, students: students })
                })
            })
        })
    }
})

app.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./database/students.json', (err, data) => {
        if (err) throw err

        const students = JSON.parse(data)

        const filteredStudents = students.filter(student => student.id != id)

        fs.writeFile('./database/students.json', JSON.stringify(filteredStudents), (err) => {
            if (err) throw err

            res.render('home', { students: filteredStudents, deleted: true })
        })
    })
})

app.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile('./database/students.json', (err, data) => {
        if (err) throw err

        const students = JSON.parse(data)
        const student = students.filter(student => student.id == id)[0]
        
        const studentIdx = students.indexOf(student)
        const splicedStudent = students.splice(studentIdx, 1)[0]
        
        splicedStudent.done = true
        
        students.push(splicedStudent)

        fs.writeFile('./database/students.json', JSON.stringify(students), (err) => {
            if (err) throw err

            res.render('home', { students: students })
        })
    })
})

app.listen(PORT, (err) => {
    if (err) throw err

    console.log('This application is running on port ' + PORT)
})

function id() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}