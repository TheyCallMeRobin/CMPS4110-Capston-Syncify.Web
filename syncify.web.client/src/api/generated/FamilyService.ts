import {
  FamilyCreateDto,
  FamilyGetDto,
  FamilyUpdateDto,
  EmptyResponse,
  Error,
  OptionDto,
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

export class FamilyService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static createFamily(
    params: {
      /** requestBody */
      body?: FamilyCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/families';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAllFamilies(options: IRequestOptions = {}): Promise<Response<FamilyGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/families';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFamilyById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/families/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateFamily(
    params: {
      /**  */
      id: number;
      /** requestBody */
      body?: FamilyUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/families/{id}';
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
  static deleteFamily(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmptyResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/families/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFamiliesByUserId(
    params: {
      /**  */
      userId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<FamilyGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/families/user/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFamilyOptionsForUser(
    params: {
      /**  */
      userId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<OptionDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/families/options/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
