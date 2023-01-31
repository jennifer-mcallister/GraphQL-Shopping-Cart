const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, getDirectoryFileNames, readFile, deleteFile} = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')
const crypto = require('crypto')

const shoppingCartsDirectory = path.join(__dirname, '..', 'data', 'shoppingCarts')
const productsDirectory = path.join(__dirname, '..', 'data', 'products')

// add check if added products is equal to products in data @ createShoppingCart, updateShoppingCart, 
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
            const articleNumber = args.articleNumber
            const filePath = path.join(productsDirectory, `${articleNumber}.json`)
            const productExists = await fileExists(filePath)
            if (!productExists) return new GraphQLError('That product dose not exists')
            const product = JSON.parse(await readFile(filePath))

            console.log(product)
            return product
        },
    },
    Mutation: {
        createShoppingCart: async (_, args, context) => {
            
            const newShoppingCart = { 
                shoppingCartId: crypto.randomUUID(), 
                productsInShoppingCart: args.ProductsInShoppingCart || [], 
                totalPrice: args.totalPrice || 0
            } 
            const productsInCart = newShoppingCart.productsInShoppingCart
            newShoppingCart.totalPrice = 0;
            for(let i = 0; i < productsInCart.length; i++) {
                newShoppingCart.totalPrice += productsInCart[i].productPrice 
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
            const shoppingCart = {
                shoppingCartId: args.shoppingCartId,
                ProductsInShoppingCart: args.ProductsInShoppingCart,
                totalPrice: args.totalPrice
            }
            const product = args.product
            let productsInCart = shoppingCart.ProductsInShoppingCart
            const filePathShoppingCart = path.join(shoppingCartsDirectory, `${shoppingCart.shoppingCartId}.json`)
            const shoppingCartExists = await fileExists(filePathShoppingCart)
            if(!shoppingCartExists) return new GraphQLError('Oppsie that shopping cart does not exist')
            const filePathProducts = path.join(productsDirectory, `${product.articleNumber}.json`)
            const productExists = await fileExists(filePathProducts)
            if(!productExists) return new GraphQLError('Oppsie that product does not exist')
            productsInCart.push(product)
            shoppingCart.ProductsInShoppingCart = productsInCart
            shoppingCart.totalPrice = 0;
            for(let i = 0; i < productsInCart.length; i++) {
                shoppingCart.totalPrice += productsInCart[i].productPrice 
            }
            await fsPromises.writeFile(filePathShoppingCart, JSON.stringify(shoppingCart))

            return shoppingCart
        },
        deleteProductInShoppingCart: async (_, args, context) => {
            const shoppingCart = args.shoppingCart
            console.log(shoppingCart)
            const product = args.product
            let productsInCart = shoppingCart.productsInShoppingCart
            console.log(productsInCart)
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

            await fsPromises.writeFile(filePathShoppingCart, JSON.stringify(shoppingCart))


            return shoppingCart
        },

    }
}