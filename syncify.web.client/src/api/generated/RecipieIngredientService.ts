import {
  RecipeIngredientCreateDto,
  RecipeIngredientGetDto,
  RecipeIngredientUpdateDto,
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

export class RecipieIngredientService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: RecipeIngredientCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeIngredientGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipe-ingredient';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAll(
    params: {
      /**  */
      recipeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<RecipeIngredientGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipe-ingredient/recipe/{recipeId}';
      url = url.replace('{recipeId}', params['recipeId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeIngredientGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipe-ingredient/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static update(
    params: {
      /**  */
      id: number;
      /** requestBody */
      body?: RecipeIngredientUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeIngredientGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipe-ingredient/{id}';
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
  static delete(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmptyResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipe-ingredient/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
