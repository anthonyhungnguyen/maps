const SelectTypes = ({ setCurrentButtonName, setPageToken, setType }) => (
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
)

export default SelectTypes
