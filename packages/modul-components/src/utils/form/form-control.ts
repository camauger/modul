import { AbstractControl } from './abstract-control';
import { ControlError } from './control-error';
import { FormControlOptions } from './control-options';
import { ControlValidator } from './validators/control-validator';

export class FormControl<T> extends AbstractControl {
    private _value?: T;
    private _initialValue?: T;
    private _oldValue?: T;

    constructor(
        public readonly validators: ControlValidator[] = [],
        options?: FormControlOptions<T>
    ) {
        super(validators, options);

        if (options) {
            if (options.initialValue !== undefined) {
                this.initialValue = options.initialValue;
            }
        } else {
            // ensure reactivity
            this._value = undefined;
        }
    }

    private clone(oldObject: T): T {
        const newObject: T = { ...oldObject };
        Object.setPrototypeOf(newObject, Object.getPrototypeOf(oldObject));
        return newObject;
    }

    public set initialValue(initialValue: T) {
        if (Array.isArray(initialValue)) {
            this._initialValue = [...initialValue] as unknown as T;
            this._value = [...initialValue] as unknown as T;
            this._oldValue = [...initialValue] as unknown as T;
        } else if (initialValue instanceof Object) {
            this._initialValue = this.clone(initialValue);
            this._value = this.clone(initialValue);
            this._oldValue = this.clone(initialValue);
        } else {
            this._initialValue = initialValue;
            this._value = initialValue;
            this._oldValue = initialValue;
        }
    }

    public get touched(): boolean {
        return this._touched;
    }

    public get controls(): AbstractControl[] {
        return [];
    }

    public getControl<T = any>(name: string): AbstractControl<T> {
        return undefined!;
    }

    get value(): T | undefined {
        return this._value;
    }

    set value(value: T | undefined) {
        if (value === this.value && typeof value !== 'object') {
            return;
        }

        this._oldValue = this._value;
        this._value = value;

        this.upwardValueChanged();
    }

    public get valid(): boolean {
        if (!this.enabled || this.readonly) {
            return true;
        } else {
            return this.validators.every(v => !!v.lastCheck);
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(isEnabled: boolean) {
        this._enabled = isEnabled;
    }

    public get waiting(): boolean {
        return this._waiting;
    }

    public set waiting(isWaiting: boolean) {
        this._waiting = isWaiting;
    }

    public get readonly(): boolean {
        return this._readonly;
    }

    public set readonly(isReadonly: boolean) {
        this._readonly = isReadonly;
    }

    public get errors(): ControlError[] {
        return (this.enabled && !this.readonly) ? this._errors : [];
    }

    public set errors(errors: ControlError[]) {
        this._errors = [...errors];
    }

    public get errorsDeep(): ControlError[] {
        return this.errors;
    }

    /**
     * This specify the ennd of a edition context.
     */
    public endEdition(): void {
        this._touched = true;
        super.endEdition();
    }

    /**
     * Reset the field to it's orginal pristine state.
     *
     * @param {T} [initialValue]  a new initial value for the field
     */
    public reset(initialValue?: T): void {
        super.reset();
        this._touched = false;

        if (typeof initialValue === 'undefined') {
            this._value = this._initialValue;
            this._oldValue = this._initialValue;
        } else {
            this.initialValue = initialValue;
        }
    }

    /**
     * Run all validators
     *
     */
    public async submit(): Promise<void> {
        super.submit();
        this.validate();
        await this.validateAsync();
    }
}
