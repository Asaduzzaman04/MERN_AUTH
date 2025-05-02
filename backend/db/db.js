import mongoose from "mongoose";

export const database = async () => {
  try {
    // Establish the connection to the database
    const response = await mongoose.connect(
      `${process.env.MONGO_URL}/${process.env.DB_NAME}`
    );

    // Log if the connection is successful
    if (response) {
      console.log("Connected to database");
    } else {
      throw new Error("Unable to connect to the database");
    }

    // Mongoose event listeners
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("reconnected", () => {
      console.log("Mongoose reconnected to MongoDB");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed due to application termination");
      process.exit(0);
    });

  } catch (error) {
    console.error("Database connection error:", error);
  }
};