const http = require('http')
const fs   = require('fs')

const path = require('path')
const fetch = require('request')

const port = 8080

const handleRequest = (request, response) => {
    if (request.url == "/") {
        fs.readFile("./app/index.html", "UTF-8" , (err,file) => {
            if (err) throw err
            response.writeHead(200,{"Content-Type": "text/html"})
            response.end(file)
        })
    }else if ( request.url.match("\.css$")){
        let csspath = path.join(__dirname,"app",request.url)
        let file    = fs.createReadStream(csspath,"UTF-8")
        response.writeHead(200,{"Content-Type":"text/css"})
        file.pipe(response)
    }
    else if ( request.url.match("\.png$")){
        let imgpath = path.join(__dirname,"app",request.url)
        let file    = fs.createReadStream(imgpath)
        response.writeHead(200,{"Content-Type":"image/css"})
        file.pipe(response)
    }
    else if ( request.url.match("\.js$")){
        let jspath  = path.join(__dirname,"app",request.url)
        let file    = fs.createReadStream(jspath,"UTF-8")
        response.writeHead(200,{"Content-Type":"text/css"})
        file.pipe(response)
    }
    else{
        response.writeHead(404,{"Content-Type": "text/html"})
        response.end("Page Not Found")
    }
}
 
if (http.createServer(handleRequest).listen(port)) {
    console.log(`SERVER STARTED @ : http://127.0.0.1:${port}`)
}else{
    console.log("Error Occur")
}