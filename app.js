const http = require('http')
const fs = require('fs')
const stream = require('stream')



const server = http.createServer()



server.on('request', (req, res) => {
	const url = req.url

	if ( url === '/' ) {

		fs.readFile(__dirname + '/player.html', 'utf8', (err, text) => {
        	res.end(text);
    	});
	} else if (url === '/video') {
		const stat = fs.statSync("./0012. bubble-sort.mp4")
		const fileSize = stat.size
		const start = Number(req.headers.range.replace(/\D/g, ""))
		const chunk = 1000 * 10
		const end = Math.min(start + chunk, fileSize -1);
		const contentLength = end - start +1
		const header = {
			"Content-Type": "video/mp4",
			"Content-Range": `bytes ${start}-${end}/${fileSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": contentLength
		}
		const readStream = fs.createReadStream('./0012. bubble-sort.mp4', { start, end})
		res.writeHead(206,header)
		stream.pipeline(readStream, res, (err) => {
			if (err) {
				console.log(err)
			}
		})
	} else {
		res.statusCode = 404
		res.end("<h1>Not found</h1>")
	}
})


server.listen(5001, '127.0.0.1', () => {
	console.log('server is running')
})