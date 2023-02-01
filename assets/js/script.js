// `lat={lat}&lon={lon}&appid={API key}`

// get form input


$("#search-form").on("submit", function(event){
    event.preventDefault()
    getWeatherData()
    
   
    
})

let getWeatherData = function () {
    // use Geocoding to conver city name to coordinates 
    var cityName =$("#search-input").val().trim()
    let querURL = `http://api.openweathermap.org/geo/1.0/direct?`
    // build queryparam object
    let queryParam = {"q": cityName}
    queryParam.limit = 1,
    queryParam.appid ="615905d8dd21c6c52a00c4cf33d5ef94"
    var query = querURL + $.param(queryParam) // generate query url ajax will use 
    // use ajax to get 
     $.ajax ({
        url: query,
        method: "Get"
    }).then(function(response){
        var cityLat = response[0].lat 
        var cityLon = response[0].lon
        var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?`
        var weatherUrlParam = {"lat": cityLat,
        "lon":cityLon,
        "appid": queryParam.appid}
        weatherQueryUrl = weatherUrl + $.param(weatherUrlParam)
        $.ajax({
            url: weatherQueryUrl,
            method: "GET"
        }).then(function(data){
            console.log(data)
        })
    })

}



// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


// use the input to present current and future weather conditions for the city
// add that city to the search history 


// user current view should have 
  // city name (The date) and An Icon rep of weather conditions
  // the temperature of current city 
  // The humidity 
  // the wind speed 



 // 5 days  future weather  forcast for the city card shold have 
     // The date 
     // an icon reping weather condition 
     // Temperature
     // Humidity 

 // search history 

     // should render current and future conditions for that city 