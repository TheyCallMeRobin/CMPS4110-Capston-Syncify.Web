/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export interface IRequestOptions extends AxiosRequestConfig {
  /**
   * show loading status
   */
  loading?: boolean;
  /**
   * display error message
   */
  showError?: boolean;
  /**
   * data security, extended fields are encrypted using the specified algorithm
   */
  security?: Record<string, 'md5' | 'sha1' | 'aes' | 'des'>;
  /**
   * indicates whether Authorization credentials are required for the request
   * @default true
   */
  withAuthorization?: boolean;
}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
  /** only in axios interceptor config*/
  loading: boolean;
  showError: boolean;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  const configs: IRequestConfig = {
    loading: serviceOptions.loading,
    showError: serviceOptions.showError,
    ...options,
    method,
    url
  };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

export const basePath = '';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
export interface Response<T> {
  data: T | null;
  hasErrors: boolean;
  errors: Error[];
}

export interface Error {
  propertyName: string;
  errorMessage: string;
}

export class CalendarCreateDto {
  /**  */
  'name': string;

  constructor(data: CalendarCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class CalendarEventCreateDto {
  /**  */
  'title': string;

  /**  */
  'displayColor'?: string;

  /**  */
  'description'?: string;

  /**  */
  'isCompleted': boolean;

  /**  */
  'startDate'?: Date;

  /**  */
  'startTime'?: string;

  /**  */
  'endTime'?: string;

  /**  */
  'calendarEventType': CalendarEventType;

  /**  */
  'recurrenceType': RecurrenceType;

  /**  */
  'calendarId': number;

  /**  */
  'recurrenceWeekDays'?: DayOfWeek[];

  constructor(data: CalendarEventCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class CalendarEventGetDto {
  /**  */
  'title': string;

  /**  */
  'displayColor'?: string;

  /**  */
  'description'?: string;

  /**  */
  'isCompleted': boolean;

  /**  */
  'startDate'?: Date;

  /**  */
  'startTime'?: string;

  /**  */
  'endTime'?: string;

  /**  */
  'calendarEventType': CalendarEventType;

  /**  */
  'recurrenceType': RecurrenceType;

  /**  */
  'id': number;

  /**  */
  'calendarId': number;

  /**  */
  'recurrenceWeekDays'?: DayOfWeek[];

  constructor(data: CalendarEventGetDto = {}) {
    Object.assign(this, data);
  }
}

export class CalendarEventUpdateDto {
  /**  */
  'title': string;

  /**  */
  'displayColor'?: string;

  /**  */
  'description'?: string;

  /**  */
  'isCompleted': boolean;

  /**  */
  'startDate'?: Date;

  /**  */
  'startTime'?: string;

  /**  */
  'endTime'?: string;

  /**  */
  'calendarEventType': CalendarEventType;

  /**  */
  'recurrenceType': RecurrenceType;

  /**  */
  'recurrenceWeekDays'?: DayOfWeek[];

  constructor(data: CalendarEventUpdateDto = {}) {
    Object.assign(this, data);
  }
}

export class CalendarGetDto {
  /**  */
  'id': number;

  /**  */
  'name': string;

  /**  */
  'createdByUserId': number;

  constructor(data: CalendarGetDto = {}) {
    Object.assign(this, data);
  }
}

export class CalendarUpdateDto {
  /**  */
  'name': string;

  constructor(data: CalendarUpdateDto = {}) {
    Object.assign(this, data);
  }
}

export class CalendarWithEventsDto {
  /**  */
  'id': number;

  /**  */
  'name': string;

  /**  */
  'createdByUserId': number;

  /**  */
  'calendarEvents': CalendarEventGetDto[];

  constructor(data: CalendarWithEventsDto = {}) {
    Object.assign(this, data);
  }
}

export class ChangeCalendarEventStatusDto {
  /**  */
  'isCompleted': boolean;

  constructor(data: ChangeCalendarEventStatusDto = {}) {
    Object.assign(this, data);
  }
}

export class ChangeInviteStatusDto {
  /**  */
  'id': number;

  /**  */
  'status': InviteStatus;

  constructor(data: ChangeInviteStatusDto = {}) {
    Object.assign(this, data);
  }
}

export class CreateUserDto {
  /**  */
  'userName': string;

  /**  */
  'password': string;

  /**  */
  'email': string;

  /**  */
  'phoneNumber': string;

  /**  */
  'firstName': string;

  /**  */
  'lastName': string;

  /**  */
  'roles': string[];

  constructor(data: CreateUserDto = {}) {
    Object.assign(this, data);
  }
}

export class EmptyResponse {
  /**  */
  'hasErrors': boolean;

  /**  */
  'errors': Error[];

  constructor(data: EmptyResponse = {}) {
    Object.assign(this, data);
  }
}

export class Error {
  /**  */
  'errorMessage': string;

  /**  */
  'propertyName'?: string;

  constructor(data: Error = {}) {
    Object.assign(this, data);
  }
}

export class FamilyCalendarCreateDto {
  /**  */
  'calendarId': number;

  /**  */
  'familyId': number;

  constructor(data: FamilyCalendarCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyCalendarGetDto {
  /**  */
  'calendarId': number;

  /**  */
  'familyId': number;

  /**  */
  'calendarName': string;

  constructor(data: FamilyCalendarGetDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyCreateDto {
  /**  */
  'name': string;

  constructor(data: FamilyCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyGetDto {
  /**  */
  'name': string;

  /**  */
  'id': number;

  /**  */
  'identifier': string;

  /**  */
  'createdByUserId': number;

  constructor(data: FamilyGetDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyInviteCreateDto {
  /**  */
  'familyId': number;

  /**  */
  'expiresOn'?: Date;

  /**  */
  'inviteQuery': string;

  constructor(data: FamilyInviteCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyInviteGetDto {
  /**  */
  'familyId': number;

  /**  */
  'expiresOn'?: Date;

  /**  */
  'id': number;

  /**  */
  'sentByUserId': number;

  /**  */
  'userId': number;

  /**  */
  'familyName': string;

  /**  */
  'sentByUserFullName': string;

  /**  */
  'userFullName': string;

  /**  */
  'status': InviteStatus;

  constructor(data: FamilyInviteGetDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyMemberGetDto {
  /**  */
  'familyId': number;

  /**  */
  'userId': number;

  /**  */
  'id': number;

  /**  */
  'userFirstName': string;

  /**  */
  'userLastName': string;

  constructor(data: FamilyMemberGetDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyRecipeCreateDto {
  /**  */
  'familyId': number;

  /**  */
  'recipeId': number;

  constructor(data: FamilyRecipeCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyRecipeGetDto {
  /**  */
  'familyId': number;

  /**  */
  'recipeId': number;

  /**  */
  'createdByUserId': number;

  constructor(data: FamilyRecipeGetDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyShoppingListCreateDto {
  /**  */
  'familyId': number;

  /**  */
  'shoppingListId': number;

  constructor(data: FamilyShoppingListCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyShoppingListGetDto {
  /**  */
  'familyId': number;

  /**  */
  'shoppingListId': number;

  /**  */
  'createdByUserId': number;

  constructor(data: FamilyShoppingListGetDto = {}) {
    Object.assign(this, data);
  }
}

export class FamilyUpdateDto {
  /**  */
  'name': string;

  constructor(data: FamilyUpdateDto = {}) {
    Object.assign(this, data);
  }
}

export class LoginDto {
  /**  */
  'username': string;

  /**  */
  'password': string;

  constructor(data: LoginDto = {}) {
    Object.assign(this, data);
  }
}

export class OptionDto {
  /**  */
  'label': string;

  /**  */
  'value': number;

  constructor(data: OptionDto = {}) {
    Object.assign(this, data);
  }
}

export class QuoteGetDto {
  /**  */
  'q': string;

  /**  */
  'a': string;

  constructor(data: QuoteGetDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeCreateDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'prepTimeInSeconds'?: number;

  /**  */
  'cookTimeInSeconds'?: number;

  /**  */
  'servings'?: number;

  /**  */
  'feeds'?: number;

  constructor(data: RecipeCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeGetDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'prepTimeInSeconds'?: number;

  /**  */
  'cookTimeInSeconds'?: number;

  /**  */
  'servings'?: number;

  /**  */
  'feeds'?: number;

  /**  */
  'id': number;

  /**  */
  'createdByUserFullName': string;

  constructor(data: RecipeGetDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeIngredientCreateDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'unit': string;

  /**  */
  'recipeId': number;

  constructor(data: RecipeIngredientCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeIngredientGetDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'unit': string;

  /**  */
  'id': number;

  /**  */
  'recipeId': number;

  constructor(data: RecipeIngredientGetDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeIngredientUpdateDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'unit': string;

  constructor(data: RecipeIngredientUpdateDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeTagCreateDto {
  /**  */
  'name': string;

  /**  */
  'recipeId': number;

  constructor(data: RecipeTagCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class RecipeTagDto {
  /**  */
  'id': number;

  /**  */
  'name': string;

  /**  */
  'recipeId': number;

  constructor(data: RecipeTagDto = {}) {
    Object.assign(this, data);
  }
}

export class ShoppingListCreateDto {
  /**  */
  'name': string;

  /**  */
  'description': string;

  /**  */
  'userId': number;

  constructor(data: ShoppingListCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class ShoppingListGetDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  /**  */
  'id': number;

  /**  */
  'shoppingListItems': ShoppingListItemGetDto[];

  constructor(data: ShoppingListGetDto = {}) {
    Object.assign(this, data);
  }
}

export class ShoppingListItemCreateDto {
  /**  */
  'name': string;

  /**  */
  'unit': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'isChecked': boolean;

  /**  */
  'shoppingListId': number;

  constructor(data: ShoppingListItemCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class ShoppingListItemGetDto {
  /**  */
  'name': string;

  /**  */
  'unit': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'isChecked': boolean;

  /**  */
  'id': number;

  /**  */
  'shoppingListId': number;

  constructor(data: ShoppingListItemGetDto = {}) {
    Object.assign(this, data);
  }
}

export class ShoppingListItemUpdateDto {
  /**  */
  'name': string;

  /**  */
  'unit': string;

  /**  */
  'description'?: string;

  /**  */
  'quantity': number;

  /**  */
  'isChecked': boolean;

  constructor(data: ShoppingListItemUpdateDto = {}) {
    Object.assign(this, data);
  }
}

export class ShoppingListRecipeCreateDto {
  /**  */
  'name': string;

  /**  */
  'description': string;

  /**  */
  'userId': number;

  /**  */
  'recipeId': number;

  constructor(data: ShoppingListRecipeCreateDto = {}) {
    Object.assign(this, data);
  }
}

export class ShoppingListUpdateDto {
  /**  */
  'name': string;

  /**  */
  'description'?: string;

  constructor(data: ShoppingListUpdateDto = {}) {
    Object.assign(this, data);
  }
}

export class UserGetDto {
  /**  */
  'id': number;

  /**  */
  'userName': string;

  /**  */
  'firstName': string;

  /**  */
  'lastName': string;

  /**  */
  'email': string;

  /**  */
  'phoneNumber': string;

  /**  */
  'roles': string[];

  /**  */
  'profileColor': string;

  /**  */
  'memberIdentifier': string;

  constructor(data: UserGetDto = {}) {
    Object.assign(this, data);
  }
}

export enum CalendarEventType {
  'Event' = 'Event',
  'Task' = 'Task'
}

export enum DayOfWeek {
  'Sunday' = 'Sunday',
  'Monday' = 'Monday',
  'Tuesday' = 'Tuesday',
  'Wednesday' = 'Wednesday',
  'Thursday' = 'Thursday',
  'Friday' = 'Friday',
  'Satuday' = 'Satuday'
}

export enum InviteStatus {
  'Pending' = 'Pending',
  'Accepted' = 'Accepted',
  'Declined' = 'Declined',
  'Expired' = 'Expired',
  'Cancelled' = 'Cancelled'
}

export enum RecurrenceType {
  'Daily' = 'Daily',
  'Weekly' = 'Weekly',
  'BiWeekly' = 'BiWeekly',
  'Monthly' = 'Monthly',
  'Custom' = 'Custom'
}
