const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

let port = 3000

io.on('connect', (socket) => {
	socket.emit('now', {
		message: 'PHUCHUNG'
	})
})

io.on('connection', (socket) => {
	console.log('New client connected!')
	socket.on('room', (data) => {
		console.log(data)
	})
})

nextApp.prepare().then(() => {
	app.get('*', (req, res) => {
		return nextHandler(req, res)
	})

	server.listen(port, (err) => {
		if (err) throw err
		console.log('Ready on port: 3000')
	})
})
