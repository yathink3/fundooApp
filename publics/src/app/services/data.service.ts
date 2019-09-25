import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class DataService {
    private messageresource = new BehaviorSubject<string>('default message');
    constructor() {
    }
    changemessage(message: string) {
        this.messageresource.next(message);
    }
}
