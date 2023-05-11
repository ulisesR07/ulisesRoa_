module.exports = class {
  constructor(productService) {
    this.productService = productService;
  }

  async addProduct(socket, producto) {
    try {
      const newProduct = await this.productService.addProduct(producto);
      socket.emit("newProduct", newProduct);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProducts() {
    try {
      const allProducts = await this.productService.getAllProducts();
      return allProducts;
    } catch (error) {
      console.log(error);
    }
  }


};
