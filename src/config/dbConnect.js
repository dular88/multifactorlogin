
import { connect } from "mongoose";
const dbConnect = async() => {
    try {
        const mongoDbConnection = await connect(process.env.CONNECTION_STRING);
        console.log(`DB connected ${mongoDbConnection.connection.host}`);
    } catch (error) {
        console.log(`DB connection failed ${error}`);
        process.exit(1);
    }
};

export default dbConnect; 