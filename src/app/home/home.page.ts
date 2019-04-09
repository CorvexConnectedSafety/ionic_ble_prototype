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

  devices: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private worktemp: WorktempService,
    private ble: BLE,
    private ngZone: NgZone
    ) {
    }

    ionViewDidEnter() {
      console.log('ionViewDidEnter');
      this.scan();
    }

    scan() {
      this.setStatus('Scanning for Bluetooth LE Devices');
      this.devices = [];  // clear list

      this.ble.scan([], 5).subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
      );

      setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
    }

    onDeviceDiscovered(device) {
      console.log('Discovered ' + JSON.stringify(device, null, 2));
      this.ngZone.run(() => {
        this.devices.push(device);
      });
    }

    // If location permission is denied, you'll end up here
    scanError(error) {
      this.setStatus('Error ' + error);
      const toast = this.toastCtrl.create({
        message: 'Error scanning for Bluetooth low energy devices',
        position: 'middle',
        duration: 5000
      }).then((res) => {
        console.log('toast is ready');
      });
    }

    setStatus(message) {
      console.log(message);
      this.ngZone.run(() => {
        this.statusMessage = message;
      });
    }

}
