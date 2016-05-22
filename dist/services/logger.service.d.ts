import { ListItem } from '../factories';
export declare class LogEvent implements ILogEvent {
    message: string;
    promise: Promise<ListItem<any>>;
    type: string;
    url: string;
    constructor(options: ILogEvent, type: string, message: string);
    _resolve: (any);
}
export interface ILogEvent {
    cause?: string;
    event?: string;
    json?: Object;
    message?: string;
    stackTrace?: string[];
    type?: string;
    url?: string;
}
export interface ILoggerService {
    eventQueue: ILogEvent[];
    subscribers: Function[];
    debug(message: string, optionsOverride?: ILogEvent): Promise<ListItem<any>>;
    error(message: string, optionsOverride?: ILogEvent): Promise<ListItem<any>>;
    exception(exception: Error, cause?: string, optionsOverride?: ILogEvent): void;
    info(message: string, optionsOverride?: ILogEvent): Promise<ListItem<any>>;
    log(message: string, optionsOverride?: ILogEvent): Promise<ListItem<any>>;
    registerEvent(logEvent: ILogEvent): void;
    subscribe(callback: Function): void;
    warn(message: string, optionsOverride?: ILogEvent): Promise<ListItem<any>>;
}
export declare let LoggerService: ILoggerService;
