import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import * as moment from 'moment';


/**
 * Doku zu ion-alert: https://ionicframework.com/docs/api/alert
 * <br><br>
 * 
 * Unterstütze Input-Felder:
 * * checkbox, radio und textarea
 *   Quelle: https://github.com/ionic-team/ionic-framework/blob/master/core/src/components/alert/alert-interface.ts#L25
 * * Texttypen: date, email, number, password, search, tel, text, url, time, week, month, datetime-local
 *   Quelle: https://github.com/ionic-team/ionic-framework/blob/master/core/src/interface.d.ts#L50
 * 
 * Achtung: Ein Alert kann nicht verschiedene Arten von Input-Feldern enthalten, z.B. RadioButtons und
 * CheckBoxen gleichzeitig sind nicht möglich. 
 * <br><br>
 * 
 * Definition von  Interface AlertInput (wird benötigt, um Eingabe-Elemente auf Dialog zu definieren):
 * 
 * <br><br>
 *
 * Eigenschaft "label" von AlertInput ist anscheinend nur für CheckBox und RadioButton notwendig, siehe
 * https://stackoverflow.com/questions/47388512/ionic-alert-label-not-display
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  /**
   * Konstruktor mit leerem Rumpf wird benötigt, um AlertController-
   * und ToastController-Instanz als Member-Variable zu erhalten
   * (Dependency Injection).
   */
  constructor( private alertController: AlertController,
               private toastController: ToastController
             ) {}


  /**
   * Öffnet Alert (Dialog) mit zwei Texteingabefeldern, die beide ausgefüllt werden müssen.
   */
  async onHalloNameButton() {

    const okButton = {
      text: "Weiter",
      handler: async (inputWerte) => {

        const vorname  = inputWerte.input_vorname;
        const nachname = inputWerte.input_nachname;

        if (vorname === null || vorname.trim().length === 0) {

          this.zeigeToast("Ungültige Eingabe: Kein Vorname eingegeben.");
          return false; // "false", damit Dialog nicht geschlossen wird
        }
        if (nachname === null || nachname.trim().length === 0) {

          this.zeigeToast("Ungültige Eingabe: Kein Nachname eingegeben.");
          return false;
        }

        const gruss = `Hallo ${vorname} ${nachname}!`;

        const weiterButton = { text: "Weiter" };

        const alert = await
            this.alertController.create({ message:gruss,
                                          buttons: [weiterButton]
                                        });
        alert.present();
      }
    };

    const abbrechenButton = {
      text: "Abbrechen",
      role: "Cancel",
      handler: () => {

        this.zeigeToast("Vorgang abgebrochen");
      }
    };

    const alert = await this.alertController.create({
      header: "Hallo Name",
      message: "Bitte geben Sie Ihren Vornamen und auch den Nachnamen ein:",
      buttons: [okButton, abbrechenButton],
      inputs: [ { name: "input_vorname" , type: "text", placeholder: "Vorname"  },
                { name: "input_nachname", type: "text", placeholder: "Nachname" }
              ]
    });

    await alert.present();
  }


  /**
   * Öffnet Alert (Dialog), auf dem mit RadioButtons eine Single-Choice-Frage
   * angezeigt wird.
   */
  async onSingleChoiceButton() {

    const pruefButton = {
      text: "Weiter",
      handler: async (inputWert) => {

        if (inputWert === undefined || inputWert === null) {

          this.zeigeToast("Keine Antwort ausgewählt.");
          return;
        }

        if (inputWert == "hamburg") {

          this.zeigeToast("Richtige Antwort!");

        } else {

          this.zeigeToast("Falsche Antwort!");
        }
      }
    };

    const abbrechenButton = {
      text: "Abbrechen",
      role: "Cancel",
      handler: () => {

        this.zeigeToast("Vorgang abgebrochen");
      }
    };

    const alert = await this.alertController.create({
      header: "Single-Choice-Frage",
      message: "Welche Stadt liegt am weisten nördlich?",
      buttons: [pruefButton, abbrechenButton],
      inputs: [ { name: "stadt_1", type: "radio", label: "Amsterdam", value: "amsterdam" },
                { name: "stadt_2", type: "radio", label: "Hamburg"  , value: "hamburg"   },
                { name: "stadt_3", type: "radio", label: "London"   , value: "london"    },
              ]
    });

    await alert.present();
  }


  /** 
   * Methode zeigt einen Dialog, auf dem mit Checkboxen eine Multiple-Choice-Frage
   * angezeigt wird.
   */ 
  async onMultiChoiceButton() {

    const pruefButton = {
      text: "Weiter",
      handler: async (inputWertArray) => {

        let anzahlAntworten = inputWertArray.length;
        
        if (anzahlAntworten === 0) {

          this.zeigeToast("Keine einzige Antwort ausgewählt.");
          return;
        }

        if (anzahlAntworten !== 2) {

          this.zeigeToast("Antwort ist FALSCH!");
          return;          
        }

        if (inputWertArray.includes("saxophon") &&  inputWertArray.includes("schalmei") ) {

          this.zeigeToast("Antwort ist RICHTIG!");

        } else {

          this.zeigeToast("Antwort ist FALSCH!");
        }
      }
    };

    const abbrechenButton = {
      text: "Abbrechen",
      role: "Cancel",
      handler: () => {

        this.zeigeToast("Vorgang abgebrochen");
      }
    };

    const alert = await this.alertController.create({
      header: "Multiple-Choice-Frage",
      message: "Wählen Sie alle Holzblasinstrumente aus:",
      buttons: [pruefButton, abbrechenButton],
      inputs: [ { name: "cbox_1", type: "checkbox", label: "Cajón"   , value: "cajon"   , checked: false },
                { name: "cbox_2", type: "checkbox", label: "Keytar"  , value: "keytar"  , checked: false },
                { name: "cbox_3", type: "checkbox", label: "Saxophon", value: "saxophon", checked: false },
                { name: "cbox_4", type: "checkbox", label: "Schalmei", value: "schalmei", checked: false },
                { name: "cbox_5", type: "checkbox", label: "Theremin", value: "theremin", checked: false }
              ]
    });

    await alert.present();
  }


  /**
   * Methode erzeugt Dialog zur Eingabe zweiter Datumswerte, für die die Differenz in Tagen berechnet wird.
   * <br><br>
   * 
   * Eigentliche Datumsarithmetik wird mit moment.js gemacht. Die JavaScript-Library verfügt auch über eine
   * TypeScript-Definitions-Datei und kann deshalb in TypeScript-Projekten verwendet werden.
   * Befehl, um sie dem projekt hinzuzufügen: npm install moment.
   */
  async onDatumsBerechnung() {

    const pruefButton = {
      text: "Berechnen",
      handler: async (inputWerte) => {

        let datum1 = inputWerte.datum_1;
        let datum2 = inputWerte.datum_2;

        if (datum1 === null || datum1.trim().length === 0) {

          this.zeigeToast("Keinen Wert für erstes Datum eingegeben.");
          return false;
        }
        if (datum2 === null || datum2.trim().length === 0) {

          this.zeigeToast("Keinen Wert für zweites Datum eingegeben.");
          return false;
        }


        let moment1 = moment(datum1);
        let moment2 = moment(datum2);
    
        let diffTage = moment2.diff( moment1, "days" );

        this.zeigeToast(`Differenz: ${diffTage} Tag(e)`);
      }
    };

    const abbrechenButton = {
      text: "Abbrechen",
      role: "Cancel",
      handler: () => {

        this.zeigeToast("Vorgang abgebrochen");
      }
    };    

    const alert = await this.alertController.create({
      header: "Datumsarithmetik",
      message: "Geben Sie die beiden Datumswerte ein, zwischen denen die Differenz in Tagen berechnet werden soll.",
      buttons: [pruefButton, abbrechenButton],
      inputs: [ { name: "datum_1", type: "date", label: "Datum 1:" },
                { name: "datum_2", type: "date", label: "Datum 2:" }
              ]              
    });

    await alert.present();
  }

  /**
   * Nachricht in einem sog. Toast anzeigen, siehe auch https://ionicframework.com/docs/api/toast
   *
   * @param nachricht  Im Toast anzuzeigende Nachricht.
   */
  async zeigeToast(nachricht: string) {

    const toast =
          await this.toastController.create({ message: nachricht,
                                              duration: 2000
                                            });
    await toast.present();
  }

}
