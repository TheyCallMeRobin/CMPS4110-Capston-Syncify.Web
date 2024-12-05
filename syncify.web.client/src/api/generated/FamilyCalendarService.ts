import {
  FamilyCalendarCreateDto,
  FamilyCalendarGetDto,
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

export class FamilyCalendarService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static addCalendarToFamily(
    params: {
      /** requestBody */
      body?: FamilyCalendarCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyCalendarGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-calendars';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFamilyCalendars(
    params: {
      /**  */
      familyId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<FamilyCalendarGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-calendars/family/{familyId}';
      url = url.replace('{familyId}', params['familyId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFamilyCalendarById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<FamilyCalendarGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-calendars/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeCalendarFromFamily(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmptyResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-calendars/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getOptions(
    params: {
      /**  */
      userId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<OptionDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/family-calendars/options/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
