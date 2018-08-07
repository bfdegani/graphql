import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';
import { DbConnection } from '../interfaces/DbConnectionInterface';

const basename: string = path.basename(module.filename);
const env: string = process.env.NODE_ENV || "development";

let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if(!db) {
    db = {};

    const operatorsAliases = false; //define se o sequelize ira usar alias para operadores
    config = Object.assign({operatorsAliases}, config); //adiciona 'operatorsAliases' a esrutura do objeto 'config'

    const sequelize: Sequelize.Sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );

    fs.readdirSync(__dirname) // le todos os arquivos *.ts de definição de Model e carrega no banco
        .filter(file => ( file.indexOf('.') !== 0 )// ignora arquivos invisiveis (iniciados por '.')
            && (file !== basename) //ignora esse arquivo ('index.ts')
            && (file.slice(-3) === '.js') // valida extensão do arquivo
        )
        .forEach((file: string) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model['name']] = model;
        });
    
    Object.keys(db).forEach((modelName: string) => { // para cada model, chama a função 'associate' caso esteja definida para criar associações no banco
        if(db[modelName].associate){
            db[modelName].associate(db);
        }
    });

    db['sequelize'] = sequelize; //armazena a instancia do sequelize no banco
}

export default <DbConnection>db;
