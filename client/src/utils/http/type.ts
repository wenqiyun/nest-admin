import { AxiosRequestConfig } from 'axios'

export interface RequestOptions {
  joinParamsToUrl?: boolean;
  formatDate?: boolean;
  apiUrl?: string;

}

export interface CreateAxiosOption extends AxiosRequestConfig {
  prefixUrl?: string;
  transform?: any;
  requestOptions?: RequestOptions;
}

export interface Result<T> {
  data?: T | string | number | Record<string, any>;
  error: number;
  errorMsg: string;
}

export interface UploadFileParams {
  file: File | Blob;
  filename?: string;
  name?: string;
}
