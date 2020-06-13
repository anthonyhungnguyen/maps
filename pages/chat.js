import io from 'socket.io-client'
import { useEffect, useState } from 'react'

const socket = io()
const Chat = () => {
	const [ message, setMessage ] = useState('')
	const [ toSendMessage, setToSendMessage ] = useState('')
	useEffect(() => {
		socket.on('now', (data) => {
			setMessage(data.message)
		})
	}, [])

	const handleOnSubmit = (e) => {
		e.preventDefault()
		socket.emit('room', {
			message: toSendMessage
		})
		setToSendMessage('')
	}

	return (
		<div>
			<h1>Message: {message}</h1>
			<form onSubmit={handleOnSubmit}>
				<input
					type='text'
					placeholder='Enter message'
					value={toSendMessage}
					onChange={(e) => setToSendMessage(e.target.value)}
				/>
				<button>Send Message</button>
			</form>
		</div>
	)
}

export default Chat
