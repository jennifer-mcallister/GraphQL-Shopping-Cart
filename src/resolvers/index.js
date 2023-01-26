const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, getDirectoryFileNames, readFile, deleteFile} = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')
const crypto = require('crypto')

const shoppingCartsDirectory = path.join(__dirname, '..', 'data', 'shoppingCarts')
const productsDirectory = path.join(__dirname, '..', 'data', 'products')

exports.resolvers = {
    Query: {
        getShoppingCartById: async (_, args, context) => {

            return null
        },
        getProductById: async (_, args, context) => {

            return null
        },
    },
    Mutation: {
        createShoppingCart: async (_, args, context) => {

            return null
        },
        clearShoppingCart: async (_, args, context) => {

            return null
        },
        updateShoppingCart: async (_, args, context) => {

            return null
        },
        deleteProductInShoppingCart: async (_, args, context) => {

            return null
        },

    }
}