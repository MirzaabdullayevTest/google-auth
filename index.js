const express = require('express')
const app = express()
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')

//google auth connect
// require('./config/passport')(passport)

// dotenv
dotenv.config()

// req middleware
app.use(express.json())  // json da kegan ma'lumotlarni parse qilib beradi
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Handlebars
app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutDir: path.join(__dirname, 'views/layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('views', path.join(__dirname, 'views'));


// MongoDB Store
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/connect_mongodb_session',
    collection: 'mySessions'
});

// Middleware functions
app.use(helmet())
app.use(morgan('tiny'))
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store
}))

app.use('/', (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI, (err) => {
            if (err) throw new Error

            console.log('MongoDB connected');
        })
    } catch (error) {
        console.error(error);
    }
}

const port = normalizePort(process.env.PORT || '3000')

app.set('port', port)

app.listen(port, () => {
    console.log('Server working on port', port);
})
start()

function normalizePort(val) {
    let port = parseInt(val, 10)  // kelgan qiymatni stringdan 10 sanoq sistemasida numberga o'tkazyapmiz

    if (isNaN(port)) {
        // demak bu not a number ekan// Ya'ni number emas ekan // string '3000'
        return val;
    }

    if (port >= 0) {
        return port
    }

    return false
} 