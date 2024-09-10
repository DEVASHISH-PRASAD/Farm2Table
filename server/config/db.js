import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectToDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log(`MONGOdB is connected:${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

export default connectToDb;