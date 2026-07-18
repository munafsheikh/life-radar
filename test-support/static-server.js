const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../dist')
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

http
  .createServer(function (request, response) {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const requested = pathname === '/' ? '/index.html' : pathname
    const filePath = path.resolve(root, '.' + requested)
    const safePath = filePath.startsWith(root) ? filePath : path.join(root, 'index.html')

    fs.readFile(safePath, function (error, contents) {
      if (error) {
        fs.readFile(path.join(root, 'index.html'), function (fallbackError, fallback) {
          response.writeHead(fallbackError ? 404 : 200, { 'Content-Type': 'text/html' })
          response.end(fallbackError ? 'Not found' : fallback)
        })
        return
      }
      response.writeHead(200, { 'Content-Type': contentTypes[path.extname(safePath)] || 'application/octet-stream' })
      response.end(contents)
    })
  })
  .listen(4173, '127.0.0.1')
