import {
  FamilyShoppingListCreateDto,
  FamilyShoppingListGetDto,
  ShoppingListGetDto,
  ShoppingListItemGetDto,
  EmptyResponse,
  Error,
  IList,
  List,
  IListResult,
  ListResultDto,
  IPagedResult,
  PagedResultDto,
  Dictionary,
  IDictionary,
  Response,
  IRequestOptions,
  IRequestConfig,
  getConfigs,
  axios,
  basePath
} from './index.defs';

export class FamilyShoppingListService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static createFamilyShoppingList(
    params: {
      /** requestBody */
      body?: FamilyShoppingListCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyShoppingListGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-shopping-lists';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFamilyShoppingLists(
    params: {
      /**  */
      familyId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<FamilyShoppingListGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-shopping-lists/family/{familyId}';
      url = url.replace('{familyId}', params['familyId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFamilyShoppingListById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyShoppingListGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-shopping-lists/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeShoppingListFromFamily(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmptyResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-shopping-lists/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
