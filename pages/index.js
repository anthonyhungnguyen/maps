import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react'
import axios from 'axios'

const Home = ({ google }) => {
	const [showingInfoWindow, setShowingInfoWindow] = useState(false)
	const [activeMarker, setActiveMarker] = useState({})
	const [selectedPlace, setSelectedPlace] = useState({})
	const [coordinate, setCoordinate] = useState(null)

	useEffect(() => {
		const loadCurrentLocations = () => {
			if (navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((pos) => {
					setCoordinate({
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					})
				})
			}
		}
		loadCurrentLocations()
	}, [])

	const handleMarkerClick = (props, marker) => {
		setSelectedPlace(props)
		setActiveMarker(marker)
		setShowingInfoWindow(true)
	}

	const handleCloseInfoWindow = () => {
		if (showingInfoWindow) {
			setShowingInfoWindow(false)
			setActiveMarker(null)
		}
	}

	const handleFetchNearbyPlaces = async () => {
		await axios
			.get(
				'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=10.748127710852733,106.6128096443417&radius=500&types=food&key=AIzaSyDmbl-UzpILeyTFM5_UbvCRiLHa5-6yhpU'
			)
			.then((data) => console.log(data.json()))
	}

	return (
		<div className='container'>
			<Head>
				<title>Create Next App</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			{coordinate ? (
				<>
					<button onClick={handleFetchNearbyPlaces}>
						Click to get nearby address
					</button>
					<Map
						google={google}
						zoom={14}
						style={{ width: '100%', height: '100%' }}
						initialCenter={coordinate}
					>
						<Marker onClick={handleMarkerClick} name={'Current Location'} />
						<InfoWindow
							marker={activeMarker}
							visible={showingInfoWindow}
							onClose={handleCloseInfoWindow}
						>
							<div>
								<h4>{selectedPlace.name}</h4>
							</div>
						</InfoWindow>
					</Map>
				</>
			) : null}
		</div>
	)
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyCVBthtEmWi0Ul8mejDQrBlOULXB1kTB3I',
})(Home)
