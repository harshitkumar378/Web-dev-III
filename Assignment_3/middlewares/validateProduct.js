// for POST - name, sku, category, price and quantity are compulsory
const validateProduct = (req,res,next)=>{
    if(!req.body){
        return res.status(400).json({message:"Request body is required"})
    }

    let {name,sku,category,price,quantity} = req.body

    if(!name || !sku || !category){
        return res.status(400).json({message:"name, sku and category are required"})
    }
    if(typeof price !== "number"){
        return res.status(400).json({message:"price is required and must be a number"})
    }
    if(typeof quantity !== "number"){
        return res.status(400).json({message:"quantity is required and must be a number"})
    }

    next()
}

// for PATCH stock - change must be a whole number and not 0
const validateStock = (req,res,next)=>{
    if(!req.body){
        return res.status(400).json({message:"Request body is required"})
    }

    let {change} = req.body

    if(!Number.isInteger(change) || change === 0){
        return res.status(400).json({message:"change must be a whole number other than 0 (example: 10 or -5)"})
    }

    next()
}

module.exports = {validateProduct,validateStock}
