import rules from './rules.json'
export const handleFetchNearbyIcon = (type) => {
	switch (type) {
		case 'shopping_mall':
			return '/images/shop.png'
		case 'restaurant':
			return '/images/restaurant.png'
		case 'hair_care':
			return '/images/hair_care.png'
		case 'bank':
			return '/images/bank.png'
		case 'movie_theater':
			return '/images/movie_theater.png'
		case 'cafe':
			return '/images/cafe.png'
	}
}

export const handleFetchNameFromType = (type) => {
	switch (type) {
		case 'shopping_mall':
			return 'Shopping Mall'
		case 'restaurant':
			return 'Restaurant'
		case 'hair_care':
			return 'Hair Care'
		case 'bank':
			return 'Bank'
		case 'movie_theater':
			return 'Movie Theater'
		case 'cafe':
			return 'Cafe'
	}
}

export const handleFetchRecommendPlacesFromRules = (type) => {
	const ruless = rules[type]
	return ruless
}

export const rad = function(x) {
	return x * Math.PI / 180
}

export const getDistance = function(p1, p2) {
	const R = 6378137 // Earth’s mean radius in meter
	const dLat = rad(p2.lat - p1.lat)
	const dLong = rad(p2.lng - p1.lng)
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2)
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const d = R * c
	return d // returns the distance in meter
}
