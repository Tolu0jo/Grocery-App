import { MerchantModel, IMerchant} from "./model";

export class MerchantRepository{
   
    async createMerchant(data:IMerchant){
      const merchant = new MerchantModel(data)
      return await merchant.save();
   }

   async findMerchantByEmail(email:string){
    return await MerchantModel.findOne({email});
   }

   async findMerchantById(id:string){
    return await MerchantModel.findById(id);
   }
}