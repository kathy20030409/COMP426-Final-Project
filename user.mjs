export class User {
    #id
    #username
    #password
    #locations

    constructor(username, password){
        this.#username = username;
        this.#password = password;
        this.#id = User.next_id;
        this.#locations = [];
    }

    static async create(data){
        if (data!== undefined && data.username!== undefined && data.password!== undefined){
            let id;
            try {
                let db_result = await db.run(
                    'INSERT INTO users (username, password) VALUES (NULL, ?, ?)', 
                    [username, hashedPassword]
                );
                id = db_result.lastID;
            } catch (e) {
                return null;
            }
            let newUser = new User(id, data.username, data.password);
            return newUser;
        }
        return null;
    }

    static async login(data){
        if (data!== undefined && data.username!== undefined && data.password!== undefined){
            try {
                let user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
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

    static async addLocation(username, location) {
        
    }


}