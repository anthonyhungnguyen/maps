import Cors from 'cors'
const fetch = require('node-fetch')
const axios = require('axios')

// Initializing the cors middleware
const cors = Cors({
	methods: [ 'GET', 'HEAD' ]
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result)
			}

			return resolve(result)
		})
	})
}

async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors)
	await fetch('http://localhost:8081/publish', {
		method: 'post',
		body: JSON.stringify({
			msg: 'TURN LIGHT ON'
		}),
		headers: { 'Content-Type': 'application/json' }
	})
	// Rest of the API logic
}

export default handler
