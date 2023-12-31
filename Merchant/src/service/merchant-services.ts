import { MerchantRepository } from "../repository/repository";
import { GeneratePassword, GenerateSalt, GenerateSignature, RPCRequest, validatePassword } from "../utils";

 

 class MerchantService{
    repository;
    constructor( ){
        this.repository = new MerchantRepository()
    }
    
    async merchantSignUp(email:string,password:string,phone:string){
       const existingMerchant = await this.repository.findMerchantByEmail(email)
       if(existingMerchant) return `User ${email} already exists`;
       const salt = await GenerateSalt()
       const isMerchant = true
       const hashPassword = await GeneratePassword(password, salt) as unknown as string;
        const merchant= await this.repository.createMerchant({email,password: hashPassword,phone,salt,isMerchant})
         return merchant;   
      }

      
    async merchantSignIn(email:string,password:string){
    const existingMerchant = await this.repository.findMerchantByEmail(email);

       if(!existingMerchant) {return `Invalid Credentials`;}
       const verifyPassword = validatePassword(password,existingMerchant.password,existingMerchant.salt)
        if(!verifyPassword) return `Invalid Credentials`;
      const token = GenerateSignature({email,id:existingMerchant._id});
      return {id:existingMerchant._id,token:token}
 }

 async getmerchant(id:string){
   const merchant = await this.repository.findMerchantById(id);
    if(!merchant) return "Merchant not found";
   return merchant;
 }
 async getmerchantProducts(merchantId:string){
   const response = await RPCRequest("PRODUCT_RPC",{
      type:"VIEW_MERCHANT_PRODUCTS",
      data:merchantId
    })
   return response;
 }
}

export default MerchantService;


