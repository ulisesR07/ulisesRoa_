import fs from 'fs';
const path = './dao/products.json';

class ProductManager {
    constructor(path) {
      this.path = path;
    }
  
    async addProduct(product) {
        let products = await this.getProducts();
        
        let existingProduct = products.find(p => p.code === product.code);
        if (existingProduct) {
            console.log(`El producto con código ${product.code} ya existe en el archivo JSON.`);
            return;
        }
        product.id = products.length + 1;
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }
  
    async getProducts() {
        let products = [];
        if (fs.existsSync(this.path)) {
            products = JSON.parse(await fs.promises.readFile(this.path));
        }
        
        return products;
    }
  
    async getProductById(id) {
      let products = await this.getProducts();
      let result = products.filter(product => product.id === id);
      return result;
    }
  
    async updateProduct(id, nuevosDatos) {
        const idNumber = Number(id);
        try {
          let products = await this.getProducts();
          let index = products.findIndex(p => p.id === idNumber);
        
          products[index] = { ...products[index], ...nuevosDatos };
          console.log(`El objeto de id: ${id}, fue actualizado con éxito`);
          await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
          console.error(`Error al actualizar el producto con id ${id}: ${error}`);
        }
      }
  
    async deleteProduct(id) {
        let products = await this.getProducts();
      
        const newProducts = products.filter(product => product.id !== id);
        
        await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
      }
  }


export default ProductManager;