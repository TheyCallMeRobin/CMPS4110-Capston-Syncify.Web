import {
  ShoppingListGetDto,
  ShoppingListCreateDto,
  IList,
  List,
  IListResult,
  ListResultDto,
  IPagedResult,
  PagedResultDto,
  Dictionary,
  IDictionary,
  Response,
  Error,
  IRequestOptions,
  IRequestConfig,
  getConfigs,
  axios,
  basePath
} from './index.defs';

export class ShoppingListsService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  static getShoppingLists(options: IRequestOptions = {}): Promise<Response<List<ShoppingListGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-lists';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }

  static createShoppingList(
    params: {

      body?: ShoppingListCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<ShoppingListGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-lists';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }

  static getShoppingListById(
    params: {

      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<ShoppingListGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-lists/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }

  static getShoppingListsByUserId(
    params: {

      userId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<ShoppingListGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-lists/by-user/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }

  static updateShoppingList(
    params: {
      id: number;
      body: Partial<ShoppingListGetDto>;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<ShoppingListGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-lists/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('patch', 'application/json', url, options);

      configs.data = params.body;

      axios(configs, resolve, reject);
    });
  }

  static deleteShoppingList(
    params: {
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<null>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-lists/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }

}
