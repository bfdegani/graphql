import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash'; // faz merge entre atributos de objetos, permitindo que as diferentes definições de resolvers sejam incorporadas ao schema

import {Query} from './query';
import {Mutation} from './mutation';

import { commentTypes } from './resources/comment/comment.schema';
import { postTypes } from './resources/post/post.schema';
import { userTypes } from './resources/user/user.schema';
import { commentsResolvers } from './resources/comment/comment.resolvers';
import { postResolvers } from './resources/post/post.resolvers';
import { userResolvers } from './resources/user/user.resolvers';

const resolvers = merge(
    commentsResolvers, 
    postResolvers, 
    userResolvers
);

const SchemaDefinition = `
    type Schema {
        query: Query
        mutation: Mutation
    }
`;

export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        postTypes,
        userTypes,
        commentTypes
    ],
    resolvers
});
