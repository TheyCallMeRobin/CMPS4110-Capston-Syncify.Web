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

  /**
   *
   */
  static getShoppingLists(options: IRequestOptions = {}): Promise<Response<List<ShoppingListGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shoppinglist';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createShoppingList(
    params: {
      /** requestBody */
      body?: ShoppingListCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<ShoppingListGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shoppinglist';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getShoppingListById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<ShoppingListGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shoppinglist/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
