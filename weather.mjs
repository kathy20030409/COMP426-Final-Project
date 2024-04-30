export class WeatherCard {
    constructor(temperature, cityName, description) {
      this.temperature = temperature;
      this.cityName = cityName;
      this.description = description;
    }
  
    static create(temperature, cityName, description) {
      return new WeatherCard(temperature, cityName, description);
    }

    getTemperature() {
      return this.temperature;
    }
  
    getCityName() {
      return this.cityName;
    }
  
    getDescription() {
      return this.description;
    }
  
    render() {
      return `
        <div class="weather-card">
          <h2>${this.cityName}</h2>
          <p>Temperature: ${this.temperature}°C</p>
          <p>${this.description}</p>
        </div>
      `;
    }
  }
  
  // Example usage
  const weatherCard = new WeatherCard(25, "New York", "Sunny");
  console.log(weatherCard.render());
  