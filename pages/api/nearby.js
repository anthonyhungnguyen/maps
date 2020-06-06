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

const getPhotosByPhotoReference = (photoReference) => {
	if (photoReference) {
		return new Promise(async (resolve) => {
			let photoLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=AIzaSyDmbl-UzpILeyTFM5_UbvCRiLHa5-6yhpU`
			const response = await fetch(photoLink)
			resolve(response.url)
		})
	} else {
		return new Promise(async (resolve) => {
			resolve('')
		})
	}
}

const getNearbyPlaces = (req, res) => {
	const { lat, lng } = req.body.coordinate
	const radius = req.body.radius
	const type = req.body.type
	const pageToken = req.body.pageToken
	return new Promise(async (resolve) => {
		let requestLink = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&types=${type}&key=AIzaSyDmbl-UzpILeyTFM5_UbvCRiLHa5-6yhpU`

		if (pageToken) {
			requestLink += `&pagetoken=${pageToken}`
		}
		const newData = []
		const response = await fetch(requestLink)
		const data = await response.json()
		const photoUrls = data.results.map(async (item) => {
			let photoUrl = ''
			if ('photos' in item) {
				photoUrl = await getPhotosByPhotoReference(item.photos[0].photo_reference)
			} else {
				photoUrl = await getPhotosByPhotoReference(null)
			}
			return photoUrl
		})
		await Promise.all(photoUrls).then((photoData) => {
			data.results.forEach(async (item, i) => {
				newData.push({ ...item, photoUrl: photoData[i] })
			})
			resolve(newData)
		})
	})
}

async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors)
	const data = await getNearbyPlaces(req, res)

	// Rest of the API logic
	res.send(data)
}

export default handler
