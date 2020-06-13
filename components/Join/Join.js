import React, { useState } from 'react'
import { useRouter } from 'next/router'

import './Join.css'

export default function SignIn() {
	const [ name, setName ] = useState('')
	const [ room, setRoom ] = useState('')
	const router = useRouter()

	const handleJoin = () => {
		router.push({
			pathname: '/chatRoom',
			query: { name: name, room: room }
		})
	}

	return (
		<div className='joinOuterContainer'>
			<div className='joinInnerContainer'>
				<h1 className='heading'>Join</h1>
				<div>
					<input
						placeholder='Name'
						className='joinInput'
						type='text'
						onChange={(event) => setName(event.target.value)}
					/>
				</div>
				<div>
					<input
						placeholder='Room'
						className='joinInput mt-20'
						type='text'
						onChange={(event) => setRoom(event.target.value)}
					/>
				</div>
				<a onClick={(e) => (!name || !room ? e.preventDefault() : null)}>
					<button className={'button mt-20'} type='submit' onClick={handleJoin}>
						Sign In
					</button>
				</a>
			</div>
		</div>
	)
}
