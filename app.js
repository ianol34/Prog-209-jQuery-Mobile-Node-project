var express = require('express');
var path = require('path');

var bodyParser = require('body-parser');


var app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

let serverCarItemArray = [];


let CarObject = function(pCar, pPrice, pNote) {
    this.ID = Math.random().toString(16).slice(5)
    this.Car = pCar;
    this.Price = pPrice;
    this.Note = pNote;
}


serverCarItemArray.push(new CarObject("1989 Ferrari F40", "700000", "Hopefully I get rich so I can own one of these!"));
serverCarItemArray.push(new CarObject("1973 Toyota Landcruiser", "25000", "Great offroading vehicle!"));
serverCarItemArray.push(new CarObject("1949 Dodge Power Wagon", "75000", "Good investment piece."));
serverCarItemArray.push(new CarObject("1933 Packard 840", "150000", ""));




app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/CarList', function(req, res) {
    res.json(serverCarItemArray);
});


app.post('/addCarItem', function(req, res) {
    console.log(req.body);
    serverCarItemArray.push(req.body);

    res.status(200).send(JSON.stringify('success'));
});


app.delete('/deleteCarItem/:id', function(req, res) {
    let id = req.params.id;
    for (let i = 0; i < serverCarItemArray.length; i++) {
        if (id == (serverCarItemArray[i].ID)) {
            serverCarItemArray.splice(i, 1);
        }
    }
    res.status(200).send(JSON.stringify('deleted successfully'));
});

app.put('/modifyCarItem/:id', (req, res) => {
    let id = req.params.id;
    let CarObject = req.body;
    for (var i = 0; i < serverCarItemArray.length; i++) {
        if (serverCarItemArray[i].ID == id) {
            serverCarItemArray[i] = CarObject;
            res.send('success');
        }
    }
    res.status(404);
});




app.get('/error', function(req, res) {

    let message = "some text from someplace";
    let errorObject = {
        status: "this is real bad",
        stack: "somebody called #$% somebody who called somebody <awful>"
    };
    res.render('pages/error', {
        message: message,
        error: errorObject
    });
});



app.listen(3000);
console.log('3000 is the magic port');

module.exports = app;