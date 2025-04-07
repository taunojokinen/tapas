const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Userlist'); // Assuming you have a User model defined
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

// Define activeTokens as a Map to store active tokens and user info
const activeTokens = new Map();

const login = async(req, res) => {

  const { username, password } = req.body;
 
  try {
    // Fetch user from your data source (e.g., database or API)
    const user = await getUserFromUserList(username); // Replace with your actual function
  
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Store the token in the activeTokens map
    activeTokens.set(token, { username: user.username, loginTime: new Date() });

    return res.status(200).json({ message: 'Login successful', token });  
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  } 
};

const changePassword = async (req, res) => {
  try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET); // Decode the token to get the user ID

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
          return res.status(400).json({ message: 'Old and new passwords are required' });
      }

      // Find the user in the database
      const user = await User.findById(decoded.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Validate the old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Old password is incorrect' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

// Example function to fetch user from userlist (replace with your actual implementation)
const getUserFromUserList = async (username) => {
  try {

      // Query the database for a user with the given username
      const user = await User.findOne({ username: username });
      return user;
  } catch (error) {
      console.error("Error fetching user from database:", error.message);
      throw error; // Re-throw the error to handle it in the calling function
  }
};

const logout = (req, res) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Invalid or missing token' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"

  if (activeTokens.has(token)) {
      activeTokens.delete(token); // Remove the token from the activeTokens map
      return res.status(200).json({ message: 'Logout successful' });
  }

  return res.status(400).json({ message: 'Invalid or missing token' });
};

const getLoggedInUsers = (req, res) => {
  const loggedInUsers = Array.from(activeTokens.values()).map((user) => ({
      username: user.username,
      loginTime: user.loginTime,
  }));
  return res.status(200).json({ loggedInUsers });
};
module.exports = { login, logout, getLoggedInUsers, changePassword };