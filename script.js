const apiKey = 'df444c36b2fa2a7aad20b4f2d54a33d2'; 
const form = document.querySelector('#weather-form');
const input = document.querySelector('#city-input');
const weatherResult = document.querySelector('#weather-result');
const forecastContainer = document.querySelector('#forecast');
const unitToggle = document.querySelector('#unit-toggle');
const spinner = document.querySelector('.loading-spinner');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = input.value;

    getWeather(city);
    getForecast(city);
});


const getWeather = (city) => {
    const unit = unitToggle.checked ? 'imperial' : 'metric';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    weatherResult.innerHTML = ''; 
    spinner.style.display = 'block'; 

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const temp = data.main.temp;
            const weather = data.weather[0].description;
            weatherResult.innerHTML = `Temperature: ${temp}°${unitToggle.checked ? 'F' : 'C'} <br> Weather: ${weather}`;
        })
        .catch(error => {
            weatherResult.innerHTML = `Error: ${error.message}`;
        })
        .finally(() => {
            spinner.style.display = 'none';
        });
};

// Function to get 5-day forecast
const getForecast = (city) => {
    const unit = unitToggle.checked ? 'imperial' : 'metric';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    forecastContainer.innerHTML = '<h3>Loading forecast...</h3>';
    spinner.style.display = 'block'; 

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not available');
            }
            return response.json();
        })
        .then(data => {
            forecastContainer.innerHTML = `<h3>5-Day Forecast</h3>`;
            
            data.list.forEach((item, index) => {
                if (index % 8 === 0) { 
                    const date = new Date(item.dt * 1000);
                    const formattedDate = date.toLocaleDateString();
                    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const temp = item.main.temp;
                    const weather = item.weather[0].description;
                    const icon = item.weather[0].icon;

                    forecastContainer.innerHTML += `
                        <div class="forecast-item">
                            <p>${formattedDate} - ${formattedTime}</p>
                            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${weather}" />
                            <p>Temp: ${temp}°${unitToggle.checked ? 'F' : 'C'}</p>
                            <p>${weather}</p>
                        </div>
                    `;
                }
            });
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            spinner.style.display = 'none'; 
        });
};
