import mongoose from "mongoose";
import { productsCollection } from "./products.model.js";

export const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
     products:{
        type: [
          {
               product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: productsCollection,
                    },
               quantity: Number,
          }
        ],
        default: []          
     } 
});

cartsSchema.pre('find', function(){
     this.populate('products.product');
 });
 
 cartsSchema.pre('findOne', function(){
     this.populate('products.product');
 });

const cartsModel = mongoose.model(cartsCollection, cartsSchema);
export default cartsModel;