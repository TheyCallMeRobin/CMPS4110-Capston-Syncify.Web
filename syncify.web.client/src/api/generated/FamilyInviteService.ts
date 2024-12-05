import {
  FamilyInviteGetDto,
  InviteStatus,
  FamilyInviteCreateDto,
  ChangeInviteStatusDto,
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

export class FamilyInviteService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getInvitesByUserId(
    params: {
      /**  */
      userId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyInviteGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-invites/user/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getInvitesByFamilyId(
    params: {
      /**  */
      familyId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<FamilyInviteGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-invites/family/{familyId}';
      url = url.replace('{familyId}', params['familyId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createInvite(
    params: {
      /** requestBody */
      body?: FamilyInviteCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyInviteGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-invites';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeInviteStatus(
    params: {
      /** requestBody */
      body?: ChangeInviteStatusDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyInviteGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-invites';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
