const DetailsView = ({ detailsView, recView, typeName, changeTabCurrentPlaces, setChangeTabCurrentPlaces }) =>
	detailsView.length > 0 && (
		<div className='fixed right-0 h-screen w-1/4 bg-white overflow-scroll'>
			<div className='flex'>
				<button
					className='bg-white shadow-lg text-center py-2 border m-2 border-gray-600 rounded w-full'
					onClick={() => setChangeTabCurrentPlaces(true)}
				>
					{typeName}
				</button>
				<button
					className='bg-white shadow-lg text-center py-2 border m-2 border-gray-600 rounded w-full'
					onClick={() => setChangeTabCurrentPlaces(false)}
				>
					Recommended places
				</button>
			</div>

			{changeTabCurrentPlaces ? detailsView : recView}
		</div>
	)

export default DetailsView
