import {Directive, forwardRef, Input, OnChanges} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, Validators, ValidatorFn} from '@angular/forms';

export class CustomValidators {

  public static correctArea(supportedAreas: object[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (isPresent(Validators.required(control))) {
        return null;
      }

      let supportedAreaNames = supportedAreas.map(item => item['name']);

      let value: string = control.value;

      return supportedAreaNames.includes(value) ?
        null :
        {correctArea: {valid: false}};
    };

  }
}


function isPresent(obj) {
  return obj !== undefined && obj !== null;
}


const CORRECT_AREA_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CorrectAreaValidator),
  multi: true
};

@Directive({
  selector: '[correctArea][ngControl],[correctArea][ngFormControl],[correctArea][ngModel]',
  providers: [CORRECT_AREA_VALIDATOR]
})
export class CorrectAreaValidator implements Validator, OnChanges {
  private _validator: any;

  @Input('correctArea') supportedAreas: object[];

  ngOnChanges() {
    this._validator = CustomValidators.correctArea(this.supportedAreas);
  }

  public validate(control: AbstractControl): { [key: string]: any } {
    return this._validator(control);
  }
}

export const CUSTOM_VALIDATORS: any[] = [
  CorrectAreaValidator
];
