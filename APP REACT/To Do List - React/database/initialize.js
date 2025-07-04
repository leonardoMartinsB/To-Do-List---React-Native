// Inicializa database
export const initializeDatabase = async (db) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        title TEXT,
        description TEXT,
        date TEXT,
        status TEXT DEFAULT 'pendente'
      );
    `);
    console.log('Banco de dados iniciado!');
  } catch (error) {
    console.log('Erro ao iniciar Banco de dados: ', error);
  }
};

