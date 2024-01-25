require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const auth = require('./routes/auth.js')
const shops = require('./routes/shops.js')
const products = require('./routes/products.js')
const sales = require('./routes/sales.js')

const app = express()
const port = 8000

// middlewares
app.use(express.json())
app.use(bodyParser.json())

// routes
app.use('/auth', auth)
app.use('/shops', shops)
app.use('/products', products)
app.use('/sales', sales)

app.get('/', (req, res) => {
	res.send('Hello World!')
	console.log('hello')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})