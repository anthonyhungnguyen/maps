const DetailsView = ({ detailsView }) =>
	detailsView.length > 0 && (
		<div className='fixed right-0 h-screen w-1/4 bg-white overflow-scroll'>
			<h1 className='bg-white shadow-lg text-center py-2 border m-2 border-gray-600 rounded'>Shopping Mall</h1>
			{detailsView}
		</div>
	)

export default DetailsView
