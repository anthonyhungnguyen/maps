import React, { createRef, useState } from 'react'
import { Marker } from 'google-maps-react'
import axios from 'axios'
import {
	handleFetchNearbyIcon,
	handleFetchNameFromType,
	handleFetchRecommendPlacesFromRules
} from '../../../utils/supplement'

const FetchPlaces = ({
	setIsLoading,
	currentButtonName,
	coordinate,
	radius,
	type,
	pageToken,
	setPageToken,
	setTypeName,
	setRecView,
	setFetchPlaces,
	setRecPlaces,
	setCurrentButtonName,
	setDetailsView,
	handleMarkerClick
}) => {
	const handleFetchNearbyPlacesData = (type) => {
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

	const handleBuildDetailsLocationView = (data, tempMarkerRefs, type) => {
		return data.map((each, index) => {
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
			const nearByIcon = handleFetchNearbyIcon(type)
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
	}

	const handleFetchRecommendPlaces = async (type) => {
		const rules = handleFetchRecommendPlacesFromRules(type)
		if (rules) {
			const recViews = []
			const places = []
			const rulesNeedResolve = rules.map(async (r) => {
				return new Promise(async (resolve) => {
					await handleFetchNearbyPlacesData(r).then((data) => {
						const nearByIcon = handleFetchNearbyIcon(r)
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

						recViews.push(...handleBuildDetailsLocationView(data, tempMarkerRefs, r))
						places.push(Markers)
						resolve()
					})
				})
			})
			await Promise.all(rulesNeedResolve).then(() => {
				setRecView(recViews)
				setRecPlaces(places)
			})
		}
	}

	const handleFetchNearbyPlacesOnMap = async () => {
		setIsLoading(true)
		const places = await handleFetchNearbyPlacesData(type).then(async (data) => {
			await handleFetchRecommendPlaces(type)
			const nearByIcon = handleFetchNearbyIcon(type)
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
			setDetailsView(handleBuildDetailsLocationView(data, tempMarkerRefs, type))
			setTypeName(handleFetchNameFromType(type))

			setIsLoading(false)
			return Markers
		})
		if (currentButtonName === `Find more`) {
			setFetchPlaces((old) => [ ...old, places ])
		} else {
			setFetchPlaces(places)
			setCurrentButtonName('Find more')
		}
	}
	return (
		<button
			onClick={handleFetchNearbyPlacesOnMap}
			className='p-2 bg-white hover:bg-black hover:text-white ml-2 font-semibold'
		>
			{currentButtonName}
		</button>
	)
}

export default FetchPlaces
