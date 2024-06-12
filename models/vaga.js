const db = require('../database');

const getAllVagas = async () => {
  const [rows, fields] = await db.execute('SELECT * FROM vaga;');
  return rows;
};

const getVagasByTipo = async (tipo) => {
  const query = `
    SELECT DISTINCT
      *
    FROM
      vaga
    WHERE
      titulo REGEXP ?
  `;
  const [rows, fields] = await db.execute(query, [tipo]);
  return rows;
};

const createVaga = async (vaga) => {
  const queryVaga = `
    INSERT INTO vaga (titulo, descricao, salario, localizacao, requisitos, data_publicacao, emprego_id, tipo_filtro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const [result] = await db.execute(queryVaga, [
    vaga.titulo, vaga.descricao, vaga.salario, vaga.localizacao, 
    vaga.requisitos, vaga.data_publicacao, vaga.emprego_id, vaga.tipo_filtro
  ]);
  return result.insertId;
};

const getFiltroId = async (tipo) => {
  const query = "SELECT id FROM filtro_vaga WHERE tipo = ?;";
  const [rows, fields] = await db.execute(query, [tipo]);
  return rows[0] ? rows[0].id : null;
};

const createFiltro = async (tipo) => {
  const query = "INSERT INTO filtro_vaga (tipo) VALUES (?);";
  const [result] = await db.execute(query, [tipo]);
  return result.insertId;
};

const associateVagaFiltro = async (vagaId, filtroId) => {
  const query = "INSERT INTO vaga_filtro (vaga_id, filtro_id) VALUES (?, ?);";
  await db.execute(query, [vagaId, filtroId]);
};

const getVagaById = async (id) => {
  const query = "SELECT * FROM vaga WHERE id = ?;";
  const [rows, fields] = await db.execute(query, [id]);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  getAllVagas,
  getVagasByTipo,
  createVaga,
  getFiltroId,
  createFiltro,
  associateVagaFiltro,
  getVagaById
};
