import React, { useState } from 'react'
import FetchPlaces from './Toolbar/Utils/FetchPlaces'
import SelectRadius from './Toolbar/Utils/SelectRadius'
import SelectTypes from './Toolbar/Utils/SelectTypes'
import FetchDirection from './Toolbar/Utils/Direction/FetchDirection'
import DirectionResult from './Toolbar/Utils/Direction/DirectionResult'
import DetailsView from './Toolbar/DetailsView'
const Toolbar = ({
	setIsLoading,
	currentButtonName,
	coordinate,
	changeTabCurrentPlaces,
	setCurrentButtonName,
	setFetchPlaces,
	setRecPlaces,
	endLocation,
	endName,
	setDirectionsResult,
	setChangeTabCurrentPlaces,
	handleMarkerClick,
	directionsResult
}) => {
	const [ type, setType ] = useState('shopping_mall')
	const [ typeName, setTypeName ] = useState('Shopping Mall')
	const [ radius, setRadius ] = useState(5000)
	const [ pageToken, setPageToken ] = useState(null)
	const [ detailsView, setDetailsView ] = useState([])
	const [ recView, setRecView ] = useState([])
	return (
		<React.Fragment>
			<div className='fixed top-0 m-4'>
				<FetchPlaces
					setIsLoading={setIsLoading}
					currentButtonName={currentButtonName}
					coordinate={coordinate}
					radius={radius}
					type={type}
					setTypeName={setTypeName}
					pageToken={pageToken}
					setPageToken={setPageToken}
					setCurrentButtonName={setCurrentButtonName}
					setFetchPlaces={setFetchPlaces}
					setRecPlaces={setRecPlaces}
					setDetailsView={setDetailsView}
					setRecView={setRecView}
					handleMarkerClick={handleMarkerClick}
				/>
				<SelectRadius
					setCurrentButtonName={setCurrentButtonName}
					setPageToken={setPageToken}
					setRadius={setRadius}
				/>

				<SelectTypes
					setCurrentButtonName={setCurrentButtonName}
					setPageToken={setPageToken}
					setType={setType}
				/>

				<FetchDirection
					setDirectionsResult={setDirectionsResult}
					endName={endName}
					coordinate={coordinate}
					endLocation={endLocation}
				/>

				{directionsResult ? <DirectionResult directionsResult={directionsResult} /> : null}
			</div>
			<DetailsView
				detailsView={detailsView}
				typeName={typeName}
				recView={recView}
				changeTabCurrentPlaces={changeTabCurrentPlaces}
				setChangeTabCurrentPlaces={setChangeTabCurrentPlaces}
			/>
		</React.Fragment>
	)
}

export default Toolbar
