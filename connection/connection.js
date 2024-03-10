import { Sequelize } from "sequelize";
import 'dotenv/config'
import { database, username, password, host, dialect, port } from "../config/config.js";

const connection = new Sequelize(database, username, password, {
    host,
    dialect,
    port,
});

try {
    await connection.authenticate();
    console.log("Connection to DB OK")
} catch (error) {
    console.error("Connection error", error)
};

export default connection;