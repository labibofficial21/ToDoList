const express = require("express")
const app = express()
const mysql = require("mysql")
const cors = require('cors')

app.use(cors())

// membuat koneksi ke db tertentu
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_todolist'
})

// cek apakah terhubung ke db atau tidak
connection.connect((error) => {
    if (error) {
        console.error('Error connection to database:', error)
        return
    } else {
        console.log('Connected to MySQL Database')
        checkTabelExistance()
    }
})

// cek apakah ada tabel di dalam db tersebut
function checkTabelExistance() {
    const checkTableQuery = `SHOW TABLES LIKE 'task'`
    connection.query(checkTableQuery, (error, results, fields) => {
        if (error) {
            console.error('Error checking table existance: ', error)
            return
        }
        if (results.length > 0) {
            console.log('Table "task" exists in the database');
        } else {
            console.log('Table "task" does not exist in the database')
        }
    })
}

// cek data dari database
app.get('/api/task', (req, res) => {
    const query = 'SELECT * FROM task';
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data from db: ', error)
            return res.status(500).json({ error: 'Failed to fetch data from db' })
        } else {
            return res.status(200).json(results)
        }
    })
})

app.use(express.json())

// API Endpoint u menyimpan data dari input frontend
app.post('/api/task', (req, res) => {
    const { task_name, task_date, task_type } = req.body;

    const insertQuery = `INSERT INTO task (task_name, task_date, task_type) VALUES (?, ?, ?)`;
    connection.query(insertQuery, [task_name, task_date, task_type], (error, results, fields) => {
        if (error) {
            console.error('Error inserting task: ', error);
            return res.status(500).json({ error: 'Failed to insert task into db' })
        } else {
            console.log(results)
            const newTaskId = results.insertId
            console.log('Task inserted successfully with ID: ', newTaskId);
            return res.status(200).json({
                message: 'Task inserted successfully!',
                id: newTaskId
            })
        }
    })
})

// API Endpoint untuk menghapus data dari db    
app.delete('/api/task/:id', (req, res) => {
    const taskId = req.params.id;

    const deleteQuery = `DELETE FROM task WHERE id = ?`;
    connection.query(deleteQuery, [taskId], (error, results, fields) => {
        if (error) {
            console.error('Error deleting task: ', error);
            return res.status(500).json({ error: 'Failed to delete task from db' })
        } else {
            if (results.affectedRows > 0) {
                console.log('Task deleted successfully!')
                return res.status(200).json({ message: 'Task deleted successfully!' })
            } else {
                return res.status(404).json({ error: 'Task not found!' })
            }
        }
    })
})

app.get("/", (req, res) => res.send("Hello Express!"))
app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"))