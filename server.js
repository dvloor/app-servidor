const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');



app.get('/', function (req, res) {
    res.send('Docencia No. 2 - API Rest')
});

  
app.listen(3000);
console.log("Servidor iniciado en el puerto: " + 3000);


app.use(bodyParser.json({ type: 'application/json' }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_curso_app'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

// Insertar datos en la tabla persona
app.post("/insertar_persona", function (req, res) {
    connection.query(`INSERT INTO  persona
    (cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion)
    VALUES(?, ?, ?, ?, ?, ?);
    `, [req.body.cedula, req.body.nombres, req.body.apellidos, req.body.fecha_nacimiento, req.body.telefono, req.body.direccion ],
    function (error, results, fields) {
        if (error) throw error;
        res.json({
            message: 'Persona insertada exitosamente.',
            p_insert_persona: results
        });
    });
});

// Actualizar datos en la tabla persona
app.post("/actualizar_persona", function (req, res) {
    connection.query(`UPDATE persona
    SET cedula = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, telefono = ?, direccion = ?
    WHERE idpersona = ?;
    `, [req.body.cedula, req.body.nombres, req.body.apellidos, req.body.fecha_nacimiento, req.body.telefono, req.body.direccion, req.body.idpersona],
    function (error, results, fields) {
        if (error) throw error;
        res.json({
            message: 'Persona actualizada exitosamente.',
            p_update_persona: results
        });
    });
});

// Seleccionar nombres y apellidos de todas las personas
app.get('/personas', function (req, res) {
    connection.query(`SELECT nombres, apellidos FROM persona;`, function (error, results, fields) {
        if (error) throw error;
        res.json({
            p_datos_personas: results
        });
    });
});

// Eliminar persona
app.post("/eliminar_persona", function (req, res) {
    connection.query(`DELETE FROM persona WHERE idpersona = ?;`, [req.body.idpersona],
    function (error, results, fields) {
        if (error) throw error;
        res.json({
            message: 'Persona eliminada exitosamente.',
            p_delete_persona: results
        });
    });
});

// Seleccionar una persona en específico usando WHERE
app.post("/persona", function (req, res) {
    connection.query(`SELECT * FROM persona WHERE idpersona = ?;`, [req.body.idpersona],
    function (error, results, fields) {
        if (error) throw error;
        res.json({
            p_datos_persona: results
        });
    });
});
    