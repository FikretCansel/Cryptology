import IResult from "./IResult";

export default interface IDataResult<T> extends IResult{
    data:T
}