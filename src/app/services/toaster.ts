import { inject, Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class Toaster {
  private toast = inject(HotToastService);

  success(message: string) {
    this.toast.success(message);
  }

  error(message: string) {
    this.toast.error(message);
  }

  info(message: string) {
    this.toast.info(message);
  }
}