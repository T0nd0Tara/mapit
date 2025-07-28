import { HttpMethod } from "@/types/http";
import { IState } from "@/types/state";

export interface IHeader {
  key: string,
  value: string,
  enabled: boolean
}
export type IHeaders = IHeader[];

export type IParam = IHeader;
export type IParams = IParam[];

export interface IRequest {
  method: HttpMethod,
  url: string,
  params?: IParams,
  body?: any,
  headers?: IHeaders,
};

export type IRequestState = { [key in keyof IRequest]-?: IState<IRequest[key]> };
