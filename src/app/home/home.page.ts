import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { WorktempService } from '../services/worktemp/worktemp.service';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  reading: any;
  statusMessage: string;

  SCAN_TIME = 2000;
  PAUSE_TIME = 2000;

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
    this.setStatus('Checking for updates');

    this.worktemp.doScan(this.SCAN_TIME, (data) => { this.onTempRead(data); });
    setTimeout(() => {
      this.setStatus('Paused between scans');
      setTimeout(() => { this.scan(); }, this.PAUSE_TIME);
    }, this.SCAN_TIME);
  }

  onTempRead(data) {
    this.ngZone.run(() => {
      this.reading = data;
    });
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
