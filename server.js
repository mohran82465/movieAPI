const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const mongoose = require('mongoose');
// console.log(app.get('env'));
// console.log(process.env);
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
})



const app = require('./app');

mongoose.connect(process.env.CONN_STR).then(
    (conn) => {
        // console.log(conn);
        console.log('DB Connection Successful');
    }
)

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log('server has started...');

})
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection occured! Shutting down...');
 
    server.close(() => {
     process.exit(1);
    })
 })
 