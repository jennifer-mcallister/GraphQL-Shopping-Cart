const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, readFile, deleteFile} = require('../utils/fileHandling')
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

            return shoppingCart
        },
        getProductById: async (_, args, context) => {
            const articleNumber = args.articleNumber
            const filePath = path.join(productsDirectory, `${articleNumber}.json`)
            const productExists = await fileExists(filePath)
            if (!productExists) return new GraphQLError('That product dose not exists')
            const product = JSON.parse(await readFile(filePath))

            return product
        },
    },
    Mutation: {
        createShoppingCart: async (_, args, context) => {
            const newShoppingCart = { 
                shoppingCartId: crypto.randomUUID(), 
                productsInShoppingCart: [], 
                totalPrice: 0
            } 
            const filePath = path.join(shoppingCartsDirectory, `${newShoppingCart.shoppingCartId}.json`)
            let idExists = true
            while (idExists) {
                const exists = await fileExists(filePath)
                if(exists) {
                    newShoppingCart.shoppingCartId = crypto.randomUUID()
                    filePath = path.join(shoppingCartsDirectory, `${newShoppingCart.shoppingCartId}.json`)
                }
            idExists = false
            }
            await fsPromises.writeFile(filePath, JSON.stringify(newShoppingCart))

            return newShoppingCart.shoppingCartId
        },
        clearShoppingCart: async (_, args, context) => {
            const shoppingCartId = args.shoppingCartId
            const filePath = path.join(shoppingCartsDirectory, `${shoppingCartId}.json`)
            const Exists = await fileExists(filePath)
            if(!Exists) return new GraphQLError('Oppsie that shoppingcart does not exist')
            try {
                await deleteFile(filePath)
            } catch (error) {
                return {
                    deletedShoppingCart: shoppingCartId,
                    success: false
                }
            }
            return {
                deletedShoppingCart: shoppingCartId,
                success: true
            }
        },
        addProductTooShoppingCart: async (_, args, context) => {
            const shoppingCart = args.shoppingCart
            const product = args.product
            let productsInCart = shoppingCart.productsInShoppingCart
            const filePathShoppingCart = path.join(shoppingCartsDirectory, `${shoppingCart.shoppingCartId}.json`)
            const shoppingCartExists = await fileExists(filePathShoppingCart)
            if(!shoppingCartExists) return new GraphQLError('Oppsie that shopping cart does not exist')

            try {
                const filePathProducts = path.join(productsDirectory, `${product.articleNumber}.json`)
                await fsPromises.stat(filePathProducts)
                productsInCart.push(product)
                shoppingCart.productsInShoppingCart = productsInCart
                shoppingCart.totalPrice = 0;
                for(let i = 0; i < productsInCart.length; i++) {
                    shoppingCart.totalPrice += productsInCart[i].productPrice 
                }
                await fsPromises.writeFile(filePathShoppingCart, JSON.stringify(shoppingCart))
            } catch (error) {
                return {
                    addedProduct: product,
                    success: false
                }
            } return {
                addedProduct: product,
                success: true
            }    
                
            

            // const filePathShoppingCart = path.join(shoppingCartsDirectory, `${shoppingCart.shoppingCartId}.json`)
            // const shoppingCartExists = await fileExists(filePathShoppingCart)
            // if(!shoppingCartExists) return new GraphQLError('Oppsie that shopping cart does not exist')

            // const filePathProducts = path.join(productsDirectory, `${product.articleNumber}.json`)
            // const productExists = await fileExists(filePathProducts)
            // if(!productExists) return new GraphQLError('Oppsie that product does not exist')

            // productsInCart.push(product)
            // shoppingCart.productsInShoppingCart = productsInCart

            // shoppingCart.totalPrice = 0;
            // for(let i = 0; i < productsInCart.length; i++) {
            //     shoppingCart.totalPrice += productsInCart[i].productPrice 
            // }
            // await fsPromises.writeFile(filePathShoppingCart, JSON.stringify(shoppingCart))

            // return shoppingCart
        },
        deleteProductInShoppingCart: async (_, args, context) => {
            const shoppingCart = args.shoppingCart
            const product = args.product
            let productsInCart = shoppingCart.productsInShoppingCart

            const filePathShoppingCart = path.join(shoppingCartsDirectory, `${shoppingCart.shoppingCartId}.json`)
            const shoppingCartExists = await fileExists(filePathShoppingCart)
            if(!shoppingCartExists) return new GraphQLError('Oppsie that shopping cart does not exist')

            const filePathProducts = path.join(productsDirectory, `${product.articleNumber}.json`)
            const productExists = await fileExists(filePathProducts)
            if(!productExists) return new GraphQLError('Oppsie that product does not exist')

            for(let i = 0; i < productsInCart.length; i++) {
                if (productsInCart[i].articleNumber === product.articleNumber) {
                    productsInCart.splice(i, 1)
                    break
                }
            }

            shoppingCart.productsInShoppingCart = productsInCart

            await fsPromises.writeFile(filePathShoppingCart, JSON.stringify(shoppingCart))

            return {
                deletedProduct: product.articleNumber,
                success: true
            }
        },

    }
}
