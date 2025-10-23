import Mongoose from "mongoose";

const connectDB = async () => {
  await Mongoose.connect("mongodb://localhost:27017/devTinder", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export default connectDB;
