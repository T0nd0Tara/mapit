import { HttpMethod } from "@/types/http";
import { IState } from "@/types/state";

export interface IHeader {
  key: string,
  value: string,
  enabled: boolean
}
export type IHeaders = IHeader[];
export interface IRequest {
  method: HttpMethod,
  url: string,
  params?: { [key: string]: any },
  body?: any,
  headers?: IHeaders,
};

export type IRequestState = { [key in keyof IRequest]: IState<IRequest[key]> };
