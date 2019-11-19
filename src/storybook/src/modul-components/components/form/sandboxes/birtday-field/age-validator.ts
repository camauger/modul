import { ControlValidatorValidationType } from '@ulaval/modul-components/dist/utils/form/control-validator-validation-type';
import { ControlValidator } from '@ulaval/modul-components/dist/utils/form/validators/control-validator';
// tslint:disable-next-line:import-blacklist
import moment, { Moment } from 'moment';
import BirthdayFieldFormGroup from './birthday-field-form-group';

function validationFunction(minimumAge: number): (formControl: BirthdayFieldFormGroup) => boolean {
    return (formControl: BirthdayFieldFormGroup): boolean => {
        const day: number = formControl.dayField.value;
        const month: number = formControl.monthField.value;
        const year: number = formControl.yearField.value;

        if (!day || !month || !year) {
            return true; // Do not validate partial dates.
        }

        const nowMoment: Moment = moment(new Date());

        return nowMoment >= formControl.dateValue.add(minimumAge, 'y');
    };
}

function getValidation(minimumAge: number): ControlValidator {
    return {
        validationFunction: validationFunction(minimumAge),
        error: {
            message: `You must be ${minimumAge} or older`,
            groupMessage: `You must be ${minimumAge} or older`
        },
        validationType: ControlValidatorValidationType.Correction
    };
}

export default {
    getValidation
};