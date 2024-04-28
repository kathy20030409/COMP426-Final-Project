async function getWeather() {
    const apiKey = '905b0b58184fe072a63311caa98fcf8a';
    const city = document.getElementById('city-input').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const weatherDescription = data.weather[0].main;
        const temp = data.main.temp;

        document.getElementById('weather-result').innerHTML = `Current weather in ${city}: ${weatherDescription}, Temperature: ${temp}°C`;

        getImage(weatherDescription);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}