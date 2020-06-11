import axios from 'axios'
import polyline from '@mapbox/polyline'

const FetchDirection = ({ setDirectionsResult, endName, coordinate, endLocation }) => {
	const handleFetchDirection = () => {
		return new Promise(async (resolve) => {
			resolve(
				await axios
					.post('/api/direction', { start: coordinate, end: endLocation })
					.then((response) => response.data)
					.then((data) => {
						const polylines = data.routes[0].overview_polyline.points
						let decoded_polylines = polyline.decode(polylines)
						decoded_polylines = decoded_polylines.map((item) => ({
							lat: item[0],
							lng: item[1]
						}))
						setDirectionsResult({
							path: decoded_polylines,
							distance: data.routes[0].legs[0].distance.text,
							duration: data.routes[0].legs[0].duration.text
						})
					})
			)
		})
	}

	return (
		<button
			onClick={handleFetchDirection}
			className='p-2 bg-white hover:bg-black hover:text-white mr-2 font-semibold'
		>
			Go to {endName}
		</button>
	)
}

export default FetchDirection
