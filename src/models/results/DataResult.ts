import Result from "./Result";
import IDataResult from "./IDataResult";

export default class DataResult<T> extends Result implements IDataResult<T>{
    data:T;

    constructor(success: boolean,data: T,message?:string) {
    super(success,message);
      this.data=data
    }
  }