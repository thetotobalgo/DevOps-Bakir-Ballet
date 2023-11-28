const db = require('../dbClient');

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if (!user.username) {
      return callback(new Error("Wrong user parameters"), null);
    }

    // Check if user already exists
    db.exists(user.username, (existsErr, userExists) => {
      if (existsErr) {
        return callback(existsErr, null);
      }

      if (userExists) {
        return callback(new Error("User already exists"), null);
      }

      // Create User schema
      const userObj = {
        firstname: user.firstname,
        lastname: user.lastname,
      };

      // Save to DB
      db.hmset(user.username, userObj, (err, res) => {
        if (err) return callback(err, null);
        callback(null, res); // Return callback
      });
    });
  },

  get: (username, callback) => {
    db.hgetall(username, (err, user) => {
      if (err) return callback(err, null);

      if (!user) {
        return callback(new Error("User not found"), null);
      }

      user.username = username; // Add the username field to the user object
      callback(null, user);
    });
  },
};
