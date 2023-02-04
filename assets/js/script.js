let storedSearches = []
// function to get weather data given city name
let getWeatherData = function (city) {  
    // use Geocoding to conver city name to coordinates 
    var cityName = city  // get input and trim the data 
    if(cityName){
         let querURL = `http://api.openweathermap.org/geo/1.0/direct?`  // geocordinates api base url
         // build queryparam object for geocordinates API that takes city name and get cordinates 
         let queryParam = {"q": cityName}
         queryParam.limit = 1,
         queryParam.appid ="615905d8dd21c6c52a00c4cf33d5ef94"
         var query = querURL + $.param(queryParam) // generate query url that ajax will use using param()
         // use ajax to get cordinates
         console.log(query)
         $.ajax ({
            url: query,
            method: "Get"
        }).then(function(response){
            if(!response || response.length === 0){
                alert("please enter a Valid city name")
            }else {
                console.log(response[0].lat)
                var cityLat = response[0].lat.toFixed(5) 
                var cityLon = response[0].lon.toFixed(5)
                var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?`  // base url for openweather 5 days forecast
                var weatherUrlParam = {"lat": cityLat,     // build params as an object for 5days openweather API url
                "lon":cityLon,
                "appid": queryParam.appid}
                 weatherQueryUrl = weatherUrl + $.param(weatherUrlParam) 
            }// put the url together 
            // use ajax to get weather data for city input
            $.ajax({
                url: weatherQueryUrl,
                method: "GET"
            }).then(function(weatherData){
                $("#today").empty() // empty current weather div
                var iconUrl = `http://openweathermap.org/img/w/`  // url for open weather API icons
                var iconId = weatherData.list[0].weather[0].icon
                var iconImgEl = $("<img>").attr("src", `${iconUrl}${iconId}.png`)
                var tempC = weatherData.list[0].main.temp - 273.15
                var descripEl = $("<p>").text(`Conditions: ${weatherData.list[0].weather[0].description}`)
                var tempEl = $("<p>").text(`Temp: ${tempC.toFixed(2)} °C`) 
                var windEl =$("<p>").text(`Wind ${weatherData.list[0].wind.speed} KPH`)
                var humEl = $("<p>").text(`Humidity ${weatherData.list[0].main.humidity}%`)
                var cityEl =$("<h2>").text(`${weatherData.city.name} (${moment(weatherData.list.dt).format("dddd, MMMM Do YYYY, h:mm a")})`)
                descripEl.append(iconImgEl)
                $("#today").append(cityEl,descripEl,tempEl,windEl,humEl)
                $("#today").removeClass("hide")
                var forcastHeader = $("<h2>").text(`5-Day Forecast:`)
                $("#title-head").empty()
                $("#forecast-card").empty()
                $("#title-head").append(forcastHeader)
    // 5 days  future weather  forcast for the city rendered as cards 
            for(let i=4; i< weatherData.list.length;i+=8) { 
                var cardDesEl= $("<p>").text(`Conditions: ${weatherData.list[0].weather[0].description}`)
                var cardEl = $("<div>").addClass("card col-lg-2 col-md-2 col-sm-12")
                var cardBodyEl = $("<div>").addClass("card-body")
                var cardTitleEl = $("<h5>").addClass("card-title").text(moment(weatherData.list[i].dt_txt).format("dddd Do"))
                var cardIconId = weatherData.list[i].weather[0].icon
                var cardIconEl = $("<img>").addClass("card-text").attr("src", `${iconUrl}${cardIconId}.png`)
                var cardTempC = weatherData.list[i].main.temp - 273.15
                var cardTempEl = $("<p>").addClass("card-text").text(`Temp: ${cardTempC.toFixed(2)} °C`)
                var cardWindEl = $("<p>").addClass("card-text").text(`Wind ${weatherData.list[i].wind.speed} KPH`)
                var cardHumEl = $("<p>").addClass("card-text").text(`Humidity ${weatherData.list[i].main.humidity}%`)
                cardEl.append(cardBodyEl,cardTitleEl,cardDesEl,cardIconEl,cardTempEl,cardWindEl,cardHumEl)
                $("#forecast-card").append(cardEl)}
             })
            })
        } else {
            alert("please enter a city name")
        }
    }

 // function to add search history to stored search array and localStorage
let appendSearchHistory = function (city) {
     storedSearches.push(city)
     localStorage.setItem("city",JSON.stringify(storedSearches))
    }   
// function to render search history as buttons from local storage
let renderHistory = function() {
    let cities = JSON.parse(localStorage.getItem("city"))
        for(i=0; i<cities.length;i++){
             var listEL = $("<ul>")
             var cityBtEl = $("<button>").addClass("list-item").text(cities[i])
             cityBtEl.attr("data-name", cities[i])
             listEL.append(cityBtEl)
             $("#history").append(listEL)
            }
        }

// add on submit event on search form to run required functions when a user hits enter or submit button
$("#search-form").on("submit", function(event){
    event.preventDefault() // prevent default 
     $("#history").empty() //Empty history 
    var city = $("#search-input").val().trim() // get city name which is required to run the getWeatherData function
    $.ajax({ // make an api call just to check if city is valid or not 
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=615905d8dd21c6c52a00c4cf33d5ef94`,
        method:"GET"
    }).then(function(response){
        // if response is empty due to city not
        if(!response || response.length === 0){
            renderHistory()
            alert("please enter a valid city")
        }else {
            appendSearchHistory(city) 
            getWeatherData(city)  
            $("#search-input").val("") // empty input field
            renderHistory() // disply search history
        }}
    )
})

// add on click event to any DOM element that belongs to the list-item class (only search history items belong top this class)
$(document).on("click", ".list-item", function(event){
    event.preventDefault()
    var city =$(this).data("name") // get the city name by its data-name attribute
    getWeatherData(city) // then run the getWeatherData function using that city name to get weather data 
  });


let intialiseLocalStorage = function () {
    renderHistory()// storedSearches = JSON.parse(localStorage.getItem("city")) 
}

intialiseLocalStorage()
  

 



