import {
  CalendarCreateDto,
  CalendarGetDto,
  CalendarUpdateDto,
  EmptyResponse,
  Error,
  CalendarWithEventsDto,
  CalendarEventGetDto,
  CalendarEventType,
  RecurrenceType,
  DayOfWeek,
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

export class CalendarsService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: CalendarCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<CalendarGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendars';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAll(options: IRequestOptions = {}): Promise<Response<List<CalendarGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendars';

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
  ): Promise<Response<CalendarGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendars/{id}';
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
      body?: CalendarUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<CalendarGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendars/{id}';
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
      let url = basePath + '/api/calendars/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCalendarsWithEventsByUserId(
    params: {
      /**  */
      userId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<CalendarWithEventsDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendars/events/user/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getByUserId(
    params: {
      /**  */
      userId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<CalendarGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendars/user/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
