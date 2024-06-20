require('dotenv').config();         // read environment variables from .env file
const express = require('express'); 
const cors = require('cors');       // middleware to enable CORS (Cross-Origin Resource Sharing)

const app = express();
const port = process.env.PORT;	 	


app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'home -- TUTORIALS api' });
});

// routing middleware
app.use('/users', require('./routes/users.routes.js'))
app.use('/events', require('./routes/events.routes.js'))
app.use('/publishes', require('./routes/publishes.routes.js'))
app.use('/institutions', require('./routes/institutions.routes.js'))
app.use('/degrees', require('./routes/degrees.routes.js'))
app.use('/notifications', require('./routes/notifications.routes.js'))
// handle invalid routes
app.all('*', function (req, res) {
	res.status(400).json({ success: false, msg: `The API does not recognize the request on ${req.url}` });
})

app.use((err, req, res, next) => {
    const errorStatus = err.statusCode || 500;
    const errorMessage = err.message || "Internal server error" + err.stack;
  
    return res.status(errorStatus).json({
      success: false,
      msg: errorMessage,
    });
  });

app.listen(port, () => console.log(`App listening`));
