import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

@Injectable({
  providedIn: 'root'
})
export class WorktempService {

  constructor(
    private ble: BLE
  ) { }

  initialize() {
    const UUID = '9572a95a-6d7a-4d98-987a-d24d20f78c29';

  }
}
