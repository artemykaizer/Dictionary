const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const ObjectID = require('mongodb').ObjectID
const translation = require('./translation').makeTranslation
const url = 'mongodb://heroku_3mqcpfjp:heroku_3mqcpfjp@ds117362.mlab.com:17362/heroku_3mqcpfjp'
let db = {}

MongoClient.connect(url, { useNewUrlParser: true } , (err, client) => {
  if(err) throw new Error(err.message)

  db = client.db('heroku_3mqcpfjp').collection('words')
})

const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {
    db.find({}).toArray((err, words) => {
      if(err) throw new Error(err.message)

      res.json(words)
    }) 
  });

  app.delete('/api/delete/:id', jsonParser, (req, res) => {
    db.findOneAndDelete({'_id': new ObjectID(req.params.id)}, (err, word) => {
      if(err) throw new Error(err.message)

      res.send(word)
    }) 
  })

  app.post('/api/new', jsonParser, (req, res) => {
    translation(req.body.word, trans => {
      const wordWithTranslation = {
        word: req.body.word,
        translation: trans
      }
      db.insertOne(wordWithTranslation, (err, result) => {
        if(err) {
            res.send({ 'error': 'An error has occurred' }); 
        }
        console.log(result.ops)
        res.send(result.ops[0]);
      }) 
    })
})


  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
