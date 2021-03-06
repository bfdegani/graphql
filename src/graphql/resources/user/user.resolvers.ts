import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { Mutation } from "../../mutation";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/utils";

export const userResolvers = {
    User: {
        // necessário implementar resolver para o atributo 'posts' porque esse campo não é primitivo, ou seja, não existe um resoslver trivial associado
        posts: (user: UserInstance, {first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => { 
            return db.Post.findAll({
                where: {author: user.get('id')},
                limit: first,
                offset: offset
            }).catch(handleError);
        }
    },

    Query: {
        /*
            Explicação da function abaixo, equivalente a:
                users: (parent, args, context, info: GraphQLResolveInfo) =>
            onde:    
                {first = 10, offset = 0} desmembra o parametro args e atribui valores default caso não existam
                {db} desmembra o objeto db de context. {db: DbConnection} faz o cast do db extraído de context
        */
        users: (parent, {first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => { 
            return db.User.findAll({
                limit: first,
                offset: offset
            }).catch(handleError);
        },        
        user: (parent, {id}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => { 
            id = parseInt(id); // converte o id para int para evitar problema pelo fato dele trafegar como string
            return db.User
                .findById(id)
                .then((user: UserInstance) => {
                    if(!user) throw new Error (`User with id ${id} not found!`);
                    return user;
                }).catch(handleError);
        }
    },

    Mutation: {
        createUser: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.User.create(input, {transaction: t});
            }).catch(handleError);
        }, 
        updateUser: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id); // converte o id para int para evitar problema pelo fato dele trafegar como string
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)
                    .then((user: UserInstance) => {
                        if(!user) throw new Error (`User with id ${id} not found!`);
                        return user.update(input, {transaction: t});
                    });
            }).catch(handleError);
        },
        updateUserPassword: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id); // converte o id para int para evitar problema pelo fato dele trafegar como string
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)
                    .then((user: UserInstance) => {
                        if(!user) throw new Error (`User with id ${id} not found!`);
                        return user.update(input, {transaction: t})
                            .then((user: UserInstance) => !!user); //!!user retorna true se user <> null
                    });
            }).catch(handleError);
        },
        deleteUser: (parent, {id}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id); // converte o id para int para evitar problema pelo fato dele trafegar como string
            return db.sequelize.transaction((t: Transaction) => {
                return db.User
                    .findById(id)
                    .then((user: UserInstance) => {
                        if(!user) throw new Error (`User with id ${id} not found!`);
                        return user.destroy({transaction: t})
                            .then(user => !!user);
                    });
            }).catch(handleError);
        }
    } 
};