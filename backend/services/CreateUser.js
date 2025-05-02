import UserModel from "../models/user.model.js";

export const CreateUser = async (userData) => {
  try {
    // Validate input data
    if (!userData || !userData.name || !userData.email || !userData.password) {
      throw new Error("Name, email, and password are required.");
    }

    // Create the user
    const user = await  UserModel.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    // Check if the user was created successfully
    if (!user) {
      throw new Error("Failed to create user.");
    }

    // Return the created user
    return user;
  } catch (error) {
    // Log the error for debugging
    console.error("Error in createUser:", error.message);

    // Throw the error to be handled by the caller
    throw new Error(`Failed to create user: ${error.message}`);
  }
};