class ProductManager {
  constructor() {
    this.products = [];
    this.idCounter = 0;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error('Todos los campos son obligatorios');
      return;
    }

    const existingProduct = this.products.find(product => product.code === code);
    if (existingProduct) {
      console.error('Ya existe un producto con ese código');
      return;
    }

    this.products.push({
      id: ++this.idCounter,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    });
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    
    if (!product) {
      console.error('Not found');
      return;
    }

    return product;
  }
}



const productManager = new ProductManager();

productManager.addProduct('Pantufla', 'Pantufl Dama Abierta', 1810, 'https://res.cloudinary.com/djjmhiwzd/image/upload/v1669244037/comprimida_VERANO_COMUNES_excqpp.png', 'D-01', 4);

productManager.addProduct('Zapatillas', 'Zapatillas de hombre', 5000, 'https://res.cloudinary.com/djjmhiwzd/image/upload/v1670891783/vecteezy_sneakers-shoes-clipart-design-illustration_9399188_732_q1sauo.png', 'Zap-4', 65);


productManager.addProduct('Remeras', 'Remera de hombre', 3200, 'https://res.cloudinary.com/djjmhiwzd/image/upload/v1670891788/vecteezy_isolated-blue-t-shirt_8847305_174_jlde7t.png', 'Rem-3', 56);

const allProducts = productManager.getProducts();
console.log(allProducts);

const productById = productManager.getProductById(2);
console.log(productById);