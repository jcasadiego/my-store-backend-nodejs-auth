const jwt = require('jsonwebtoken');

const secret = 'myCat';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInNjcm9wZSI6ImN1c3RvbWVyIiwiaWF0IjoxNjU3MzYwOTgyfQ.gYXcvfKJyNasWMzu8A4l7JPbTmnQnQXLTjqlj1hp_bA';

function verifyToken(token, secret){
  return jwt.verify(token, secret);
};

const payload = verifyToken(token, secret);
console.log(payload);
