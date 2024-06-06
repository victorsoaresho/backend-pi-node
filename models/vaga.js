const db = require('../database');

const getAllVagas = async () => {
  const [rows, fields] = await db.execute('SELECT * FROM vaga;');
  return rows;
};

const getVagasByTipo = async (tipo) => {
  const query = `
    SELECT v.*
    FROM vaga v
    JOIN vaga_filtro vf ON v.id = vf.vaga_id
    JOIN filtro_vaga fv ON vf.filtro_id = fv.id
    WHERE fv.tipo = ?;
  `;
  const [rows, fields] = await db.execute(query, [tipo]);
  return rows;
};

const createVaga = async (vaga) => {
  const queryVaga = `
    INSERT INTO vaga (titulo, descricao, salario, localizacao, requisitos, data_publicacao, emprego_id)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const [result] = await db.execute(queryVaga, [
    vaga.titulo, vaga.descricao, vaga.salario, vaga.localizacao, 
    vaga.requisitos, vaga.data_publicacao, vaga.emprego_id
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

module.exports = {
  getAllVagas,
  getVagasByTipo,
  createVaga,
  getFiltroId,
  createFiltro,
  associateVagaFiltro
};
