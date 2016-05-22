import {Injector, Injectable} from "@angular/core";

export let injector: Injector;

@Injectable()
/** 
 * Used as a method to inject dependencies into derived classes.  We can't use @Injectable
 * in those cases so we expose the application Injector to allow logic to call out to other
 * application services.
 */
export class AngularPointInjector {
    constructor(inj: Injector) {
        injector = inj;
    }
}
