import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { Device } from '@ionic-native/device/ngx';

@Injectable({
  providedIn: 'root'
})
export class WorktempService {

  UUID = '9572a95a-6d7a-4d98-987a-d24d20f78c29';
  TEMP_SERVICE = 'ffe1';
  scanTimer: any = null;
  private subscriber = null;


  constructor(
    private ble: BLE,
    private device: Device
  ) { }

  doScan(time: number = 10000, callBack: Function  = null) {
    this.scanTimer = window.setTimeout(() => {
      this.stopScan();
    }, time);
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
    this.subscriber = this.ble.startScanWithOptions([this.TEMP_SERVICE], { reportDuplicates: false}).subscribe((data) => {
      let temp = 0.0;
      let rh = 0.0;
      // if we are on ios, we need to look inside the data structure
      let buffer = null;
      if (this.device.platform !== 'iOS' ) {
        buffer = new Int8Array(data.advertising, 14, 4);
      } else {
        buffer = new Uint8Array(data.advertising.kCBAdvDataManufacturerData);
      }
      temp = buffer[0];
      temp += Math.abs(buffer[1]) / 100;
      rh = buffer[2];
      rh += Math.abs(buffer[3]) / 100;
      callBack(temp, rh);
    });
  }

  stopScan() {
    if (this.scanTimer) {
      window.clearTimeout(this.scanTimer);
      this.scanTimer = null;
      this.ble.stopScan();
      this.subscriber.unsubscribe();
    }
  }
}
