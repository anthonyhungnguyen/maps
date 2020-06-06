import Cors from 'cors'
const fetch = require('node-fetch')

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

const getCoronaInfo = async () => {
	return new Promise(async (resolve) => {
		const resp = await fetch('https://maps.vnpost.vn/apps/covid19/api/patientapi/list')
		const data = await resp.json()
		resolve(data)
	})
}

async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors)
	const data = await getCoronaInfo().then(res.send)

	// Rest of the API logic
	// res.send(data)
}

export default handler
