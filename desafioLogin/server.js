const express = require('express')
const {
    Server: HttpServer
} = require('http')
const {
    Server: IOServer
} = require('socket.io')
const {
    Router
} = express
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const session = require('express-session')

const passport = require('passport')

//la estrategia de passport que utilizaremos es passport-local
const {
    Strategy: LocalStrategy
} = require('passport-local')


//utilizaremos la dependencia bycrypt para encryptar la contraseña
const {
    createHash,
    isValidPassword
} = require('./utils/bycrypt')


const flash = require('connect-flash')

const PORT = 8080

// ==== SET CACHE STORE ====
const MongoStore = require('connect-mongo')

// ==== SESSION MIDDLEWARE ====
const validateSession = (req, res, next) => {

    if (req.session.user && req.session.password) {
        console.log(`Usuario validado. Sesion inicida por ${req.session.user}`)
        return next()
    }


    if (req.body.user && req.body.password) {
        req.session.user = req.body.user
        req.session.password = req.body.password

        console.log(`Se ha registrado el usuario ${req.session.user}`)
        return next()
    }
    console.log(`No existe el usuario. Inicie sesion.`)
    return res.status(401).redirect('http://localhost:8080/login')
}

// ==== SET MIDDLEWARES ====
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use('/static', express.static(__dirname + '/public'))


/*
Una Session-store es una provisión para almacenar datos de sesión en el backend. Las sesiones basadas en almacenes de sesiones pueden almacenar una gran cantidad de datos que están bien ocultos al usuario.
*/
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://ulisesroa07:<password>@cluster0.hunmr8n.mongodb.net/?retryWrites=true&w=majority`,
        ttl: 60
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
}))
//secret: contraseña para firmar la sesión. Es requerido si no se inicializa con uno.

app.use(flash())

// ==== SET DATABASE ====
const uri = "mongodb+srv://ulisesroa07:<password>@cluster0.hunmr8n.mongodb.net/?retryWrites=true&w=majority"

// ==== SCHEMAS ====

//El esquema tiene el detalle(tipo de datos) de los campos de la tabla en la base de datos
const schemaMensajes = require('./db/schema/mensajes')
const schemaProducto = require('./db/schema/productos')


// ==== DAOS ====
//ambos DAOS heredan de /containers/containerMongoDb, se utiliza para el CRUD en la base de datos
const ProductosDAOMongoDB = require('./db/daos/ProductosDAOMongoDB')
const MensajesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB')


// ==== CONTENEDORES (CHILD) ====

//le pasa el nombre de la tabla, el esquema de la tabla, y la conexion a la base al constructor
const products = new ProductosDAOMongoDB('producto', schemaProducto, uri)
const messages = new MensajesDAOMongoDB('mensaje', schemaMensajes, uri)

//contiene el esquema de la tabla user
const User = require('./db/models/user')

// ==== PASSPORT CONFIGURATION ====
app.use(passport.initialize())
app.use(passport.session())

// ==== LOGIN STRATEGY ====
//aplicamos la estrategia al login
//recordemos que username, password y done deben escribirse asi, de otra forma no funcionan.
passport.use('login', new LocalStrategy((username, password, done) => {

    return User.findOne({
            username
        })
        .then(user => {
            if (!user) {
                //si no encuentra el usuario informa
                return done(null, false, {
                    message: `No se encontro el usuario "${username}"`
                })
            }

            if (!isValidPassword(user.password, password)) {
                //si la password es incorrecta lo informa
                return done(null, false, {
                    message: 'Contraseña incorrecta'
                })
            }
            //si todo sale bien retorna el usuario
            return done(null, user)
        })
        //en el caso de que se produsca un error 
        .catch(err => done(err))
}))

// ==== SIGNUP STRATEGY ====
//aplicamos la estrategia a registrarse
/*
Passoprt en signup(registrarse) buscara el id llamado username y password, estos valores son los que utilizara passport para verificar si registra al usuario o si ya existe dentro del objeto User().
*/
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
    return User.findOne({
        //si encuentra al usuario en el objeto User lo retorna, y anunciara que ya existe utilizando done
            username
        })
        .then(user => {
            if (user) {
                return done(null, false, {
                    message: `El usuario ${user.username} ya existe`
                })
            }
//si no encuentra al usuario dentro del objeto User, crea el objeto con los datos del nuevo usuario.

            //con el nuevo usuario creamos un objeto llamado newUser el tipo User()
            //user() se encuentra en db/containers/user.js
            const newUser = new User()
            newUser.username = username
            newUser.password = createHash(password) //createHash es un metodo de utils/bycrypt.js
            newUser.email = req.body.email

            //guarda en la base de datos al nuevo usuario, con el metodo save() de mongo
            return newUser.save()
        })
        .then(user => done(null, user))
        .catch(err => done(err))
}))


