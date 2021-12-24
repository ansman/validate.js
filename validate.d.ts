declare namespace validate {

  /**
   * This datetime validator can be used to validate dates and times.
   */
  export type DateConstraint = boolean | {
    /**
     * The date cannot be before this time.
     * This argument will be parsed using the `parse` function,
     * just like the value.
     * The default error must be no earlier than %{date}
     */
    earliest: Date;
    latest: Date;
    dateOnly: boolean;
  };

  /**
   * The email validator attempts to make sure the input is a valid email.
   * You can customize the regexp used by setting `validate.validators.email.PATTERN` to a regexp of your chosing,
   * just remember that javascript regexp does substring matching.
   */
  export type EmailConstraint = boolean | {
    message: string;
  };

  /**
   * The equality validator can be used to verify that one attribute is always equal to another.
   * This is useful when having a "confirm password" input for example.
   */
  export type EqualityConstraint = string | {

    /** Name of the attribute to compare. */
    attribute: string;
    /**
     * The default message is is not equal to %{attribute} validate.validators.equality.message
     */
    message?: string;

    /** Custom comparator. */
    comparator: (v1: any, v2: any) => boolean;
  };

  /**
   * The exclusion validator is useful for restriction certain values.
   * It checks that the given value is not in the list given by the within option.
   */
  export type ExclusionConstraint = string[] | {
    within: Object | any[];
    /** The default message is ^%{value} is restricted and can be changed by setting */
    message?: string;
  };
  /**
   * The format validator will validate a value against a regular expression of your chosing.
   */
  export interface FormatConstraint {
    /** The pattern option can either be a javascript regexp or string that will be passed to the RegExp constructor. */
    pattern: string;
    /** If the pattern is a string and you want to specify flags you may use the flags option. */
    flags?: string;
    /**
     * The default message if the value doesn't match is is invalid so you'll likely want to customize it
     * by settings message to something in the options or by setting a new global default message
     * using validate.validators.format.message
     */
    message?: string;
  }

  /**
   * he inclusion validator is useful for validating input from a dropdown for example.
   * It checks that the given value exists in the list given by the within option.
   */
  export type InclusionConstraint = string[] | {
    /** You can specify within as a list or as an object (in which case the keys of the object are used). */
    within?: Object | string[];
    /**
     * The default message is `^%{value} is not included in the list`
     * and can be changed by setting validate.validators.inclusion.message
     */
    message?: string;
  };

  /**
   * The length validator will check the length of a string.
   * Any object with the length property can be validated
   * but all the default error messages refers to strings
   * so make sure you override them if you plan on validating arrays using this.
   * One important thing to note is that the value needs to have a numeric value for the length property
   * or the message has an incorrect length is returned.
   */
  export interface LengthConstraint  {
    /**
     * Match exacly
     */
    is?: number;

    /**
     * Match if string longer than...
     */
    minimum?: number;

    /**
     * Match if string shorter than...
     */
    maximum?: number;

    /**
     * Message string for all errors. Ovverrides `notValid`, `tooLong` and `tooShort`.
     * Use %{count} as a placeholder.
     */
    message?: string;

    /**
     * Message shown when `is` is not matched.
     * Use %{count} as a placeholder.
     */
    notValid?: string;

    /**
     * Message shown when `maximum` is not matched.
     * Use %{count} as a placeholder.
     */
    tooLong?: string;

    /**
     * Message shown when `minimum` is not matched.
     * Use %{count} as a placeholder.
     */
    tooShort?: string;
  }

  /**
   * The numericality validator will only allow numbers.
   * Per default strings are coerced to numbers using the + operator.
   * If this is not desirable you can set the noStrings option to true to disable this behaviour.
   */
  export type NumericalityConstraint = boolean | {
    /** Real numbers won't be allowed. The error message is imust be an integer` */
    onlyInteger?: boolean;

    /** Enables more strict validation of strings. Leading zeroes won't be allowed and the number cannot be malformed. */
    strict?: boolean;

    /** The input has to be greater than this value. The error message is `must be greater than %{count} */
    greaterThan?: number;

    /** The input has to be at least this value. The error message is `must be greater than or equal to %{count}` */
    greaterThanOrEqualTo?: number;

    /** The input has to be exactly this value. The error message is `must be equal to %{count}` */
    equalTo?: number;

    /** The input can be this value at the most. The error message is `must be less than or equal to %{count}` */
    lessThanOrEqualTo?: number;

    /** The input has to be less than this value. The error message is `must be less than %{count}` */
    lessThan?: number;

    /** The input has to be divisible by this value. The error message is `must be divisible by %{count}` */
    divisibleBy?: number;

    /** The input has to be odd. The error message is `must be odd` */
    odd?: boolean;

    /** The input has to be even. The error message is `must be even` */
    even?: boolean;


    /** Error message for and `strict` constraints. */
    notValid?: string;

    /** Error message for `onlyInteger` constraint */
    notInteger?: string;

    /** Error message for `greaterThan` constraint*/
    notGreaterThan?: string;

    /** Error message for `greaterThanOrEqualTo` constraint */
    notGreaterThanOrEqualTo?: string;

    /** Error message for `equalTo` constraint */
    notEqualTo?: string;

    /** Error message for `lessThan` constraint */
    notLessThan?: string;

    /** Error message for `lessThanOrEqualTo` constraint */
    notLessThanOrEqualTo?: string;

    /** Error message for `divisibleBy` constraint */
    notDivisibleBy?: string;

    /** Error message for `odd` constraint */
    notOdd?: string;

    /** Error message for `even` constraint */
    notEven?: string;
  };

  /**
   * The presence validator validates that the value is defined.
   */
  export type PresenceConstraint = boolean | {
    /**
     * Error message. Default is 'can't be blank'
     */
    message: string;

    /**
     * Set to false, to disallow the following values:
     * - {} (empty objects)
     * - [] (empty arrays)
     * - "" (empty string)
     * - " " (whitespace only string)
     */
    allowEmpty: boolean;
  };
    /**
   * The URL validator ensures that the input is a valid URL.
   */
  export type UrlConstraint = boolean | {
    /**
     * A list of schemes to allow.
     * If you want to support any scheme
     * you can use a regexp here (for example [".+"]).
     * The default value is ["http", "https"].
     */
    schemes?: string[];

    /**
     * The message if the validator fails.
     * Defaults to is not a valid url
     */
    message: string;

    /**
     * A boolean that if true allows local hostnames
     * such as 10.0.1.1 or localhost. The default is false.
     */
    allowLocal: boolean;
  };

export interface ConstraintsTypes {
  date?: DateConstraint;

  datetime?: DateConstraint;

  email?: EmailConstraint;

  equality?: EqualityConstraint;

  exclusion?: ExclusionConstraint;

  format?: FormatConstraint;

  inclusion?: InclusionConstraint;

  length?: LengthConstraint;

  numericality?: NumericalityConstraint;

  presence?: PresenceConstraint;

  url?: UrlConstraint;

}

export interface Constraints {
  [name: string]: ConstraintsTypes;
}

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

export interface ValidateJS {
  validators: any;
  formatters: any;

  (attributes: any, constraints: Constraints, options?: ValidateOption): any;
  validate(attributes: any, constraints: Constraints, options?: ValidateOption): any;
  async(attributes: any, constraints: Constraints, options?: AsyncValidateOption): Promise<any>;
  single(value: any, constraints: Constraints, options?: ValidateOption): any;

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
