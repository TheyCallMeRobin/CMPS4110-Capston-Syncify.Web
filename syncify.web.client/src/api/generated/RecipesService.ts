import {
  RecipeGetDto,
  RecipeIngredientDto,
  RecipeTagDto,
  RecipeCreateDto,
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
      name?: string;
      /**  */
      description?: string;
      /**  */
      prepTime?: number;
      /**  */
      cookTime?: number;
      /**  */
      servings?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<RecipeGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        Name: params['name'],
        Description: params['description'],
        PrepTime: params['prepTime'],
        CookTime: params['cookTime'],
        Servings: params['servings']
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
  static deleteRecipe(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<boolean>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/recipes/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
