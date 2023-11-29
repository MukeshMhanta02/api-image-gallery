const express = require('express');
const dotenv = require('dotenv'); 
const cors = require('cors');
const { json } = require('body-parser');
const axios = require('axios');
const serverless = require('serverless-http');
const app = express();

dotenv.config({ path: './.env' });

app.use(cors());
app.use(json());

const router= express.Router();

const BASE_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}`;

const auth = {
	username: process.env.API_KEY,
	password: process.env.API_SECRET,
};

router.get('/photos', async (req, res) => {
	console.log("Photos method");
	const response = await axios.get(BASE_URL + '/resources/image', {
		auth,
		params: {
			next_cursor: req.query.next_cursor,
		},
	});
	return res.send(response.data);
});

router.get('/search', async (req, res) => {
	const response = await axios.get(BASE_URL + '/resources/search', {
		auth,
		params: {
			expression: req.query.expression,
		},
	});

	return res.send(response.data);
});


app.use('/.netlify/functions/api',router)

module.exports.handler = serverless(app);

// -----------------For Local Run-----------------------

// app.use('/',router)
// const PORT = 7000;
// app.listen(PORT, console.log(`Server running on port ${PORT}`));
