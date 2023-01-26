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
            const shoppingCartId = args.shoppingCartId
            const filePath = path.join(shoppingCartsDirectory, `${shoppingCartId}.json`)
            const shoppingCartExists = await fileExists(filePath)
            if (!shoppingCartExists) return new GraphQLError('That shoppingcart dose not exists')
            const shoppingCart = JSON.parse(await readFile(filePath))

            console.log(shoppingCart)
            return shoppingCart
            
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