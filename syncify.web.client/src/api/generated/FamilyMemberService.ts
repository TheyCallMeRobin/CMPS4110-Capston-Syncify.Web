import {
  FamilyMemberGetDto,
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

export class FamilyMemberService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getFamilyMembers(
    params: {
      /**  */
      familyId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<FamilyMemberGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-members/family/{familyId}';
      url = url.replace('{familyId}', params['familyId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeFamilyMember(
    params: {
      /**  */
      familyMemberId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmptyResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-members/{familyMemberId}';
      url = url.replace('{familyMemberId}', params['familyMemberId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
