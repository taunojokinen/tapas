const fs = require('fs');

const getUserList = (req, res) => {
  try {
    // Fetch users from JSON file or database
    const data = fs.readFileSync('response.json', 'utf8');
    const users = JSON.parse(data);

    res.json(users);
  } catch (error) {
    console.error('Error fetching user list:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUserList };