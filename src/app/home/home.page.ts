import { Component, NgZone } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { WorktempService } from '../services/worktemp/worktemp.service';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  readings: any[] = [];
  devices: any[] = [];
  statusMessage: string;

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private worktemp: WorktempService,
    private ble: BLE,
    private ngZone: NgZone,
  ) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.worktemp.doScan(10000, (temp, rh) => { this.onTempRead(temp, rh); });
    setTimeout(this.setStatus.bind(this), 10000, 'Scan complete');
  }

  onTempRead(temp, rh) {
    this.readings.push({ temp: temp, rh: rh });
  }
  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    // on iOS, print the manufacturer data if it exists
    if (device.advertising && device.advertising.kCBAdvDataManufacturerData) {
      const mfgData = new Uint8Array(device.advertising.kCBAdvDataManufacturerData);
      console.log('Manufacturer Data is', mfgData);
    }
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
