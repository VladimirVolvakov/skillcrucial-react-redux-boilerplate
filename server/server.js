/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

let connections = []

const port = process.env.PORT || 3000
const server = express()
// const { readFile, writeFile, stat, unlink } = require('fs').promises

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const echo = sockjs.createServer()
echo.on('connection', (conn) => {
  connections.push(conn)
  conn.on('data', async () => {})

  conn.on('close', () => {
    connections = connections.filter((c) => c.readyState !== 3)
  })
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

/*
Лёша, вот об этом API я вел речь. Твои требования к нему согласно задания:
Создать следующее api:
get /api/v1/users - получает всех юзеров из файла users.json, если его нет - получает данные с сервиса https://jsonplaceholder.typicode.com/users и заполняет файл users.json y и возвращает данные.
В каждом API запросе вы должны установить заголовок перед тем, как вернуть ответ с помощью res.json
res.set('x-skillcrucial-user', 'e8c5c8c8-7de8-422e-a369-90ffad53b5a7');  
res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')


app.get('/api/v1/users', (req, res) => {
  res.stat(`${__dirname}/test.json`)  
  .then(data => JSON.stringify(data))  
   .catch((err) => axios('https://jsonplaceholder.typicode.com/users'))
     .then((response) => response.data)
       .then(data => JSON.stringify(data)))
  res.writeFile(`${__dirname}/test.json`, text, { encoding: "utf8" })
  res.set('x-skillcrucial-user', 'e8c5c8c8-7de8-422e-a369-90ffad53b5a7')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  res.json(`${__dirname}/test.json`)
  res.end()
})

app.post('/api/v1/users', (req, res) => {
  res.set('x-skillcrucial-user', 'e8c5c8c8-7de8-422e-a369-90ffad53b5a7')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  res.end()
})

app.patch('/api/v1/users/:userId', (req, res) => {
  res.set('x-skillcrucial-user', 'e8c5c8c8-7de8-422e-a369-90ffad53b5a7')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  res.end()
})

app.delete('/api/v1/users/:userId', (req, res) => {
  res.set('x-skillcrucial-user', 'e8c5c8c8-7de8-422e-a369-90ffad53b5a7')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  res.end()
})

app.delete('/api/v1/users/', (req, res) => {
  res.set('x-skillcrucial-user', 'e8c5c8c8-7de8-422e-a369-90ffad53b5a7')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  res.end()
})
*/

const app = server.listen(port)

echo.installHandlers(app, { prefix: '/ws' })

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
