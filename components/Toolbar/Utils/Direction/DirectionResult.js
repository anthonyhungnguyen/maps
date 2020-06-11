const DirectionResult = ({ directionsResult }) => (
	<div style={{ display: 'inline' }} className='p-2 bg-white hover:bg-black hover:text-white mr-2 font-semibold'>
		<span>Distance: {directionsResult.distance} </span>
		<span>Duration: {directionsResult.duration}</span>
	</div>
)
export default DirectionResult
