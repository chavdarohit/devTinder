import Mongoose from "mongoose";

const connectDB = async () => {
  await Mongoose.connect(
    "mongodb+srv://rohitchavda449:s6yC0GQLbXkagitO@node.kjjpehd.mongodb.net/devTinder?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};

export default connectDB;
