import axios from 'axios'
import { Circle, GoogleApiWrapper, InfoWindow, Map, Polyline, Marker } from 'google-maps-react'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { w3cwebsocket as WebSocket } from 'websocket'
import ChangeMapType from '../components/ChangeMapType'
import Toolbar from '../components/Toolbar/Toolbar'
import { getDistance } from '../utils/supplement'
import DetailsView from '../components/DetailsView'

var connection = new WebSocket('ws://whispering-eyrie-31099.herokuapp.com')

const Home = ({ google }) => {
	const [ showingInfoWindow, setShowingInfoWindow ] = useState(false)
	const [ activeMarker, setActiveMarker ] = useState({})
	const [ selectedPlace, setSelectedPlace ] = useState({})
	const [ coordinate, setCoordinate ] = useState(null)
	const [ fetchPlaces, setFetchPlaces ] = useState([])
	const [ circles, setCircles ] = useState([])
	const [ circleLocations, setCircleLocations ] = useState([])
	const [ currentButtonName, setCurrentButtonName ] = useState(`What's nearby?`)
	const [ endLocation, setEndLocation ] = useState({})
	const [ endName, setEndName ] = useState('')
	const [ directionsResult, setDirectionsResult ] = useState()
	const [ detailsView, setDetailsView ] = useState([])
	const mapRef = useRef()

	useEffect(() => {
		const loadCurrentLocations = () => {
			if (navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((pos) => {
					setCoordinate({
						lat: pos.coords.latitude,
						lng: pos.coords.longitude
					})
				})
			}
		}

		const loadCoronaInfo = async () => {
			await axios.get('/api/warning').then((resp) => {
				const coronaInfo = resp.data.data
				const circleCenter = coronaInfo.map((c) => ({
					lat: c.lat,
					lng: c.lng
				}))
				setCircleLocations(circleCenter)
				const circles = coronaInfo.map((c, index) => (
					<Circle
						key={index}
						radius={400}
						center={{
							lat: c.lat,
							lng: c.lng
						}}
						onMouseover={() => {
							const Msg = (
								<div className='bg-black'>
									<p>
										<span className='font-bold'>Name</span>: {c.name}
									</p>
									<p>
										<span className='font-bold'>Address</span>: {c.address}
									</p>
									<p>
										<span className='font-bold'>Timeline</span>: {c.verifyDate.split('T')[0]}
									</p>
									<p>
										<span className='font-bold'>Note</span>: {c.note}
									</p>
								</div>
							)
							toast.dark(Msg, {
								position: 'top-center',
								autoClose: 3000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined
							})
						}}
						strokeColor='transparent'
						strokeOpacity={0}
						strokeWeight={5}
						fillColor='#FF0000'
						fillOpacity={0.2}
					/>
				))
				setCircles(circles)
			})
		}

		loadCoronaInfo()
		loadCurrentLocations()
		window.WebSocket = window.WebSocket || window.MozWebSocket
	}, [])

	connection.onopen = function() {
		console.log('Connect success')
	}

	connection.onerror = function(error) {}

	connection.onmessage = async function(message) {
		if (mapRef.current && message) {
			let m = JSON.parse(String(message.data))
			let newCoor = {
				lat: parseFloat(m.latitude),
				lng: parseFloat(m.longitude)
			}
			mapRef.current.map.setCenter(newCoor)

			handleCheckInDanger(newCoor)
			setCoordinate(newCoor)
		}
	}

	const handleCheckInDanger = (newCoor) => {
		if (circleLocations.length > 0 && newCoor) {
			let danger = false
			circleLocations.forEach((c) => {
				const distance = getDistance(newCoor, c)
				if (distance < 800) {
					danger = true
					return
				}
			})
			if (danger) {
				toast.warning('You are in danger zone !', {
					autoClose: 7000
				})
				connection.send(
					JSON.stringify({
						msg: 'TURN LIGHT ON'
					})
				)
			}
		}
	}

	const handleMarkerClick = (props, marker) => {
		setEndLocation(props.position)
		setEndName(props.name)
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

	return (
		<div className='container'>
			<Head>
				<title>Simple Maps</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			{coordinate ? (
				<div>
					<Map
						google={google}
						zoom={14}
						style={{ width: '100%', height: '100%' }}
						initialCenter={coordinate}
						ref={mapRef}
						mapTypeControl={false}
						zoomControl={false}
						fullscreenControl={false}
						streetViewControlOptions={{
							position: google.maps.ControlPosition.BOTTOM_CENTER
						}}
					>
						<Marker
							onClick={handleMarkerClick}
							name={'Current Location'}
							position={coordinate}
							icon={{
								url: '/images/currentLoc.png',
								scaledSize: new google.maps.Size(50, 50)
							}}
						/>
						{fetchPlaces ? fetchPlaces : null}
						{circles ? circles : null}
						{directionsResult ? (
							<Polyline
								path={directionsResult.path}
								strokeColor='#0000FF'
								strokeOpacity={0.8}
								strokeWeight={2}
							/>
						) : null}
						<InfoWindow marker={activeMarker} visible={showingInfoWindow} onClose={handleCloseInfoWindow}>
							<div>
								<h4>{selectedPlace.name}</h4>
							</div>
						</InfoWindow>
					</Map>

					<Toolbar
						currentButtonName={currentButtonName}
						coordinate={coordinate}
						setCurrentButtonName={setCurrentButtonName}
						setFetchPlaces={setFetchPlaces}
						setDetailsView={setDetailsView}
						endLocation={endLocation}
						endName={endName}
						setDirectionsResult={setDirectionsResult}
						handleMarkerClick={handleMarkerClick}
						directionsResult={directionsResult}
					/>
					<ChangeMapType mapRef={mapRef} />
					<DetailsView detailsView={detailsView} />
					<ToastContainer
						position='top-center'
						autoClose={1000}
						hideProgressBar={false}
						newestOnTop={true}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
				</div>
			) : null}
		</div>
	)
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyDmbl-UzpILeyTFM5_UbvCRiLHa5-6yhpU'
})(Home)
