import { db } from "./db.mjs";
import { compare } from "bcrypt";
export class User {
  #id;
  #username;
  #password;
  #locations;

  constructor(id, username, password) {
    this.#username = username;
    this.#password = password;
    this.#id = id;
    this.#locations = [];
  }

  static async create(data) {
    if (
      data !== undefined &&
      data.username !== undefined &&
      data.password !== undefined
    ) {
      let id;
      try {
        // check if the username already exists
        const user = await db.get("SELECT * FROM users WHERE username = ?", [
          data.username,
        ]);
        if (user) {
            throw new Error("Username already exists");
        }
        let db_result = await db.run(
          "INSERT INTO users (username, password) VALUES (?, ?)",
          [data.username, data.password]
        );
        id = db_result.lastID;
        let newUser = new User(id, data.username, data.password);
        return newUser;
      } catch (e) {
        console.log(e);
        return e;
      }
    }
    return null;
  }

  static async login(data) {
    let ing;
    if (
      data !== undefined &&
      data.username !== undefined &&
      data.password !== undefined
    ) {
      try {
        // Wait for the database query to complete
        const user = await db.get("SELECT * FROM users WHERE username = ?", [
          data.username,
        ]);
        if (!user) {
          ing = 401;
          throw new Error("User not found");
        }
        // Compare passwords
        const match = await compare(data.password, user.password);
        if (match) {
          ing = 200;
          return { ing: ing, user: user };
        } else {
          ing = 401;
          throw new Error("Invalid password");
        }
      } catch (error) {
        if (ing == 401) {
          return { ing: ing, user: null };
        }
        ing = 500;
        return { ing: ing, user: null };
      }
    } else {
      ing = 400;
      return { ing: ing, user: null };
    }
  }

    json() {
        return {
            id: this.#id,
            username: this.#username,
            password: this.#password
        }
    }

  static async getWeather(location) {
    const apiKey = "905b0b58184fe072a63311caa98fcf8a";
    const city = location;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const weatherDescription = data.weather[0].main;
            const temp = data.main.temp;
            let temp_f = (temp-273.15)*9/5+32;
            return {
                "weather": weatherDescription, 
                "temperature": temp_f};
        } catch {
            console.error('Error fetching weather data:', error);
        }
    }

    static async addLocation(user_id, location) {
        if (user_id !== undefined && location !== undefined) {
            try {
                let {"weather": weather, "temperature": temp} = await User.getWeather(location);
                console.log(weather, temp);
                await db.run(
                    'INSERT INTO locations (name, weather, temperature, user_id) VALUES (?, ?, ?, ?)', [location, weather, temp, user_id]);
                return await User.getLocations(user_id);
            } catch (e) {
                return 500;
            }
            
        } else {
            return 400;
        }
    }

    static async deleteLocation(user_id, location) {
        if (user_id !== undefined && location !== undefined) {
            try {
                await db.run(
                    'DELETE FROM locations WHERE (name, user_id) = (?, ?)', [location, user_id]);
                return await User.getLocations(user_id);
            } catch (e) {
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

    static async changePassword(user_id, password){
        if (user_id!== undefined && password!== undefined){
            try {
                await db.run(
                    'UPDATE users SET password = ? WHERE id = ?',
                    [password, user_id]);
            } catch (error) {
                return 500;
            }
        } else {
            return 400;
        }
    }

    static async sortLocations_desc(user_id){
        if (user_id !== undefined) {
            try {
                let locations = await db.all(
                    'SELECT * FROM locations WHERE user_id = ? ORDER BY name DESC', [user_id]);
                return locations;

            } catch (error) {
                return 500;
            }
        } else {
            return 400;
        }
    }

    static async sortLocations_asc(user_id){
        if (user_id !== undefined) {
            try {
                let locations = await db.all(
                    'SELECT * FROM locations WHERE user_id = ? ORDER BY name ASC', [user_id]);
                return locations;

            } catch (error) {
                return 500;
            }
        } else {
            return 400;
        }
    }

    static async sortLocations_desc_temp(user_id){
        if (user_id !== undefined) {
            try {
                let locations = await db.all(
                    'SELECT * FROM locations WHERE user_id = ? ORDER BY temperature DESC', [user_id]);
                return locations;

            } catch (error) {
                return 500;
            }
        } else {
            return 400;
        }
    }

    static async sortLocations_asc_temp(user_id){
        if (user_id !== undefined) {
            try {
                let locations = await db.all(
                    'SELECT * FROM locations WHERE user_id = ? ORDER BY temperature ASC', [user_id]);
                return locations;

            } catch (error) {
                return 500;
            }
        } else {
            return 400;
        }
    }

  getUserLocation() {
    return this.#locations;
  }
}
