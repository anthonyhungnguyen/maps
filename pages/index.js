import polyline from '@mapbox/polyline'
import axios from 'axios'
import { Circle, GoogleApiWrapper, InfoWindow, Map, Polyline, Marker } from 'google-maps-react'
import Head from 'next/head'
import React, { createRef, useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { w3cwebsocket as WebSocket } from 'websocket'
// import MyMarker from '../components/marker'

var connection = new WebSocket('ws://13.82.183.46:8080')

const Home = ({ google }) => {
	const [ showingInfoWindow, setShowingInfoWindow ] = useState(false)
	const [ activeMarker, setActiveMarker ] = useState({})
	const [ selectedPlace, setSelectedPlace ] = useState({})
	const [ coordinate, setCoordinate ] = useState(null)
	const [ radius, setRadius ] = useState(5000)
	const [ pageToken, setPageToken ] = useState(null)
	const [ type, setType ] = useState('shopping_mall')
	const [ fetchPlaces, setFetchPlaces ] = useState([])
	const [ circles, setCircles ] = useState([])
	const [ circleLocations, setCircleLocations ] = useState([])
	const [ currentButtonName, setCurrentButtonName ] = useState(`What's nearby?`)
	const [ endLocation, setEndLocation ] = useState({})
	const [ endName, setEndName ] = useState('')
	const [ directionsResult, setDirectionsResult ] = useState()
	const [ currentMapType, setCurrentMapType ] = useState('satellite')
	const [ detailsView, setDetailsView ] = useState([])
	const mapRef = useRef()
	// const connection = new WebSocket('wss://evening-depths-09838.herokuapp.com:8080')

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

	const rad = function(x) {
		return x * Math.PI / 180
	}

	const getDistance = function(p1, p2) {
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

	const handleFetchNearbyPlacesData = () => {
		return new Promise(async (resolve) => {
			resolve(
				await axios
					.post('/api/nearby', { coordinate, radius, type, pageToken })
					.then((response) => response.data)
					.then((data) => {
						setPageToken(data.next_page_token)
						return data
					})
			)
		})
	}

	const handleFetchNearbyIcon = () => {
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

	const handleFetchNearbyPlacesOnMap = async () => {
		const places = await handleFetchNearbyPlacesData().then((data) => {
			const nearByIcon = handleFetchNearbyIcon()
			const tempMarkerRefs = []
			const Markers = data.map((lc, index) => {
				tempMarkerRefs.push(createRef())
				return (
					<Marker
						name={lc.name}
						position={lc.geometry.location}
						key={index}
						onClick={handleMarkerClick}
						icon={{
							url: nearByIcon,
							scaledSize: new google.maps.Size(40, 40)
						}}
						ref={tempMarkerRefs[tempMarkerRefs.length - 1]}
					/>
				)
			})
			handleBuildDetailsLocationView(data, tempMarkerRefs)
			return Markers
		})
		if (currentButtonName === `Find more`) {
			setFetchPlaces((old) => [ ...old, places ])
		} else {
			setFetchPlaces(places)
			setCurrentButtonName('Find more')
		}
	}

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

	const handleLocationMouseOver = (index, nearByIcon, tempMarkerRefs) => {
		tempMarkerRefs[index].current.marker.setIcon({
			url: nearByIcon,
			scaledSize: new google.maps.Size(80, 80)
		})
	}

	const handleLocationMouseDown = (nearByIcon, tempMarkerRefs) => {
		tempMarkerRefs.forEach((m) => {
			m.current.marker.setIcon({
				url: nearByIcon,
				scaledSize: new google.maps.Size(40, 40)
			})
		})
	}

	const handleBuildDetailsLocationView = (data, tempMarkerRefs) => {
		setDetailsView(
			data.map((each, index) => {
				const renderedStar = []
				for (let i = 0; i < parseInt(each.rating); i++) {
					renderedStar.push(
						<span style={{ color: '#e7711b' }} key={Math.random().toString(36).substring(7)}>
							★
						</span>
					)
				}
				for (let i = 0; i <= 5 - renderedStar.length; i++) {
					renderedStar.push(<span key={Math.random().toString(36).substring(7)}>★</span>)
				}
				const nearByIcon = handleFetchNearbyIcon()
				return (
					<div
						className='border-b flex justify-between box-border hover:bg-gray-300'
						style={{ padding: '10px 18px 10px 24px', lineHeight: '16px' }}
						key={index}
						onMouseOver={() => handleLocationMouseOver(index, nearByIcon, tempMarkerRefs)}
						onMouseLeave={() => handleLocationMouseDown(nearByIcon, tempMarkerRefs)}
					>
						<div style={{ flex: '1' }}>
							<div className='flex flex-col justify-between'>
								<p className='text-sm font-semibold' style={{ color: '#202124' }}>
									{each.name}
								</p>
								<div className='pt-2'>
									<span style={{ color: '#e7711b', marginRight: '4px' }}>{each.rating}</span>
									{each.rating > 0 ? renderedStar : <span>0 ★★★★★ </span>}
									<span className='text-xs text-gray-600' style={{ marginLeft: '4px' }}>
										({each.user_ratings_total})
									</span>
								</div>
							</div>
							<div className='pt-2'>
								<p className='text-xs text-gray-500'>{each.vicinity}</p>
							</div>
						</div>
						<div
							className='inline-block'
							style={{
								height: '92px',
								width: '80px',
								marginLeft: '10px'
							}}
						>
							<img
								src={each.photoUrl !== '' ? each.photoUrl : nearByIcon}
								alt={each.name}
								className='pt-2'
								style={{
									height: '92px',
									width: '80px',
									backgroundSize: '80px 92px',
									verticalAlign: 'top',
									flex: '0 0 80px'
								}}
							/>
						</div>
					</div>
				)
			})
		)
	}

	const handleMapTypeChange = () => {
		if (mapRef.current.map.getMapTypeId() === 'roadmap') {
			setCurrentMapType('roadmap')
			mapRef.current.map.setMapTypeId(google.maps.MapTypeId.HYBRID)
		} else {
			setCurrentMapType('satellite')
			mapRef.current.map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
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
								url: require('../public/images/currentLoc.png'),
								scaledSize: new google.maps.Size(50, 50)
							}}
						/>
						{/* <MyMarker
							onClick={handleMarkerClick}
							position={coordinate}
							url={require('../public/images/currentLoc.png')}
							size={50}
						/> */}
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

					<div className='fixed top-0 m-4'>
						<button
							onClick={handleFetchNearbyPlacesOnMap}
							className='p-2 bg-white hover:bg-black hover:text-white ml-2 font-semibold'
						>
							{currentButtonName}
						</button>
						<select
							id='radius'
							onChange={(e) => {
								setCurrentButtonName(`What's nearby?`)
								setPageToken(null)
								setRadius(parseInt(e.target.value))
							}}
							defaultValue='5000'
							className='p-2 hover:bg-black hover:text-white mx-2 focus:bg-black focus:text-white font-semibold'
						>
							<option value='5000'>5km</option>
							<option value='10000'>10km</option>
							<option value='15000'>15km</option>
						</select>
						<select
							id='types'
							onChange={(e) => {
								setCurrentButtonName(`What's nearby?`)
								setPageToken(null)
								setType(e.target.value)
							}}
							defaultValue='shopping_mall'
							className='p-2 hover:bg-black hover:text-white mr-2 focus:bg-black focus:text-white font-semibold'
						>
							<option value='movie_theater'>Movie Theater</option>
							<option value='restaurant'>Restaurant</option>
							<option value='hair_care'>Hair Salon</option>
							<option value='cafe'>Coffee</option>
							<option value='bank'>Bank</option>
							<option value='shopping_mall'>Shopping Mall</option>
						</select>
						<button
							onClick={handleFetchDirection}
							className='p-2 bg-white hover:bg-black hover:text-white mr-2 font-semibold'
						>
							Go to {endName}
						</button>
						{directionsResult ? (
							<div style={{ display: 'inline' }}>
								<span>Distance: {directionsResult.distance} </span>
								<span>Duration: {directionsResult.duration}</span>
							</div>
						) : null}
					</div>
					<div className='fixed bottom-0 m-4'>
						<button className='fancy' onClick={handleMapTypeChange}>
							<span className='top-key' />
							<p>{currentMapType}</p>
							<span className='bottom-key-1' />
							<span className='bottom-key-2' />
						</button>
					</div>
					{detailsView.length > 0 && (
						<div className='fixed right-0 h-screen w-1/4 bg-white overflow-scroll'>
							<h1 className='bg-white shadow-lg text-center py-2 border m-2 border-gray-600 rounded'>
								Shopping Mall
							</h1>
							{detailsView}
						</div>
					)}
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
