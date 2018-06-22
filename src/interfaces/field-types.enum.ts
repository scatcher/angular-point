export enum FieldTypeEnum {
    Attachments = 'Attachments',
    Boolean = 'Boolean',
    Calculated = 'Calculated',
    Choice = 'Choice',
    Counter = 'Counter',
    Currency = 'Currency',
    DateTime = 'DateTime',
    Lookup = 'Lookup',
    LookupMulti = 'LookupMulti',
    Mask = 'Mask',
    MultiChoice = 'MultiChoice',
    Note = 'Note',
    Number = 'Number',
    Text = 'Text',
    User = 'User',
    UserMulti = 'UserMulti',
    // Non-SharePoint Types
    JSON = 'JSON',
    HTML = 'HTML',
    // Backwards compatibility with older version of Angular-Point
    Integer = 'Integer',
    Float = 'Float',
}

export type FieldTypeUnion =
    | FieldTypeEnum.Attachments
    | FieldTypeEnum.Boolean
    | FieldTypeEnum.Calculated
    | FieldTypeEnum.Choice
    | FieldTypeEnum.Counter
    | FieldTypeEnum.Currency
    | FieldTypeEnum.DateTime
    | FieldTypeEnum.Lookup
    | FieldTypeEnum.LookupMulti
    | FieldTypeEnum.Mask
    | FieldTypeEnum.MultiChoice
    | FieldTypeEnum.Note
    | FieldTypeEnum.Number
    | FieldTypeEnum.Text
    | FieldTypeEnum.User
    | FieldTypeEnum.UserMulti
    | FieldTypeEnum.JSON
    | FieldTypeEnum.HTML
    | FieldTypeEnum.Integer
    | FieldTypeEnum.Float;
