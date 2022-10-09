var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

var fs = require('fs');

//global variable for tweet data
var tweetinfo = []
//global variable for all recently searched tweets
var searchedArray = []
//global variable to display one searched tweet
var searchedObject = {};

//Load the input file
fs.readFile('favs.json', 'utf8', function readFileCallback(err,data ){
  if(err){
    req.log.info('cannot load a file:' + fileFolder + '/' + _file_name)
    throw err;
  }
  else{
    //Store loaded data into a global variable for tweet data
      tweetinfo = JSON.parse(data);
  }
});

//Get functions
//Shows user info
app.get('/tweets', function(req, res) {
  res.send({tweetinfo: tweetinfo})
});

//Shows tweet info
app.get('/tweetinfo', function(req, res) {  
  res.send({tweetinfo : tweetinfo})
});

//Shows all recently searched tweets
app.get('/searchAll', function(req,res){
  res.send({searchedArray:searchedArray});
});

//Show one searched tweet
app.get('/searchinfo', function(req, res){
  res.send({searchedObject: searchedObject})
});

//Post functions
//Posts created tweets
app.post('/tweetinfo', function(req, res) {
  var inputText = req.body.name;
  inputText = inputText.split(';');

  // Split the input information into id and text variables
  var tweetId = inputText[0];
  var tweetText = inputText[1];
  var today  = (new Date(Date.now())).toString();

  var found = false;

  // Search through the tweetinfo array
  tweetinfo.forEach(function(product){
    if(product.id == tweetId){
        found = true;
    }
  })

  // If data is not already in the array, push it in
  if(!found){
    tweetinfo.push({
      id: tweetId,
      text: tweetText,
      created_at: today,
  })
  }  
    res.send('Successfully created product! ');

});

//Posts searched tweets
app.post('/searchinfo', function(req, res) {
  //Search a tweet and put it in the searchedArray
  var id = req.body.id;
  var found = false;

  searchedArray.forEach(function(product){
    // If the id we've been passed already exists in the searched array, 
    // found becomes true
    if(product.id == id){
      found = true;
    }
  })

  /* Iterate throught the tweetinfo array, if we have not found the given
   id in the searched array and the id matches the id of that in the
   tweet info array, we push the info from the tweet array into the searched 
   array and the id matches, we get info from the tweet array and push it to 
   the searchedArray */
  tweetinfo.forEach(function(product){
    if(product.id == id && !found){
      searchedArray.push({
        id: id,
        text: product.text,
        created_at: product.created_at,
      })

    }
  });

  // Assign the most recently searched object to this global variable
  searchedObject = searchedArray[searchedArray.length - 1];
  res.send('Successfully searched a tweet!')

});

//Update screen name
app.put('/tweets/:nm', function(req, res) {
  //Update tweets
  var name = req.body.nm;
  var newName = req.body.newName;
  var found = false;

  // update the user's screen name
  tweetinfo.forEach(function(product){
    if(!found && product.user.name == name){
      product.user.screen_name = newName;
    }
  })
  res.send('Successfully updated product!')
});

//Delete tweet 
app.delete('/tweetinfo/:tweetid', function(req, res) {
  var id = req.body.tweetid;
  var found = false;

  //search for the tweet to delete and remove it from the array
  tweetinfo.forEach(function(product, index){
    if(!found && (product.id == id)){
      tweetinfo.splice(index, 1);
    }
  })
  res.send('Successfully deleted tweet')
});

app.listen(PORT, function() {
  console.log('Server listening on ' + PORT);
});