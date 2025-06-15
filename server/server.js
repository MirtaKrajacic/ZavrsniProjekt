const express = require('express')
const app = express() // kreairamo express aplikaciju -> to je moj server

app.get("/api", (req, res) => { // kad netko posalje get zahtjev na moj server odgovor ce biti json u res
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(5000, () => {console.log("server started on port 5000")})