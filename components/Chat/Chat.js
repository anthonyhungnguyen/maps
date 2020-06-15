import React, { useState, useEffect } from 'react'

import Messages from './Messages/Messages'
import InfoBar from './InfoBar/InfoBar'
import Input from './Input/Input'

import './Chat.css'

const Chat = ({ room, name, socket }) => {
	const [ message, setMessage ] = useState('')
	const [ messages, setMessages ] = useState([])
	useEffect(() => {
		socket.emit('join', { name, room }, (error) => {
			if (error) {
				alert(error)
			}
		})
	}, [])

	useEffect(() => {
		const oldMessages = JSON.parse(localStorage.getItem('oldMessages'))
		if (oldMessages) {
			setMessages(oldMessages)
		}
		socket.on('message', (message) => {
			setMessages((messages) => {
				let newMessage = [ ...messages, message ]
				localStorage.setItem('oldMessages', JSON.stringify(newMessage))
				return newMessage
			})
		})
	}, [])

	const sendMessage = (event) => {
		event.preventDefault()

		if (message) {
			socket.emit('sendMessage', message, () => setMessage(''))
		}
	}

	return (
		<div className='outerContainer shawdow-2xl chat_box'>
			<span />
			<span />
			<span />
			<span />
			<div className='container'>
				<InfoBar room={room} />
				<Messages messages={messages} name={name} />
				<Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
			</div>
		</div>
	)
}

export default Chat
