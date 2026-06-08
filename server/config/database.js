import mongoose from "mongoose";

const database = () => {
  mongoose.connect(process.env.DB_URI)
  .then((connection) => console.log("database connected successfully"))
  .catch((error) => console.log(`Error in database connection ${error}`));
}

export default database;