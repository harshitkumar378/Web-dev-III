const errorHandler = (err,req,res,next)=>{

    // 1. schema validation failed
    if(err.name === "ValidationError"){
        return res.status(400).json({message:err.message})
    }

    // 2. duplicate value 
    if(err.code === 11000){
        return res.status(400).json({message:"SKU already exists"})
    }

    // 3. wrong type of value 
    if(err.name === "CastError"){
        if(err.path === "_id"){
            return res.status(400).json({message:"Invalid product id"})
        }
        return res.status(400).json({message:"Invalid value for " + err.path})
    }

    // 4. broken JSON sent in the body
    if(err.type === "entity.parse.failed"){
        return res.status(400).json({message:"Invalid JSON in request body"})
    }

    // 5. anything else
    console.log(err)
    res.status(500).json({message:"Server error"})
}

module.exports = errorHandler
