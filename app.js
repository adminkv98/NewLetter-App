//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
 const request =  require("request");

const app = express();

app.use(express.static("public"));    //to imlpement static file i.e CSS and images.
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
   res.sendFile(__dirname+"/signup.html");
   console.log(req);
});

app.post("/",function(req,res){
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;


  console.log(fname);
  console.log(lname);
  console.log(email);
  console.log(message);

 const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields : {
          FNAME : fname,
          LNAME : lname,
          EMAIL : email,
          MESSAGE : message,
        }

      }
    ]
  };

  const jsonData = JSON.stringify(data);

   const url = "https://us18.api.mailchimp.com/3.0/lists/4f9183b6b2";  //us-18

  const options = {
    method : "POST",
    auth : "adarsh:ab1dbc4eacecc5143e7bf1b7ab4a187a-us18",  //api key
  };

  const request =  https.request(url, options, function(response){       //https will help to connect with the others server. it can have https.request(upload the data) and https.get(download the data)

       if(response.statusCode ===200){
         res.sendFile(__dirname+"/success.html");
       }
       else{
         res.sendFile(__dirname+"/failure.html");
       }

     response.on("data",function(data){   //response.on (it will print the response of the website where we will upload the data.)
      console.log(JSON.parse(data));    //JSON.parse(data) will convert the data into javaScript Object.
     });
  });

      request.write(jsonData);
      request.end();
      

});

app.post("/failure",function(req,res){
  res.redirect("/");    //it will redirect to the home page.
});

app.post("/success",function(req,res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000,function(){  //process.env.PORT is a dynamic port which heroku will define.
  console.log("server is running on post 3000");
});

//data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}'

//API KEY
//ab1dbc4eacecc5143e7bf1b7ab4a187a-us18

//list ID
//4f9183b6b2
