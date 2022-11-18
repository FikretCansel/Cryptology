import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validationResultController=(req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array());
    }else{
        next();
    }
}

export default validationResultController;