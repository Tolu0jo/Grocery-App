import { ProductModel, IProduct } from "../models";

export class ProductRepository {
  //CREATE PRODUCT
  async CreateProduct(ProductData: IProduct) {
    try {
      const Product = new ProductModel(ProductData);
      const productResult = await Product.save();

      return productResult;
    } catch (error) {
      console.log(error);
    }
  }
  //FIND PRODUCT BY ID
  async FindProductById(id: string) {
    try {
      const product = await ProductModel.findById( id );
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  //ALL PRODUCTS
  async Products() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.log(error);
    }
  };

  //FIND BY CARTEGORY
  async FindByCategory(type:string){
    try {
      const products = await ProductModel.find({type});
      return products;
    } catch (error) {
      console.log(error)
    }
  };
  async FindProductsByMerchant(merchantId:string){
    try {
      const products = await ProductModel.find({merchantId});
      return products;
    } catch (error) {
      console.log(error)
    }
  };
  
  //FIND SELECTED PRODUCTS
  async FindSelectedProducts(selectedIds:[string]){
  try {
    const products = await ProductModel.find().where("_id").in(selectedIds.map(_id =>_id));
    return products
  } catch (error) {
    console.log(error)
  }
  }
}

