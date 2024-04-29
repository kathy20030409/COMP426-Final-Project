import {db} from './db.mjs';

export class User {
    #id
    #username
    #password
    #locations

    constructor(id, username, password){
        this.#username = username;
        this.#password = password;
        this.#id = id;
        this.#locations = [];
    }

    static async create(data){
        if (data!== undefined && data.username!== undefined && data.password!== undefined){
            let id;
            try {
                let db_result = await db.run(
                    'INSERT INTO users (username, password) VALUES (?, ?)', 
                    [data.username, data.password]
                )
                id = db_result.lastID;
                let newUser = new User(id, data.username, data.password);
                return newUser;
            } catch (e) {
                console.log(e);
                return null;
            }
        }
        return null;
    }

    static async login(data){
        if (data!== undefined && data.username!== undefined && data.password!== undefined){
            try {
                let user = await db.get('SELECT * FROM users WHERE username = ?', [data.username]);
                if (user && data.password == user.password) {
                    return user;
                } else {
                    return 401;
                }
            } catch (error) {
                return 500;
            }
        } else {
            return 400;
        }
    }

    json() {
        return {
            id: this.#id,
            username: this.#username,
            location: this.#locations
        }
    }

    static async getWeather(location){
        const apiKey = '905b0b58184fe072a63311caa98fcf8a';
        const city = location;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const weatherDescription = data.weather[0].main;
            const temp = data.main.temp;
            return {weatherDescription, temp};
        } catch {
            console.error('Error fetching weather data:', error);
        }
    }

    static async addLocation(user_id, location) {
        if (user_id !== undefined && location !== undefined) {

            try {
                let {weather, temp} = await User.getWeather(location);
                let db_result = await db.run(
                    'INSERT INTO user_items VALUES (NULL, ?, ?, ?, ?)', [location, weather, temp, user_id]);
                return User.getLocations(user_id);
            } catch {
                return 500;
            }
            
        } else {
            return 400;
        }
    }

    static async getLocations(user_id){
        if (user_id !== undefined) {
            try {
                let locations = await db.all('SELECT * FROM locations WHERE user_id = ?', [user_id]);
                return locations;

            } catch (error) {
                return 500;
            }
        } else {
            return 400;
        }
    }

    getUserLocation(){
        return this.#locations;
    }
}