import { EnhancerOptions } from '@redux-devtools/extension';
import { Container } from 'aurelia-dependency-injection';
import { Logger } from 'aurelia-logging';
import { Observable } from 'rxjs';

export interface StateHistory<T> {
	past: T[];
	present: T;
	future: T[];
}
export interface HistoryOptions {
	undoable: boolean;
	limit?: number;
}
export declare function jump<T>(state: T, n: number): T | StateHistory<any>;
export declare function nextStateHistory<T>(presentStateHistory: StateHistory<T>, nextPresent: T): StateHistory<T>;
export declare function applyLimits<T>(state: T, limit: number): T;
export declare function isStateHistory(history: any): history is StateHistory<any>;
export declare const DEFAULT_LOCAL_STORAGE_KEY = "aurelia-store-state";
export interface CallingAction {
	name: string;
	params?: any[];
	pipedActions?: {
		name: string;
		params?: any[];
	}[];
}
export declare type Middleware<T, S = any> = (state: T, originalState: T | undefined, settings: S, action?: CallingAction) => T | Promise<T | undefined | false> | void | false;
export declare enum MiddlewarePlacement {
	Before = "before",
	After = "after"
}
export declare function logMiddleware(state: unknown, _: unknown, settings?: {
	logType: "debug" | "error" | "info" | "log" | "trace" | "warn";
}): void;
export declare function localStorageMiddleware(state: unknown, _: unknown, settings?: {
	key: string;
}): void;
export declare function rehydrateFromLocalStorage<T>(state: T, key?: string): any;
export declare enum LogLevel {
	trace = "trace",
	debug = "debug",
	info = "info",
	log = "log",
	warn = "warn",
	error = "error"
}
export declare class LoggerIndexed extends Logger {
	[key: string]: any;
}
export interface LogDefinitions {
	performanceLog?: LogLevel;
	dispatchedActions?: LogLevel;
	devToolsStatus?: LogLevel;
}
export declare function getLogType(options: Partial<StoreOptions>, definition: keyof LogDefinitions, defaultLevel: LogLevel): LogLevel;
export interface Action<T = any> {
	type: T;
	params?: any[];
}
export interface ActionCreator<T> {
	(...args: any[]): T;
}
export declare type DevToolsOptions = import("@redux-devtools/extension").EnhancerOptions | {
	disable: boolean;
};
export declare type Reducer<T, P extends any[] = any[]> = (state: T, ...params: P) => T | false | Promise<T | false>;
export declare enum PerformanceMeasurement {
	StartEnd = "startEnd",
	All = "all"
}
export interface StoreOptions {
	history?: Partial<HistoryOptions>;
	logDispatchedActions?: boolean;
	measurePerformance?: PerformanceMeasurement;
	propagateError?: boolean;
	logDefinitions?: LogDefinitions;
	devToolsOptions?: DevToolsOptions;
}
export interface PipedDispatch<T> {
	pipe: <P extends any[]>(reducer: Reducer<T, P> | string, ...params: P) => PipedDispatch<T>;
	dispatch: () => Promise<void>;
}
export declare class UnregisteredActionError<T, P extends any[]> extends Error {
	constructor(reducer?: string | Reducer<T, P>);
}
export declare class Store<T> {
	private initialState;
	readonly state: Observable<T>;
	private logger;
	private devToolsAvailable;
	private devTools;
	private actions;
	private middlewares;
	private _state;
	private options;
	private _markNames;
	private _measureNames;
	private dispatchQueue;
	constructor(initialState: T, options?: Partial<StoreOptions>);
	registerMiddleware<S extends undefined>(reducer: Middleware<T, undefined>, placement: MiddlewarePlacement): void;
	registerMiddleware<S extends NonNullable<any>>(reducer: Middleware<T, S>, placement: MiddlewarePlacement, settings: S): void;
	unregisterMiddleware(reducer: Middleware<T, any>): void;
	isMiddlewareRegistered(middleware: Middleware<T, any>): boolean;
	registerAction(name: string, reducer: Reducer<T>): void;
	unregisterAction(reducer: Reducer<T>): void;
	isActionRegistered(reducer: Reducer<T> | string): boolean;
	resetToState(state: T): void;
	dispatch<P extends any[]>(reducer: Reducer<T, P> | string, ...params: P): Promise<void>;
	pipe<P extends any[]>(reducer: Reducer<T, P> | string, ...params: P): PipedDispatch<T>;
	private lookupAction;
	private queueDispatch;
	private handleQueue;
	private internalDispatch;
	private executeMiddlewares;
	private setupDevTools;
	private updateDevToolsState;
	private registerHistoryMethods;
	private mark;
	private clearMarks;
	private measure;
	private clearMeasures;
}
export declare function dispatchify<T, P extends any[]>(action: Reducer<T, P> | string): (...params: P) => Promise<void>;
export declare type StepFn<T> = (res: T) => void;
export declare function executeSteps<T>(store: Store<T>, shouldLogResults: boolean, ...steps: StepFn<T>[]): Promise<{}>;
export interface ConnectToSettings<T, R = T | any> {
	onChanged?: string;
	selector: ((store: Store<T>) => Observable<R>) | MultipleSelector<T, R>;
	setup?: string;
	target?: string;
	teardown?: string;
}
export interface MultipleSelector<T, R = T | any> {
	[key: string]: ((store: Store<T>) => Observable<R>);
}
export declare function connectTo<T, R = any>(settings?: ((store: Store<T>) => Observable<R>) | ConnectToSettings<T, R>): (target: any) => void;
export interface FrameworkConfiguration {
	container: Container;
}
export interface StorePluginOptions<T> extends StoreOptions {
	initialState: T;
}
export declare function configure<T>(aurelia: FrameworkConfiguration, options: Partial<StorePluginOptions<T>>): void;