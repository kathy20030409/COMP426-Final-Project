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
        
    }
}