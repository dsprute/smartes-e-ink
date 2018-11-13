import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavController, ActionSheetController, AlertController} from 'ionic-angular';
import {BLE} from '@ionic-native/ble';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ BLE ]
})

export class HomePage implements OnInit {
  devices: Array<any>;

  lines: string[];

  newLine = {
    line: 0,
    text: ''
  }

  @ViewChild('canvas') canvasEl: ElementRef;
  private _CANVAS: any;
  private _CONTEXT: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public  ble: BLE) {
  }

  ngOnInit(): void {
    this.devices = new Array<any>(0);
    //this.getDevices();
    //this.onDeviceDiscovered("test");
    this.ble.scan([],2).subscribe(
      device => this.onDeviceDiscovered(device),
        error => this.showBluetoothError()
    );
    this.ionViewDidLoad();
    this.initLines();
  }

  onDeviceDiscovered(device){
    this.devices.push(device);
    console.log(device);
  }

  initLines() {
    this.lines = Array(5);
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i] = "";
    }
  }

  doRefresh(refresher) {
    this.ble.scan([],2).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.showBluetoothError()
    );
    setTimeout(() => {
      refresher.complete();
      //this.ble.stopScan();
    }, 2000);
  }

  showBluetoothError() {
    let alert = this.alertCtrl.create({
      title: 'Fehler beim Scannen',
      subTitle: 'Beim Scannen ist ein Fehler aufgetreten!',
      buttons: ['Ok.']
    });
    alert.present();
  }

  showConnectError() {
    let alert = this.alertCtrl.create({
      title: 'Fehler bei der Verbindung',
      subTitle: 'Es konnte sich nicht mit dem Gerät verbunden werden!',
      buttons: ['Ok.']
    });
    alert.present();
  }

  showDisconnectError() {
    let alert = this.alertCtrl.create({
      title: 'Fehler beim Trennen',
      subTitle: 'Es konnte sich nicht vom Gerät getrennt werden!',
      buttons: ['Ok.']
    });
    alert.present();
  }

  showNoConnectionError() {
    let alert = this.alertCtrl.create({
      title: 'Keine Verbindung',
      subTitle: 'Verbinde dich erst mit einem Gerät, um Daten zu übertragen!',
      buttons: ['Ok.']
    });
    alert.present();
  }

  uploadData() {
    this.showNoConnectionError();
  }

  connect() {
    this.showConnectError();
  }

  disconnect() {
    this.showDisconnectError();
  }

  showConnectDeviceDialog(s: string) {
    let actionSheet = this.actionSheetCtrl.create({
      title: s,
      buttons: [
        {
          text: 'Verbinden',
          handler: () => {
            this.connect();
          }
        },
        {
          text: 'Trennen',
          handler: () => {
            this.disconnect();
          }

        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });

    actionSheet.present();
  }

  async getDevices() {
    const x = Math.floor(Math.random() * 6) + 1;
    this.devices = new Array(x);
    for (let i = 0; i < x; i++) {
      this.devices[i] = 'Display' + i;
    }
  }

  ionViewDidLoad() {
    this._CANVAS = this.canvasEl.nativeElement;
    this._CANVAS.width = 500;
    this._CANVAS.height = 500;

    this.initialiseCanvas();
  }

  initialiseCanvas() {
    if (this._CANVAS.getContext) {
      this.setupCanvas();
    }
  }

  setupCanvas() {
    this._CONTEXT = this._CANVAS.getContext('2d');
    this._CONTEXT.fillStyle = '#3e3e3e';
    this._CONTEXT.fillRect(0, 0, 500, 500);
  }

  clearCanvas() {
    this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
    this.setupCanvas();
  }

  addLine() {
    if (this.newLine.line < this.lines.length) {
      this.lines[this.newLine.line - 1] = this.newLine.text;
    }
    this.drawText();
  }

  drawText() {
    this.clearCanvas();
    this._CONTEXT.fillStyle = '#ffffff';
    this._CONTEXT.font = '30px Arial';

    for (let i = 0; i < this.lines.length; i++) {
      this._CONTEXT.fillText(this.lines[i], 10, 50 + (35 * i));
    }
  }




}



