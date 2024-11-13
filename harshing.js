const bcrypt = require('bcryptjs');

// Password to be hashed
const password = "123";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
