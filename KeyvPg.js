const KeyvSql = require('@keyv/sql');
const Pool = require('pg').Pool;

class KeyvPostgres extends KeyvSql {
    constructor(opts) {
        opts = Object.assign({
            dialect: 'postgres',
        }, opts);
        const pool = new Pool({
            connectionString: opts.uri,
            ssl: { rejectUnauthorized: false }
        });
        opts.connect = () => Promise.resolve()
            .then(() => {
                return sql => pool.query(sql)
                    .then(data => data.rows);
            });

        super(opts);
    }
}

module.exports = KeyvPostgres;