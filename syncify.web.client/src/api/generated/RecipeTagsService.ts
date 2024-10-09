import {
  RecipeTagDto,
  RecipeTagCreateDto,
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

export class RecipeTagsService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getTags(options: IRequestOptions = {}): Promise<Response<List<RecipeTagDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipetags';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createTag(
    params: {
      /** requestBody */
      body?: RecipeTagCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeTagDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipetags';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTagById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeTagDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipetags/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateTag(
    params: {
      /**  */
      id: number;
      /** requestBody */
      body?: RecipeTagCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeTagDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipetags/{id}';
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
  static deleteTag(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<boolean>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipetags/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
