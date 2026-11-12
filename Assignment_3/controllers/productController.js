const productSchema = require("../models/product")

// Every function has try/catch. next(err) sends the error to errorHandler.js

// 1. CREATE a product -> POST /api/products
const createProduct = async(req,res,next)=>{
    try{
        let {name,sku,category,price,quantity,reorderLevel,supplier} = req.body

        let product = await productSchema.create({name,sku,category,price,quantity,reorderLevel,supplier})

        res.status(201).json(product)
    }catch(err){
        next(err)
    }
}

// 2. GET ALL products with filter, sort and pagination -> GET /api/products
// Example: /api/products?category=Electronics&minPrice=1000&sort=-price&page=1&limit=5
const getAllProducts = async(req,res,next)=>{
    try{
        let {category,supplier,search,minPrice,maxPrice,sort} = req.query

        // ---- Filtering ----
        let filter = {}

        if(category) filter.category = category
        if(supplier) filter.supplier = supplier
        if(search) filter.name = {$regex:search,$options:"i"}   // part of name, capital/small letters ignored

        if(minPrice || maxPrice){
            filter.price = {}
            if(minPrice) filter.price.$gte = Number(minPrice)   // price >= minPrice
            if(maxPrice) filter.price.$lte = Number(maxPrice)   // price <= maxPrice
        }

        // ---- Sorting ----
        // ?sort=price (low to high)   ?sort=-price (high to low)
        let sortBy = sort || "_id"

        // ---- Pagination ----
        let page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        if(page < 1) page = 1
        if(limit < 1) limit = 10
        let skip = (page - 1) * limit

        let total = await productSchema.countDocuments(filter)
        let products = await productSchema.find(filter).sort(sortBy).skip(skip).limit(limit)

        res.status(200).json({
            total,
            page,
            totalPages:Math.ceil(total/limit),
            count:products.length,
            products
        })
    }catch(err){
        next(err)
    }
}

// 3. LOW STOCK report (aggregation) -> GET /api/products/low-stock
// low stock = quantity is less than or equal to reorderLevel
const getLowStock = async(req,res,next)=>{
    try{
        let lowStockItems = await productSchema.aggregate([
            {
                // $expr lets us compare two fields of the same product
                $match:{
                    $expr:{
                        $lte:["$quantity","$reorderLevel"]
                    }
                }
            },
            {
                $sort:{quantity:1}
            },
            {
                $project:{
                    name:1,
                    sku:1,
                    category:1,
                    price:1,
                    quantity:1,
                    reorderLevel:1,
                    supplier:1,
                    stockValue:{
                        $multiply:["$price","$quantity"]
                    }
                }
            }
        ])

        res.status(200).json({
            count:lowStockItems.length,
            lowStockItems
        })
    }catch(err){
        next(err)
    }
}

// 4. CATEGORY-WISE SUMMARY (aggregation) -> GET /api/products/summary
const getSummary = async(req,res,next)=>{
    try{
        let summary = await productSchema.aggregate([
            {
                $group:{
                    _id:"$category",
                    totalItems:{
                        $sum:1
                    },
                    totalQuantity:{
                        $sum:"$quantity"
                    },
                    totalStockValue:{
                        $sum:{
                            $multiply:["$price","$quantity"]
                        }
                    },
                    avgPrice:{
                        $avg:"$price"
                    }
                }
            },
            {
                $sort:{totalStockValue:-1}
            }
        ])

        res.status(200).json({
            categories:summary.length,
            summary
        })
    }catch(err){
        next(err)
    }
}

// 5. GET ONE product -> GET /api/products/:id
const getProductById = async(req,res,next)=>{
    try{
        let {id} = req.params

        let product = await productSchema.findById(id)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        res.status(200).json(product)
    }catch(err){
        next(err)
    }
}

// 6. UPDATE product details -> PUT /api/products/:id
const updateProduct = async(req,res,next)=>{
    try{
        let {id} = req.params

        let product = await productSchema.findById(id)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        Object.assign(product,req.body)
        await product.save()   // save() also checks the schema rules

        res.status(200).json(product)
    }catch(err){
        next(err)
    }
}

// 7. STOCK ADJUSTMENT -> PATCH /api/products/:id/stock
const updateStock = async(req,res,next)=>{
    try{
        let {id} = req.params
        let {change} = req.body

        let product = await productSchema.findById(id)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        let newQuantity = product.quantity + change

        // stock can never go below 0
        if(newQuantity < 0){
            return res.status(400).json({message:"Not enough stock. Available quantity: " + product.quantity})
        }

        product.quantity = newQuantity
        await product.save()

        res.status(200).json({
            message:"Stock updated",
            product
        })
    }catch(err){
        next(err)
    }
}

// 8. DELETE product -> DELETE /api/products/:id
const deleteProduct = async(req,res,next)=>{
    try{
        let {id} = req.params

        let product = await productSchema.findByIdAndDelete(id)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        res.status(200).json({
            message:"Product deleted",
            id:product._id
        })
    }catch(err){
        next(err)
    }
}

module.exports = {createProduct,getAllProducts,getLowStock,getSummary,getProductById,updateProduct,updateStock,deleteProduct}