//serializamos
passport.serializeUser((user, done) => {

    done(null, user._id)
})

//deserializamos
passport.deserializeUser((id, done) => {

    User.findById(id, (err, user) => {
        done(err, user)
    })
})

// ==== SET ROUTES ====

const apiRouter = Router()
const loginRouter = Router()
const logoutRouter = Router()
const signupRouter = Router()


app.use('/api/productos', apiRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/signup', signupRouter)


/****************************Programo el EndPoint GET /api/productos**********************************/
apiRouter.get('', async (req, res) => {
    const data3 = await products.getAll()
    const messageCont = await messages.getAll()

    if (req.user) {
        const user = req.user.email
        return res.render('home', {
            status: 1,
            data3,
            messageCont,
            user
        })
    }
    res.redirect('/login')
})


/*******************************************************************************/

/************************Programo el EndPoint GET /login************************/
loginRouter.get('', (req, res) => {
    return res.render('login', {
        message: req.flash('error')
    })
})

/*******************************************************************************/


/**********************Programo el EndPoint POST /login*************************/
//utiliza passport.authenticate, si authentica al usuario entonces redirecciona a /api/productos
//si falla redirecciona a /login
loginRouter.post('', passport.authenticate('login', {
    successRedirect: '/api/productos',
    failureRedirect: '/login',
    failureFlash: true
}))

/*******************************************************************************/

/*********Programo el EndPoint GET /signup que es el de Registrarse*************/
signupRouter.get('', (req, res) => {
    return res.render('signup', {
        message: req.flash('error')
    })
})

/*******************************************************************************/

/*********Programo el EndPoint POST /signup que es el de Registrarse**************/
signupRouter.post('', passport.authenticate('signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
}))

/*******************************************************************************/

/*********Programo el EndPoint GET de /Logout***********************************/
logoutRouter.get('', (req, res) => {
    const user = req.session.user
    //si existe usuario en la sesion y password entonces destruye la sesion
    if (req.session.user && req.session.password) {
        //destruye la sesion iniciada
        return req.session.destroy(err => {
            if (!err) {
                return res.status(200).render('redirect', {
                    user
                })
            }
            return res.send({
                error: err
            })
        })
    }
    //si no hay sesion iniciada retorna estado 404, y redirecciona a /login
    return res.status(404).redirect('http://localhost:8080/login')
})

/*******************************************************************************/

// ==== SET VIEWS CONFIG ====
app.set('views', './public/views/ejs')
app.set('view engine', 'ejs')

// ==== SET HTTP SERVER ====
app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error', (error) => {
    console.log(`Se ha detectado un error. ${error}`)
})



/**************************************************************************************************************/
// ==== SET SOCKET SERVER ====
io.on('connection', socket => {
    console.log(`Nuevo cliente conectado con id ${socket.id}`)


    //recibe por socket a "addProduct" el cual fue enviado por client.js
    socket.on('addProduct', newProduct => {

        //guarda en la tabla "producto" en la base de datos el producto ingresado en el body
        const newProductID = products.save(newProduct)
        const data3 = newProduct
        data3.id = newProductID

        //envia nuevamente los productos que acabamos de guardar en la base de datos
        socket.emit('refreshList', data3)
        socket.broadcast.emit('refreshList', data3)
    })


    /*es enviado por medio de socket el mensaje del chat, a traves del boton submitMessage. y aqui el mensaje sera guardado en la base de datos*/
    socket.on('addMessage', newMessage => {

        messages.save(newMessage)
        const messageCont = newMessage

        /*el mensaje del chat una vez guardado en la base es enviado nuevamente, y sera recibido por client.js para dibujarlo en el DOM*/
        socket.emit('refreshMessages', messageCont)
        socket.broadcast.emit('refreshMessages', messageCont)
    })

    socket.on('disconnect', reason => {

        console.log(`Se ha desconectado el cliente con id ${socket.id}`)
    })
})