import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

import db from './models';
import schema from './graphql/schema';

class App {
    public express: express.Application;

    constructor(){
        this.express = express();
        this.middleware();
    }

    private middleware(): void{
        this.express.use('/graphql', 
            (req, res, next) => {       //usa middleware para adicionar objetos ao request: conexão de banco, access token etc
                req['context'] = {};
                req['context'].db = db;
                next();
            },
            graphqlHTTP((req) => ({
                schema: schema,
                graphiql: process.env.NODE_ENV === 'development',
                context: req['context']
            }))
        );
    }
}

export default new App().express;