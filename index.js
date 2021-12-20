const express = require('express')
const path = require('path')
const app = express()
const port = 8080
var database = require('./models/database')
var expHandles = require('express-handlebars')

app.listen(port)

/* Serve static content from directory "public", it will be accessible under path /static, 
   e.g. http://localhost:8080/static/index.html */
app.use('/static', express.static(__dirname + '/public'))

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }))

// parse application/json content from body
app.use(express.json())

// add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// register handlebars as function 
app.engine('handlebars', expHandles());
app.set('view engine', 'handlebars');

// serve index.html as content root
app.get('/', function(req, res){
    var options = {
        root: path.join(__dirname, 'public')
    }
    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})

/* Receives GET request for getting the list of favorite works */
app.get('/getFavorites', function(req, res) {
    console.log("APPSERVER: REQUEST FOR FAVORITES LIST");
    let favorites = database.getFavorites();
    res.send(favorites);
})


/* Receives GET request for opening the favorite works page */
app.get('/showFavorites', function(req, res) {
    console.log("APPSERVER: REQUEST TO SHOW FAVORITE WORKS");
    let favorites = database.getFavorites();
    res.render('favorites', 
    {
        pageTitle: "Penguin Random House: Λίστα Αγαπημένων",
        header: "Λίστα Αγαπημένων",
        favorites: favorites
    });
})

/* Receives POST request for adding favorite work and uses DAO module
   Responds to main.js with a 201 or a 409 code based on whether the addition was successfull or not*/
app.post('/addFavorite', function(req, res){
    console.log("APPSERVER: REQUEST TO ADD A FAVORITE WORK");
    if(database.addFavorite(req.body.id, req.body.title, req.body.author)){
        res.status(201).send();
        return;
    }
    // item already exists
    res.status(409).send(); 
})

/* Receives POST request for removing favorite work and uses DAO module
   Responds to main.js with a 201 or a 409 code based on whether the removal was successfull or not*/
app.post('/removeFavorite', function(req, res){
    console.log("APPSERVER: REQUEST TO REMOVE A FAVORITE WORK");
    if(database.removeFavorite(req.body.id)){
        res.status(200).send();
        return;
    }
    //something went wrong with server/database
    res.status(409).send();  
})

// Receives GET request for opening the Edit page
app.get('/editFavorite', function(req, res){
    console.log("APPSERVER: REQUEST TO EDIT A FAVORITE WORK");
    let toEdit = database.getFavorite(req.query.id);
    if(toEdit==null) return;
    res.render('edit-view', 
    {
        pageTitle: "Penguin Random House: Επεξεργασία Έργου",
        header: "Επεξεργασία Αγαπημένου Έργου",
        id: toEdit.id,
        title: toEdit.title,
        author: toEdit.author,
        comments: toEdit.comments
    });
})

/* Receives POST request from Edit form to try to save the edited favorite work
   Responds to main.js with a 200 or a 409 code based on whether the editing was successfull or not*/
   app.post('/saveFavorite', function(req, res){
    console.log("APPSERVER: REQUEST TO SAVE AN EDITED FAVORITE WORK");
    if(database.updateFavorite(req.body.id, req.body.title, req.body.author, req.body.comments)){
        res.status(200).send();
    }
    //something went wrong with server/database
    res.status(409).send(); 
})
