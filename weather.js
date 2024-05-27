const apiKey = 'c97034aa2c77c983e9ea3d4eab09cfc7';
const weatherInfo = document.getElementById('weather-info');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
function displayWeatherInfo(data) {
    if (data && data.cod === 200) {
        const { name, weather, main } = data;
        const { description, icon } = weather[0];
        const { temp, humidity } = main;

        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const weatherHTML = `
            <h2>${name}</h2>
            <img src="${iconUrl}" alt="${description}">
            <p>${description}</p>
            <p>Temperature: ${temp} &deg;C</p>
            <p>Humidity: ${humidity}%</p>
        `;

        weatherInfo.innerHTML = weatherHTML;
    } else if (data && data.cod === '404') {
        weatherInfo.innerHTML = '<p>City not found. Please enter a valid city name.</p>';
    } else {
        weatherInfo.innerHTML = '<p>Unable to fetch weather data.</p>';
    }
}
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city) {
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
    } else {
        weatherInfo.innerHTML = '<p>Please enter a city name.</p>';
    }
});
navigator.geolocation.getCurrentPosition(
    async (position) => {
        const { latitude, longitude } = position.coords;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            displayWeatherInfo(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherInfo.innerHTML = '<p>Unable to fetch weather data for your location.</p>';
        }
    },
    () => {
        weatherInfo.innerHTML = '<p>Unable to get your location. Please enter a city name.</p>';
    }
);