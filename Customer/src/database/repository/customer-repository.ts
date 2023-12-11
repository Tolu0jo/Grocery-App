import { IOrder, Iproduct } from "../../services/customer-services.dto";
import { AddressModel, CustomerModel, IAddress, ICustomer } from "../models";

export class CustomerRepository {
  //ADD CUSTOMER
  async CreateCustomer(CustomerData: ICustomer) {

      const customer = new CustomerModel(CustomerData);
      const customerResult = await customer.save();

      return customerResult;
   
  }

  //FIND CUSTOMER BY EMAIL
  async FindCustomer({ email }: { email: string }) {
    const existingUser = await CustomerModel.findOne({ email });
    return existingUser;
  }

  //FIND CUSTOMER BY ID

  async FindCustomerById(id: string) {
    try {
      const existingCustomer = await CustomerModel.findById(id).populate(
        "address"
      );
      return existingCustomer;
    } catch (error) {
      console.log(error);
    }
  }


  async CreateAddress(customerId: string, address: IAddress) {

      const profile = await CustomerModel.findById(customerId);
      if (profile) {
        const profileAddress = profile?.address;

        if (profileAddress.length === 0) {
          const newAddress = new AddressModel(address);
          await newAddress.save();
          profileAddress.push(newAddress);

          await profile.save();
          return newAddress;
        } else {
          const adresssToUpdate = await AddressModel.findByIdAndUpdate(
            profileAddress[0]
          );
          const adresss = await adresssToUpdate?.updateOne(address);
          return adresss;
        }
      }
  }

  async DeleteUser(customerId: string) {
    const profile = await CustomerModel.findByIdAndDelete(customerId);
    if (profile) {
      return profile.deleteOne();
    }
  }
}
