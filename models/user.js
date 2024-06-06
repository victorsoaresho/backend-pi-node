const db = require('../database');

const getUserByLogin = async (login) => {
  const query = "SELECT * FROM usuario WHERE login = ?;";
  const [rows, fields] = await db.execute(query, [login]);
  return rows[0];
};

module.exports = {
  getUserByLogin
};
