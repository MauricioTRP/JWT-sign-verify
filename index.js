const express = require('express')
const jwt = require('jsonwebtoken')
const users = require('./data/users.js')
const app = express()


app.listen(3000, () => console.log('Your app listening on port 3000'))

app.use(express.json())
const secretKey = process.env.JWT_SECRET

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.post('/verify', (req, res) => {
  const { authorization } = req.headers
  const token = authorization.split(" ")[1]

  jwt.verify(token, secretKey, (err, data) => {
    if (err) {
      res.send("token inválido")
    } else {
      res.send(data)
    }
  })
})

app.post("/login", (req, res) => {
  const data = req.body
  const userExists = users.find(user => user.email == data.email && user.password == data.password)

  if (userExists) {
    const token = jwt.sign(userExists, secretKey, {
      expiresIn: 60
    })
    res.send(
      `<h1>Bienvenido</h1>
        <p>${userExists.email}</p>
        <script>
          sessionStorage.setItem('token', JSON.stringify("${token}"))
        </script>
      `

    )
  } else {
    res.send("Usuario inválido")
  }

})
