import {
  CalendarEventCreateDto,
  CalendarEventType,
  RecurrenceType,
  DayOfWeek,
  CalendarEventGetDto,
  CalendarEventUpdateDto,
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

export class CalendarEventService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static createCalendarEvent(
    params: {
      /** requestBody */
      body?: CalendarEventCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<CalendarEventGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendar-events';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCalendarEvents(
    params: {
      /**  */
      calendarId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<List<CalendarEventGetDto>>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendar-events/calendar/{calendarId}';
      url = url.replace('{calendarId}', params['calendarId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCalendarEventById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<CalendarEventGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendar-events/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateCalendarEvent(
    params: {
      /**  */
      id: number;
      /** requestBody */
      body?: CalendarEventUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Response<CalendarEventGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendar-events/{id}';
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
  static deleteCalendarEvent(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmptyResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/calendar-events/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
