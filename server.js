require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const userRoutes = require('./routes/users')
const roleRoutes = require('./routes/roles')
const expenseRoutes = require('./routes/expense')
const incomeRoutes = require('./routes/income')
const summaryRoutes = require('./routes/summary')
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require('cors')

mongoose.connect(process.env.MONGODBURL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Expense Tracker API",
			version: "1.0.0",
			description: "A simple Express Expense Tracker API",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				}
			}
		},
		security: [{
			bearerAuth: []
		}],
		servers: [
			{
				url: process.env.hostURL || "localhost:3000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use(express.json())
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/summary', summaryRoutes);
app.use(cors());

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);


app.listen(process.env.PORT || 3000, () => console.log('Server Started'))