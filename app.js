const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const name = req.body.cityName;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    name +
    "&units=metric&appid=47254c811081cdfa7ba4064877fd3e38";
  https.get(url, function (response) {
    response.on("data", function (data) {
      const Weatherdata = JSON.parse(data);
      if(Weatherdata.cod!="200"){
        res.sendFile(__dirname+"/failure.html");
      }
    else{
      const temp=Weatherdata.main.temp;
      const cond=Weatherdata.weather[0].description;
      const windSpeed=Weatherdata.wind.speed;
      const humidity=Weatherdata.main.humidity;
      res.render('info',{temp: temp, description:cond, windSpeed:windSpeed, humidity:humidity});
    }});
  });
});

app.post("/failure",function(req,res){
  res.redirect("/");
});


app.listen(3000, function (response) {
  console.log("Server is running");
});
