export const handleFetchNearbyIcon = () => {
	switch (type) {
		case 'shopping_mall':
			return require('../public/images/shop.png')
		case 'restaurant':
			return require('../public/images/restaurant.png')
		case 'hair_care':
			return require('../public/images/hair_care.png')
		case 'bank':
			return require('../public/images/bank.png')
		case 'movie_theater':
			return require('../public/images/movie_theater.png')
		case 'cafe':
			return require('../public/images/cafe.png')
	}
}
