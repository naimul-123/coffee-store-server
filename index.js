const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is ok')
})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})