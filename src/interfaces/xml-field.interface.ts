import { FieldTypeEnum } from './field-types.enum';

export interface XmlFieldBoolean {
    Type: FieldTypeEnum;
    DisplayName: string;
    Description: string;
    EnforceUniqueValues: string;
    Indexed: string;
    StaticName: string;
    Name: string;
    RowOrdinal: string;
}

export interface XmlFieldChoice {
    Choices: string[];
    Default: string;
    Description: string;
    DisplayName: string;
    EnforceUniqueValues: string;
    FillInChoice: string;
    Format: string;
    Indexed: string;
    Name: string;
    Required: string;
    RowOrdinal: string;
    StaticName: string;
    Type: FieldTypeEnum;
}

export interface XmlFieldDateTime {
    Type: FieldTypeEnum;
    DisplayName: string;
    Required: string;
    EnforceUniqueValues: string;
    Indexed: string;
    Format: string;
    StaticName: string;
    Name: string;
    RowOrdinal: string;
    CalType: string;
}

export interface XmlFieldLookup {
    Type: FieldTypeEnum;
    DisplayName: string;
    Required: string;
    EnforceUniqueValues: string;
    List: string;
    ShowField: string;
    UnlimitedLengthInDocumentLibrary: string;
    RelationshipDeleteBehavior: string;
    StaticName: string;
    Name: string;
    RowOrdinal: string;
    Group: string;
}

export interface XmlFieldLookupMulti {
    Description: string;
    DisplayName: string;
    EnforceUniqueValues: string;
    Group: string;
    List: string;
    Mult: string;
    Name: string;
    RelationshipDeleteBehavior: string;
    Required: string;
    RowOrdinal: string;
    ShowField: string;
    Sortable: string;
    StaticName: string;
    Type: FieldTypeEnum;
    UnlimitedLengthInDocumentLibrary: string;
}

export interface XmlFieldMultiChoice {
    Type: FieldTypeEnum;
    DisplayName: string;
    Description: string;
    Required: string;
    EnforceUniqueValues: string;
    Indexed: string;
    FillInChoice: string;
    StaticName: string;
    Name: string;
    RowOrdinal: string;
    Choices: string[];
}

export interface XmlFieldNote {
    DisplayName: string;
    EnforceUniqueValues: string;
    Indexed: string;
    Name: string;
    NumLines: string;
    Required: string;
    RichText: string;
    RowOrdinal: string;
    Sortable: string;
    StaticName: string;
    Type: FieldTypeEnum;
}

export interface XmlFieldNumber {
    Type: FieldTypeEnum;
    DisplayName: string;
    Description: string;
    Required: string;
    EnforceUniqueValues: string;
    Indexed: string;
    Min: string;
    Decimals: string;
    StaticName: string;
    Name: string;
    RowOrdinal: string;
}

export interface XmlFieldText {
    Description: string;
    DisplayName: string;
    EnforceUniqueValues: string;
    Indexed: string;
    MaxLength: string;
    Name: string;
    Required: string;
    RowOrdinal: string;
    StaticName: string;
    Type: FieldTypeEnum;
}

export interface XmlFieldUserMulti {
    Description: string;
    DisplayName: string;
    EnforceUniqueValues: string;
    List: string;
    Mult: string;
    Name: string;
    Required: string;
    RowOrdinal: string;
    ShowField: string;
    Sortable: string;
    StaticName: string;
    Type: FieldTypeEnum;
    UserSelectionMode: string;
    UserSelectionScope: string;
}

export interface XMLFieldDefinition
    extends XmlFieldBoolean,
        XmlFieldChoice,
        XmlFieldDateTime,
        XmlFieldLookup,
        XmlFieldLookupMulti,
        XmlFieldMultiChoice,
        XmlFieldNote,
        XmlFieldNumber,
        XmlFieldText,
        XmlFieldUserMulti {}
