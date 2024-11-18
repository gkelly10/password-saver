const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var db;

const url = "mongodb+srv://gabbie:Colby@cluster0.mggu4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "password-saver";

app.listen(4000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', (req, res) => {//get route / which is just the main page
    db.collection('passwords').find().toArray((err, result) => {//retrives documents from the passwords collection in mongo and turns them into an array
        if (err) return console.log(err);//runs after the array is complete
        res.render('index.ejs', { passwords: result });//renders the passwords as a result (?)
    });
});


app.post('/passwords', (req, res) => {//route for passwords | POST method
    db.collection('passwords').insertOne({//adds a new document to the passwords collection in mongo with the values of website, username, and password (comes from the form)
        website: req.body.website,
        username: req.body.username,
        password: req.body.password
    }, (err, result) => {
        if (err) return console.log(err);
        console.log('Password saved to database');
        res.redirect('/');//redirects back to the root url to refresh the page with the post there now
    });
});

//PUT route to edit password
app.put('/passwords/edit', (req, res) => {//PUT route for the edits. puts new stuff into the route
    db.collection('passwords')
        .findOneAndUpdate({ _id: new require('mongodb').ObjectId(req.body.id) }, {//this is searching documents by id now//makes it specific for the server what document to update bcs each one has a unique id
            $set: {//updating website, username, password
                website: req.body.website,
                username: req.body.username,
                password: req.body.password
            }
        }, {
            upsert: true//creates a document if it dsn't exist
        }, (err, result) => {
            if (err) return res.send(err);
            res.send(result);
        });
});


app.delete('/passwords', (req, res) => {
    db.collection('passwords').findOneAndDelete({ _id: new require('mongodb').ObjectId(req.body.id) }, (err, result) => {//looking for the doument to dlete//specifies the document to be deleted by id
        if (err) return res.send(500, err);
        res.send('Password deleted!');
    });
});

