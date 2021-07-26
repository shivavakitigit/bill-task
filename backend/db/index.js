const mysql = require('mysql');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',//database username
  password:'',//database password
  database:'task_db',//database name
});

connection.connect((err)=> {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else{
    console.log('db connected successfully');
  }
});

module.exports = connection;