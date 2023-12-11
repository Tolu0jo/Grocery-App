import { ProductRepository } from "../database";
import { formatData } from "../utils";
import { IProductDto, ProductPayload } from "./product-services.dto";
class ProductService {
  repository: ProductRepository;
  constructor() {
    this.repository = new ProductRepository();
  }

  //CREATE PRODUCT
  async ProductCreate(productInput: IProductDto) {
    try {
      const product = await this.repository.CreateProduct(productInput);
      return formatData(product);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //GET PRODUCTS
  async GetProducts() {
    try {
      const products = await this.repository.Products();
      return formatData(products);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // GET SINGLE PRODUCT
  async GetProductById(id: string) {
    try {
      const product = await this.repository.FindProductById(id);
      return formatData(product);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // GET PRODUCTS BY CATEGORY
  async GetProductsByCategory(category: string) {
    try {
      const type = category;
      const products = await this.repository.FindByCategory(type);
      return formatData(products);
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  //GET SELECTED PRODUCTS
  async GetSelectedProducts(selectedIds: [string]) {
    try {
      const products = await this.repository.FindSelectedProducts(selectedIds);
      return formatData(products);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //GET PRODUCT PAYLOAD
  async GetProductPayload(
    userId: string,
    { productId, qty }: ProductPayload,

    event: string
  ) {
    try {
      const id = productId;
      const product = await this.repository.FindProductById(id);

      if (product) {
        const payload = {
          event,
          data: { userId, product, qty },
        };
        return formatData(payload);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  //RPC Response
  async serveRPCRequest(payload:any){
     const {type,data} = payload;
     switch(type){
      case "VIEW_PRODUCT":
       return this.repository.FindProductById(data)
      break;
      case "VIEW_PRODUCTS":
        return this.repository.FindSelectedProducts(data);
      default:
        break;
  }
  
}
};

export default ProductService;
