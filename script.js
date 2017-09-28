let lat, lon, URL;
const method = 'GET';

/**
 * Find location coordinates of current location of user and returns it by wrapping in Promise
 * 
 * @returns - a Promise object that holds the value of latitude, longitude
 */
function getLocation() {
    return new Promise(function(resolve, reject){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            resolve(`${lat} ${lon}`);
            }, 
            function (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    reject('Permission denied');
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    reject('User denied the request for Geolocation.');
                } else if (error.code === error.TIMEOUT) {
                    reject('Location information is unavailable.');
                } else if (error.code === error.TIMEOUT) {
                    reject('The request to get user location timed out.');
                } else if (error.code === error.UNKNOWN_ERROR) {
                    reject('An unknown error occurred.');
                }
            });
        }
    });
}

/**
 * Find weather data against a specific latitude, longitude and returns it by wrapping in a Promise
 * 
 * @param method - method of fetching data (like GET)
 * @param URL - address to fetch data from
 * @returns - a Promise object holding weather data 
 */
function getWeather(method, URL) {
    return new Promise(function(resolve,reject){
        let xhr = new XMLHttpRequest();
        xhr.open(method, URL);
        xhr.send();
        xhr.onreadystatechange = function processRequest() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                resolve(response);
            }
        }
        xhr.onerror = function() {
            reject(xhr.statusText);
        }
    });
}

getLocation()
.then(function(location){
    let latlon = location.split(' ');
    URL = `https://fcc-weather-api.glitch.me/api/current?lat=${latlon[0]}&lon=${latlon[1]}&appid=a88cbd39be572d2c4b7f3418cd4b2a8b`;

    getWeather(method, URL)
    .then(function(data){
        //console.log(data);
        let town = data.name;
        let country = data.sys.country;
        let temperature = data.main.temp;
        let condition = data.weather[0].main;
        let tempICONLink = data.weather[0].icon;

        document.getElementById('location').innerText = `${town}, ${country}`;
        document.getElementById('temperature').innerText = `${temperature}°C`;
        document.getElementById('condition').innerText = condition;
        document.getElementById('temp-condition').src = tempICONLink;
    })
    .catch(function(err){
        console.log(err);
    });

})
.catch(function(error){
    document.getElementById('error-msg').innerText = `Couldn't load weather. Please try again.`;
});