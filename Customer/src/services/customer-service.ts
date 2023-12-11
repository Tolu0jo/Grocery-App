import { CustomerRepository } from "../database";
import { IOrder, Iproduct, Iuser, IuserLogin } from "./customer-services.dto";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
  formatData,
  validatePassword,
} from "../utils";
import { IAddress } from "../database/models";
import { APIError, NotFoundError, ValidationError } from "../utils/errors/app-errors";

class CustomerService {
  repository;
  constructor() {
    this.repository = new CustomerRepository();
  }
  async SignUp(userInput: Iuser) {
    try {
      const { email, password, phone } = userInput;
      const existingUser = await this.repository.FindCustomer({ email });
      if (existingUser) {
        throw new Error("Customer already exists");
      }

      const salt = await GenerateSalt();
      const userPassword = await GeneratePassword(password, salt);
      const customer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        salt,
        address: []
      });
      if (customer) {
        const token = GenerateSignature({ email, _id: customer._id });
        return formatData({ customer, token });
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async Login(userInput: IuserLogin) {
  
      const { email, password } = userInput;
      const user = await this.repository.FindCustomer({ email });
      if (!user) {
        throw new NotFoundError("Customer does not exists");
      }
      const validPassword = await validatePassword(
        password,
        user.password,
        user.salt
      );
      if (!validPassword) throw new ValidationError("Invalid credentials.");
      const token = GenerateSignature({ email, _id: user._id });
      return formatData({ id: user._id, token });
   
  }

  //CREATE-ADDRESS
  async AddAdress(id: string, address: IAddress) {
    try {
      const newAddress = await this.repository.CreateAddress(id, address);
      return formatData(newAddress);
    } catch (error) {
      console.log(error);
    }
  }

  //GET PROFILE

  async GetProfile(id: string) {
    try {
      const existingCustomer = await this.repository.FindCustomerById(id);
      if (existingCustomer) {
        return formatData(existingCustomer);
      }
    } catch (error) {
      console.log(error);
    }
  }



  async DeleteCustomer(customerId: string) {
    try {
     const data = await this.repository.DeleteUser(customerId);
      const payload={
        event:"DELETE_PROFILE",
        data: {userId:customerId},
      }
      return {data,payload};
    } catch (error) {
      console.log(error);
    }
  }
}

export default CustomerService;
