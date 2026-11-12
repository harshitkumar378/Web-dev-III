const express = require("express")
const {createProduct,getAllProducts,getLowStock,getSummary,getProductById,updateProduct,updateStock,deleteProduct} = require("../controllers/productController")
const {validateProduct,validateStock} = require("../middlewares/validateProduct")
const router = express.Router()

router.get("/low-stock",getLowStock)
router.get("/summary",getSummary)

router.post("/",validateProduct,createProduct)
router.get("/",getAllProducts)
router.get("/:id",getProductById)
router.put("/:id",updateProduct)
router.patch("/:id/stock",validateStock,updateStock)
router.delete("/:id",deleteProduct)

module.exports = router
