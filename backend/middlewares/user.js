import { checkUserExists, insertUser } from '../db/db.js';

// Check user if exists
// If not, insert it
const insertUserIfNotExists = async (req, res) => {
  const { user } = req.body;

  const { email, name } = user;

  const result = await checkUserExists(email);
  if (!result.length) {
    const data = {
      email,
      name,
    };

    await insertUser(data);
  }

  res.status(200).end();
};

export default insertUserIfNotExists;
