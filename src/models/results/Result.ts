import IResult from "./IResult";

export default class Result implements IResult{
    success:boolean;
    message:string="";

    constructor(success: boolean,message?:string) {
      this.success=success;
      if(message){this.message=message};
    }
  }