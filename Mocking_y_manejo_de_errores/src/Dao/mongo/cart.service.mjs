/* eslint-disable */
import cartModel from "../models/cart.model.js";
import nodemailer from 'nodemailer'
import config from "../../../data.js";
class CartService {
  #model;
  constructor() {
    this.#model = cartModel;
  }
  async get() {
    return this.#model.find();
  }
  async getById(_id) {
    return this.#model.findById(_id).populate('products.product');
  }
  async create(data) {
    return this.#model.create(data);
  }
   async findOneAndUpdate(query, update) {
    return this.#model.updateOne(query, update);
  }
  
    async sendPurchaseMail(email) {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'ulises.roa07@gmail.com',
        pass: config.GOOGLE_MAILER
      }
    })
    
    transporter.sendMail({
      from: "'Proyecto' <proyectoUlises@gmail.com>",
      to: email,
      subject: 'Your purchase was successful',
      html: `
        <h1>Thank You, order placed</h1>
        <p class="lead">Your order is currently being prepared.</p>
        <p class="lead">You can find a summary of your purchase in your profile.</p>
        <p class="text-muted">Please log in to view your profile.</p>
        <a href="http://localhost:8080/login" class="btn btn-secondary">Log In</a>
        <p class="text-muted">If you have any questions, our customer service center is available 24/7. Feel free to <a href="http://localhost:8080/chat">contact us</a>.</p>
      `
    })
    .then(info => console.log(info))
    .catch(error => console.log(error))
    
  }
  async updateCart(cart) {
    return cart.save();
}
}

export default CartService;
