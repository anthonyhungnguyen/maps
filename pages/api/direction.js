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

const getDirection = (req, res) => {
	const { start, end } = req.body
	return new Promise(async (resolve) => {
		let requestLink = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&key=AIzaSyDmbl-UzpILeyTFM5_UbvCRiLHa5-6yhpU`
		const response = await fetch(requestLink)
		const data = await response.json()
		console.log(data)
		resolve(data)
	})
}

async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors)
	const data = await getDirection(req, res)

	// Rest of the API logic
	res.send(data)
}

export default handler
