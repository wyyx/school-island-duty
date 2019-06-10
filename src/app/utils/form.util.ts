import { FormGroup } from '@angular/forms'

export function markFormGroupAsTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched()

    const childGroup = control as FormGroup
    if (childGroup.controls) {
      markFormGroupAsTouched(childGroup)
    }
  })
}
