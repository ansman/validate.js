
declare namespace validate {
  export interface ValidateOption {
    format?: string;
    prettify?: Function;
    fullMessages?: boolean;
  }

  export interface AsyncValidateOption {
    wrapErrors?: Function;
    prettify?: Function;
    cleanAttributes?: boolean;
  }

  export interface CollectFormValuesOption {
    nullify?: boolean;
    trim?: boolean;
  }
  
  export type ValidateErrors<T extends object> = {
    [key in keyof T]?: string[];
  };

  export interface ValidateJS {
    <T extends object = object>(attributes: any, constraints: T, options?: ValidateOption): ValidateErrors<T> | undefined;
    validate<T extends object = object>(attributes: any, constraints: T, options?: ValidateOption): ValidateErrors<T> | undefined;
    async(attributes: any, constraints: object, options?: AsyncValidateOption): Promise<any>;
    single(value: any, constraints: object, options?: ValidateOption): string[] | undefined;

    validators: any;
    formatters: any;

    capitalize(value: string): string;
    cleanAttributes(attributes: any, whitelist: any): any;
    collectFormValues(form: any, options?: CollectFormValuesOption): any;
    contains(obj: any, value: any): boolean;
    extend(obj: any, ...otherObjects: any[]): any;
    format(str: string, vals: any): string;
    getDeepObjectValue(obj: any, keypath: string): any;
    isArray(value: any): boolean;
    isBoolean(value: any): boolean;
    isDate(value: any): boolean;
    isDefined(value: any): boolean;
    isDomElement(value: any): boolean;
    isEmpty(value: any): boolean;
    isFunction(value: any): boolean;
    isHash(value: any): boolean;
    isInteger(value: any): boolean;
    isNumber(value: any): boolean;
    isObject(value: any): boolean;
    isPromise(value: any): boolean;
    isString(value: any): boolean;
    prettify(value: string): string;
    result(value: any, ...args: any[]): any;
  }
}

declare const validate: validate.ValidateJS;
export = validate;
