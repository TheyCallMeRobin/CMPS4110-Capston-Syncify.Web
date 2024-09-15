import {
  CreateUserDto,
  UserDto,
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

export class UsersService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: CreateUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/users/api/createusers';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUserById(
    params: {
      /**  */
      id?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/users/id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { id: params['id'] };

      axios(configs, resolve, reject);
    });
  }
}
