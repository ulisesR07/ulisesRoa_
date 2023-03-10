import { Router } from 'express'
const router = Router()
import products from '../../controllers/ProductManager.js'

router.post('/', async (req, res) => {
  try {
    const { title, description, price, thumbnail, stock } = req.body
    let data = await products.saveProduct(
      title,
      description,
      price,
      thumbnail,
      stock
    )
    res.status(200).json({
      response: data
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.put('/:pid', async (req, res) => {
  let { pid } = req.params
  if (Object.keys(req.body)[0] == 'id') {
    res.status(403).json({
      response: 'Can not modify the id of a product'
    })
  }
  try {
    let data = await products.putById(pid, req.body)

    if (data) {
      res.status(200).json({
        response: data
      })
    } else {
      res.status(404).json({
        respones: 'can not find'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.delete('/:pid', async (req, res) => {
  let { pid } = req.params
  try {
    let data = await products.deleteById(pid)
    if (data) {
      res.status(200).json({
        response: 'product deleted'
      })
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.get('/', async (_req, res) => {
  try {
    let data = await products.getAll()
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

router.get('/:pid', async (req, res) => {
  let { pid } = req.params
  try {
    let data = []
    data.push(await products.getById(pid))
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).json({
        response: 'can not find'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      response: 'error'
    })
  }
})

export default router
