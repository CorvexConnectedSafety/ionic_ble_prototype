import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { Device } from '@ionic-native/device/ngx';

@Injectable({
  providedIn: 'root'
})
export class WorktempService {

  UUID = '9572A95A-6D7A-4D98-987A-D24D20F78C29';
  TEMP_SERVICE = 'FFE1';

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
      if (data && data.rssi && parseInt(data.rssi, 10) > -60) {
        let temp = 0.0;
        let rh = 0.0;
        let frame = 0;
        // if we are on ios, we need to look inside the data structure
        let buffer = null;
        if (this.device.platform !== 'iOS' ) {
          // buffer = new Int16Array(data.advertising, 14, 2);
          buffer = new Int8Array(data.advertising, 11, 13);
        } else {
          buffer = new Int8Array(data.advertising.kCBAdvDataServiceData[this.TEMP_SERVICE]);
        }
        if (buffer[1] === 1) {
          temp = (buffer[3] * 256 + buffer[4]) / 256;
          temp = (temp * 9 / 5) + 32;
          rh = (buffer[5] * 256 + buffer[6]) / 256;
          frame = buffer[0];
          const hi = this.heatIndex(temp, rh);

          // callBack(temp, rh);
          callBack( { temp: this.precision(temp), rh: this.precision(rh), hi: hi, frame: frame, raw: data.advertising });
        }
      } else {
        console.log('saw device, but it was far away: ' + data.rssi);
      }
    });
  }

  stopScan() {
    if (this.scanTimer) {
      window.clearTimeout(this.scanTimer);
      this.scanTimer = null;
      this.ble.stopScan();
      this.subscriber.unsubscribe();
      this.subscriber = null;
      console.log('stopped scanning');
    }
  }

  heatIndex(temp, hum) {
    let HIADJ;
    // tslint:disable-next-line:max-line-length
    const HI = -42.379 + 2.04901523 * temp + 10.14333127 * hum - .22475541 * temp * hum - .00683783 * temp * temp - .05481717 * hum * hum + .00122874 * temp * temp * hum + .00085282 * temp * hum * hum - .00000199 * temp * temp * hum * hum;

    console.log('Preliminary Heat Index is ' + HI);

    if (hum < 13 && temp > 80 && temp < 112) {
      const x = ((13 - hum) / 4) * (Math.sqrt(17 - Math.abs(temp - 95) / 17));
      HIADJ = HI - x;
      console.log('Subtracted x=' + x + '. New heat index after adjustment is HIADJ= ' + HIADJ);
    } else if (hum > 85 && temp > 80 && temp < 87) {
      const y = ((hum - 85) / 10) * ((87 - temp) / 5);
      HIADJ = HI + y;
      console.log('Added y=' + y + '. New heat index after adjustment is HIADJ=' + HIADJ);
    } else {
      HIADJ = HI;
      console.log('Heat index with no adjustment is ' + HIADJ);
    }
    return this.precision(HIADJ);
  }

  precision(x: any, sig: number = 2) {
    return Number.parseFloat(x).toFixed(sig);
  }
}
