import { HttpMethod } from "@/types/http";
import { IState } from "@/types/state";
import { IKeyValueObj } from "./key-value";
import { NonUndefined } from "./utils";

export type IHeader = IKeyValueObj;
export type IHeaders = IHeader[];

export type IParam = IKeyValueObj;
export type IParams = IParam[];

export interface IRequest {
  method: HttpMethod,
  url: string,
  params?: IParams,
  body?: unknown,
  headers?: IHeaders,
}

export type IRequestState = { [key in keyof IRequest]-?: IState<NonUndefined<IRequest[key]>> };
