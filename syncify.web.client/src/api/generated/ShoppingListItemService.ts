import {
  ShoppingListItemGetDto,
  ShoppingListItemUpdateDto,
  ShoppingListItemCreateDto,
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

export class ShoppingListItemService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getShoppingListItems(
    params: {
      /**  */
      shoppingListId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<IEnumerable_ShoppingListItemGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-list-items/list/{shoppingListId}';
      url = url.replace('{shoppingListId}', params['shoppingListId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getShoppingListItemById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<ShoppingListItemGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-list-items/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateShoppingListItem(
    params: {
      /**  */
      id: number;
      /** requestBody */
      body?: ShoppingListItemUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<ShoppingListItemGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-list-items/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleteShoppingListItem(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-list-items/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createShoppingListItem(
    params: {
      /** requestBody */
      body?: ShoppingListItemCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<ShoppingListItemGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/shopping-list-items';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
