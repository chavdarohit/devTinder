import Mongoose from "mongoose";

const connectDB = async () => {
  await Mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export default connectDB;
