import React, { useState } from 'react'
import FetchPlaces from './Utils/FetchPlaces'
import SelectRadius from './Utils/SelectRadius'
import SelectTypes from './Utils/SelectTypes'
import FetchDirection from './Utils/Direction/FetchDirection'
import DirectionResult from './Utils/Direction/DirectionResult'
const Toolbar = ({
	currentButtonName,
	coordinate,
	setCurrentButtonName,
	setFetchPlaces,
	setDetailsView,
	endLocation,
	endName,
	setDirectionsResult,
	handleMarkerClick,
	directionsResult
}) => {
	const [ type, setType ] = useState('shopping_mall')
	const [ radius, setRadius ] = useState(5000)
	const [ pageToken, setPageToken ] = useState(null)
	return (
		<div className='fixed top-0 m-4'>
			<FetchPlaces
				currentButtonName={currentButtonName}
				coordinate={coordinate}
				radius={radius}
				type={type}
				pageToken={pageToken}
				setPageToken={setPageToken}
				setCurrentButtonName={setCurrentButtonName}
				setFetchPlaces={setFetchPlaces}
				setDetailsView={setDetailsView}
				handleMarkerClick={handleMarkerClick}
			/>
			<SelectRadius
				setCurrentButtonName={setCurrentButtonName}
				setPageToken={setPageToken}
				setRadius={setRadius}
			/>

			<SelectTypes setCurrentButtonName={setCurrentButtonName} setPageToken={setPageToken} setType={setType} />

			<FetchDirection
				setDirectionsResult={setDirectionsResult}
				endName={endName}
				coordinate={coordinate}
				endLocation={endLocation}
			/>

			{directionsResult ? <DirectionResult directionsResult={directionsResult} /> : null}
		</div>
	)
}

export default Toolbar
