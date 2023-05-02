import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import productsRoute from './routes/products.route.js'; 
import cartsRoute from './routes/carts.route.js';
import usersRoute from './routes/users.route.js';
import authRoute from './routes/auth.route.js';
import fileDirName from './utils/fileDirName.js';
import { uploader } from './utils/uploader.js';
import viewsRoute from './routes/views.route.js';
import configureHandlebars from './lib/hbs.middleware.js'; 
import configureSocket from './socket/configure-socket.js';
import mongoose from 'mongoose';
import datosConection from '../data.js';
import MongoStore from 'connect-mongo';
import { configurePassport } from './config/passport.config.js';
import passport from 'passport';

const {__dirname} = fileDirName(import.meta);

const {PORT, MONGO_URL, cookie_secret} = datosConection

const app = express();



const connection = mongoose.connect(
    MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
);



app.use(cookieParser(cookie_secret));




app.use(session({
	store: MongoStore.create({
	    mongoUrl: MONGO_URL,
		mongoOptions: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		ttl: 120,
	}),
	secret: cookie_secret,
	resave: true,
	saveUninitialized: true,
})
);


configurePassport();
app.use(passport.initialize());
app.use(passport.session());




configureHandlebars(app);

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(express.static(__dirname + '/public')); 
app.use('/', viewsRoute); 
app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);







app.get('/session', (req, res) => {
	if(req.session.counter){
		req.session.counter++;
		res.send({counter: req.session.counter});
	}else{
		req.session.counter = 1;
		res.send({counter: req.session.counter, primeraVez: true});
	}
});






app.use((error, req, res, next) => {
    if(error.message){
        return res.status(400).send({
             message: error.message
        });   
    }
     res.status(500).send({error});
});


const httpServer = app.listen(PORT, () => 
    console.log(`Servidor express escuchando en el puerto ${PORT}`)
);

configureSocket(httpServer); 

