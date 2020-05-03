var express = require('express')
var router = express.Router()
const fetch = require('node-fetch')

/* GET home page. */
router.get('/', async (req, res, next) => {
	await fetch(
		'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=10.748127710852733,106.6128096443417&radius=500&types=food&key=AIzaSyDmbl-UzpILeyTFM5_UbvCRiLHa5-6yhpU'
	)
		.then((res) => res.json())
		.then((data) => res.send(data.results))
})

module.exports = router
