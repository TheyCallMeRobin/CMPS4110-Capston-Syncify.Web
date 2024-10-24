import {
  QuoteGetDto,
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

export class QuoteService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getQuoteOfTheDay(options: IRequestOptions = {}): Promise<Response<QuoteGetDto>> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/quotes/quote-of-the-day';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
