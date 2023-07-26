import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-verification-form',
  templateUrl: './verification-form.component.html',
  styleUrls: ['./verification-form.component.scss']
})
export class VerificationFormComponent implements OnInit {
  verificationForm!: FormGroup;
  otpSent = false;
  otpResendDisabled = false;
  resendCount = 0;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.verificationForm = this.formBuilder.group({
      city: ['', Validators.required],
      panNumber: ['', [Validators.required, Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/), Validators.maxLength(10)]],
      fullname: ['', [Validators.required, Validators.maxLength(140)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]],
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

  onSubmit() {
    if (this.verificationForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    if (this.otpSent) {
      // Call the API to verify OTP
      this.apiService.verifyOTP(this.verificationForm.value).subscribe({
        next: (response) => {
          alert('Thank you for verification ' + this.verificationForm.get('fullname')!.value);
        },
        error: (error) => {
          alert('Failed to verify OTP. Please try again.');
        }
      });
    } else {
      alert('Please click "Send OTP" to receive the OTP on your mobile number.');
    }
  }

  onSendOTP() {
    const mobileControl = this.verificationForm.get('mobile');
    if (mobileControl && mobileControl.invalid) {
      mobileControl.markAsTouched();
      return;
    }

    // Make sure not to call multiple 'getOTP' API simultaneously on change of mobile number field.
    if (!this.otpSent && mobileControl) {
      this.apiService.sendOTP({ mobile: mobileControl.value }).subscribe({
        next: () => {
          this.otpSent = true;
          this.otpResendDisabled = true;
          this.startOtpResendTimer();
          alert('OTP has been sent to your mobile number.');
        },
        error: (error) => {
          alert('Failed to send OTP. Please try again.');
        }
      });
    }
  }

  onResendOTP() {
    const mobileControl = this.verificationForm.get('mobile');
    if (mobileControl && mobileControl.invalid) {
      mobileControl.markAsTouched();
      return;
    }

    // Users can click the 'Resend OTP' link only 3 times.
    if (this.resendCount < 3) {
      this.apiService.resendOTP({ mobile: mobileControl!.value }).subscribe({
        next: () => {
          this.otpResendDisabled = true;
          this.startOtpResendTimer();
          this.resendCount++;
          alert('OTP has been resent to your mobile number.');
        },
        error: (error) => {
          alert('Failed to resend OTP. Please try again.');
        }
      });
    } else {
      alert('Please try again after an hour.');
    }
  }

  startOtpResendTimer() {
    setTimeout(() => {
      this.otpResendDisabled = false;
    }, 180000); // 3 minutes in milliseconds
  }

  markAllFieldsAsTouched() {
    for (const control in this.verificationForm.controls) {
      if (this.verificationForm.controls.hasOwnProperty(control)) {
        this.verificationForm.controls[control].markAsTouched();
      }
    }
  }

  isFieldTouchedAndInvalid(field: string, errorType?: string): boolean {
    const control = this.verificationForm.get(field);
    return !!control?.touched && (errorType ? control?.hasError(errorType) : !!control?.invalid);
  }

}
