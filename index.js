import express from 'express'
import cors from 'cors'

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello'})
})
app.use(express.json());
app.use(cors());

app.listen(3000, (err) => {
    if (err) {
      console.log('Ошибка сервера')
    }
    console.log("Server OK");
  });