const SelectRadius = ({ setCurrentButtonName, setPageToken, setRadius }) => (
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
)

export default SelectRadius
