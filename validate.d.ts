import { type } from "os";

//Allowe exclusive unions, as workaround for a typescript bug, see: https://stackoverflow.com/a/52678379/5796663
type UnionKeys<T> = T extends any ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>> : never;
type StrictUnion<T> = StrictUnionHelper<T, T>

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

  export type MessageFunction = (value: any, attribute: string, validatorOptions: Constraints, attributes: any, globalOptions: ValidateOption) => string;

  interface baseConstraint {
    message?: string | MessageFunction
  }
  export interface DateTimeConstraint extends baseConstraint {
    earliest?: any;
    latest?: any;
    dateOnly?: boolean;
    notValid?: string;
    tooEarly?: string;
    tooLate?: string;
  }
  export interface AdvancecEqualityConstraint extends baseConstraint {
    attribute: string;
    comparator: (a: any, b: any) => boolean;
  }
  type types = "array" | "integer" | "number" | "string" | "date" | "boolean" | string;
  export interface AdvancedTypeConstraint extends baseConstraint {
    type: types;
  }
  export type EmailConstraint = boolean | baseConstraint;
  export type EqualityConstraint = string | AdvancecEqualityConstraint;
  export interface EnumConstraint extends baseConstraint {
    within: any[] | {
      [index: string]: any
    }
  }
  export interface FormatConstraint extends baseConstraint {
    pattern: RegExp | string;
    flags?: string;
  }
  interface LengthIs {
    is?: number;
  }
  interface LengthMinMax {
    minimum?: number;
    maximum?: number;
  }
  interface LengthBaseConstraint extends baseConstraint {
    notValid?: string;
    tooLong?: string;
    tooShort?: string;
  }
  export type LengthConstraint = StrictUnion<LengthIs | LengthMinMax> & LengthBaseConstraint;
  type NumericalityGreaterOptions = StrictUnion<{ greaterThan?: number; } | { greaterThanOrEqualTo?: number; }>;
  type NumericalityLessOptions = StrictUnion<{ lessThan?: number; } | { lessThanOrEqualTo?: number; }>;
  interface NumericalityEqualOptions {
    equalTo?: number;
  }
  type NumericalityEvenOrOdd = StrictUnion<{ isEven?: boolean; } | { isOdd?: boolean; }>
  export type NumericalityRangeOptions = StrictUnion<NumericalityEqualOptions | (NumericalityGreaterOptions & NumericalityLessOptions)>;
  interface NumericalityBaseConstraint extends baseConstraint {
    onlyInteger?: boolean;
    strict?: boolean;
    divisibleBy?: number;
    notValid?: string;
    notInteger?: string;
    notGreaterThan?: string;
    notGreaterThanOrEqualTo?: string;
    notEqualTo?: string;
    notLessThan?: string;
    notLessThanOrEqualTo?: string;
    notDivisibleBy?: string;
    notOdd?: string;
    notEven?: string;
  }
  export type NumericalityConstraint = NumericalityBaseConstraint & NumericalityRangeOptions & NumericalityEvenOrOdd;
  export type TypeConstraint = AdvancedTypeConstraint | types;
  export interface UrlConstraint extends baseConstraint {
    schemes?: string[];
    allowLocal?: boolean;
    allowDataUrl?: boolean;
  }

  type Constraint<T> = T | ConstraintFunction<T>

  export type Constraints = {
    date?: Constraint<DateTimeConstraint>;
    datetime?: Constraint<DateTimeConstraint>;
    email?: Constraint<EmailConstraint>
    equality?: Constraint<EqualityConstraint>;
    exclusion?: Constraint<EnumConstraint>;
    format?: Constraint<FormatConstraint>;
    length?: Constraint<LengthConstraint>;
    inclusion?: Constraint<EnumConstraint>;
    numericality?: Constraint<NumericalityConstraint>;
    presence?: Constraint<PresenceConstraint>;
    type?: Constraint<TypeConstraint>;
    url?: Constraint<UrlConstraint>;
  } & { [validatorName: string]: Constraint<any> }
  type PresenceConstraint = boolean | { allowEmpty: boolean };

  export type ConstraintFunction<T> = (value: any, attributes: any, attributeName: string, options: any, constraints: Schema) => T;
  export type ConstraintsFunction = (value: any, attributes: any, attributeName: string, options: any, constraints: Schema) => Constraints;

  export type Schema = { [fieldName: string]: Constraints | ConstraintsFunction };

  export type ValidationResult = undefined | { [fieldName: string]: any };

  export interface ValidateJS {
    (attributes: any, constraints: Schema, options?: ValidateOption): ValidationResult;
    validate(attributes: any, constraints: Schema, options?: ValidateOption): ValidationResult;
    async(attributes: any, constraints: Schema, options?: AsyncValidateOption): Promise<ValidationResult>;
    single(value: any, constraints: Constraints, options?: ValidateOption): any;

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
