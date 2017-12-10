const express      = require('express');
const request      = require('request');
const cookieParser = require('cookie-parser');
const path         = require('path');
const bodyparser   = require('body-parser');

const app = express();

//urlencodedParser to parse post request 
const urlencodedParser = bodyparser.urlencoded({extended : true});

//cookieParser to parse cookies
app.use(cookieParser());

app.get('/', function(req, res){
  res.send("Hello World - Aditya");
});

app.get('/authors', function(req, res){
  request('https://jsonplaceholder.typicode.com/users', function(err, response, body){
    if(err){
      console.log(err);
      res.send("Error");
    }
    else{
      if(response.statusCode === 200){
        let authors  = JSON.parse(body);
        let authorID = {};
        //creating new dictionary of authors
        authors.forEach(function(author){
          authorID[author['id']] = {
            "username"  : author["username"],
            "postCount" : 0 
          }
        });
        request('https://jsonplaceholder.typicode.com/posts', function(err, response, body){
          if(err){
            console.log(err);
            res.send("Error");
          }
          else{
            if(response.statusCode === 200){
              //Counting authors' posts
              JSON.parse(body).forEach(function(post){
                authorID[post["userId"]]["postCount"] += 1;
              });
              let resPage = '';
              for (let id in authorID){
                resPage = resPage + authorID[id]['username'] + ' ' + authorID[id]['postCount'] + '<br>';
              }
              res.send(resPage);
            }
            else{
              res.send("Remote connection not established");
            }
          }
        });
      }
      else{
        res.send("Remote connection not established");
     }
    }
  });
});

app.get('/setcookie', function(req, res){
  //Check if cookies already set
  if(req.cookies.name === undefined || req.cookies.age === undefined){
    //Set cookies
    res.cookie('name', 'Aditya').cookie('age', 19);
    res.send("Cookie created");
  }
  else{
    res.send("Cookie already exist");
  }
});

app.get('/getcookies', function(req, res){
  //Check if cookies are set
  if(req.cookies.name == undefined){
    res.send("Cookies not set");
  }
  else{
    //Display cookies data
    res.send(JSON.stringify(req.cookies));
  }
});

app.get('/robots.txt', function(req, res){
  res.status(403).send("Access Denied");
});

app.get('/image', function(req, res){
  res.sendFile(path.join(__dirname, 'resources', '1.jpg'));
});

app.get('/html', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'welcome.html'));
});

app.get('/input', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'input.html'));
});

app.post('/submit',urlencodedParser, function(req, res){
  console.log(req.body.value);
  res.send("Form submitted");
});

app.listen(8080, function(err){
  if(err)
    console.log(err);
  else
    console.log("Server listening on port 8080");
});
