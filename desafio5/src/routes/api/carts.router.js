import { Router } from 'express'
const router = Router()
import carts from '../../controllers/CartsManager.js'


router.post('/', async (_req, res) => {
  try {
    const new_Cart = await carts.newCart()
    const id = new_Cart.id
    res.status(200).send({ id })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})



router.get('/:cid', async (req, res) => {
  try {
    let { cid } = req.params
    const getCartProducts = await carts.getCartProducts(cid)
    if (getCartProducts) {
      res.status(200).send(getCartProducts)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})


router.post('/:cid/product/:pid', async (req, res) => {
  let { cid, pid } = req.params
  try {
    const addedProd = await carts.addProduct(cid, pid)
    res.status(200).send({ id: addedProd })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})
router.delete('/:id', async (req, res) => {
  let { id } = req.params
  try {
    let deletedCart = await carts.deleteById(id)
    if (deletedCart) {
      res.status(200).json({
        response: `cart ${deletedCart} deleted`
      })
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.delete('/:id_cart/products/:id_product', async (req, res) => {
  try {
    let { id_cart, id_product } = req.params
    console.log(id_cart, id_product)
    const deletedProduct = await carts.deleteProduct(id_cart, id_product)
    if (deletedProduct) {
      res.status(200).send({ id: deletedProduct })
    }
    res.status(404).json({
      response: 'can not find'
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      response: 'error'
    })
  }
})

export default router
