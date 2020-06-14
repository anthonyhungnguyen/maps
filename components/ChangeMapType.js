import React, { useState } from 'react'

const ChangeMapType = ({ mapRef }) => {
	const [ currentMapType, setCurrentMapType ] = useState('satellite')
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
		<div className='fixed bottom-0 m-4'>
			<button className='fancy' onClick={handleMapTypeChange}>
				<span className='top-key' />
				<p>{currentMapType}</p>
				<span className='bottom-key-1' />
				<span className='bottom-key-2' />
			</button>
			{/* <button>TURN LIGHT ON</button> */}
		</div>
	)
}

export default ChangeMapType
