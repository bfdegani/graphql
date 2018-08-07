import { CommentInstance } from "../../../models/CommentModel";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/utils";

export const commentsResolvers = {
    Comment: {
        user: (comment: CommentInstance, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => { 
            return db.User
            .findById(comment.get('user'))
            .catch(handleError);
        },
        post: (comment: CommentInstance, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => { 
            return db.Post
            .findById(comment.get('post'))
            .catch(handleError);
        },
    },
    Query: {
        comments: (parent, {postId, first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => { 
            postId = parseInt(postId); // converte o id para int para evitar problema pelo fato dele trafegar como string
            return db.Comment.findAll({
                where: {post: postId},
                limit: first,
                offset: offset
            }).catch(handleError);
        }
    },
    Mutation: {
        createComment: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment.create(input, {transaction: t});
            }).catch(handleError);
        },
        updateComment: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id); // converte o id para int para evitar problema pelo fato dele trafegar como string
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        if(!comment) throw new Error (`Comment with id ${id} not found!`);
                        return comment.update(input, {transaction: t});
                    });
            }).catch(handleError);
        },
        deleteComment: (parent, {id}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id = parseInt(id); // converte o id para int para evitar problema pelo fato dele trafegar como string
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        if(!comment) throw new Error (`Comment with id ${id} not found!`);
                        return comment.destroy({transaction: t})
                            .then(comment => !!comment);
                    });
            }).catch(handleError);
        }
    }
};