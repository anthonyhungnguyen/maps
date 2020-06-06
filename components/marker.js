import { Marker } from 'google-maps-react'

const MyMarker = (name, handleMarkerClick, position, url, size, ref) => (
	<Marker
		name={name}
		onClick={handleMarkerClick}
		position={position}
		url={url}
		icon={{
			url: url,
			scaledSize: new google.maps.Size(size, size)
		}}
	/>
)

export default MyMarker
