import {
  RecipeGetDto,
  RecipeCreateDto,
  RecipeUpdateDto,
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

export class RecipesService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getRecipes(
    params: {
      /**  */
      createdByUserId?: number;
      /**  */
      cookTimeLowerBound?: number;
      /**  */
      cookTimeUpperBound?: number;
      /**  */
      prepTimeLowerBound?: number;
      /**  */
      prepTimeUpperBound?: number;
      /**  */
      name?: string;
      /**  */
      tagIds?: any | null[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<RecipeGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        CreatedByUserId: params['createdByUserId'],
        CookTimeLowerBound: params['cookTimeLowerBound'],
        CookTimeUpperBound: params['cookTimeUpperBound'],
        PrepTimeLowerBound: params['prepTimeLowerBound'],
        PrepTimeUpperBound: params['prepTimeUpperBound'],
        Name: params['name'],
        TagIds: params['tagIds']
      };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createRecipe(
    params: {
      /** requestBody */
      body?: RecipeCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getRecipeById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateRecipe(
    params: {
      /**  */
      id: number;
      /** requestBody */
      body?: RecipeUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<RecipeGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes/{id}';
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
  static deleteRecipe(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmptyResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getRecipesByUserId(
    params: {
      /**  */
      userId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<RecipeGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes/user/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getRecipeOfTheDay(options: IRequestOptions = {}): Promise<Response<RecipeGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes/recipe-of-the-day';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
