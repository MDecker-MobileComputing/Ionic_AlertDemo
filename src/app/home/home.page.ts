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
 * <br><br>
 *
 * Achtung: Ein Alert kann nicht verschiedene Arten von Input-Feldern enthalten, z.B. RadioButtons und
 * CheckBoxen gleichzeitig sind nicht möglich.
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
      handler: (inputWerte) => {

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

        this.zeigeDialog(gruss);
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
      backdropDismiss: false,
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
      handler: (inputWert) => {

        if (inputWert === undefined || inputWert === null) {

          this.zeigeToast("Keine Antwort ausgewählt.");
          return false;
        }

        if (inputWert === "hamburg") {

          this.zeigeDialog("Richtige Antwort!");

        } else {

          this.zeigeDialog("Falsche Antwort!");
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
      backdropDismiss: false,
      inputs: [ { name: "stadt_1", type: "radio", label: "Amsterdam", value: "amsterdam" },
                { name: "stadt_2", type: "radio", label: "Hamburg"  , value: "hamburg"   },
                { name: "stadt_3", type: "radio", label: "London"   , value: "london"    }
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
      handler: (inputWertArray) => {

        let anzahlAntworten = inputWertArray.length;

        if (anzahlAntworten === 0) {

          this.zeigeToast("Keine einzige Antwort ausgewählt.");
          return false;
        }

        if (anzahlAntworten !== 2) {

          this.zeigeToast("Antwort ist FALSCH!");
        }

        if (inputWertArray.includes("saxophon") &&  inputWertArray.includes("schalmei") ) {

          this.zeigeDialog("Antwort ist RICHTIG!");

        } else {

          this.zeigeDialog("Antwort ist FALSCH!");
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
      backdropDismiss: false,
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
   * Zwei Dialoge mit RadioButton-Elementen hintereinander.
   */
  async zweiFragenHintereinander() {

    let antwort1richtig = false;
    let antwort2richtig = false;

    let abgebrochen = false;

    const pruefButton1 = {
      text: "Weiter",
      handler: (inputWert) => {

        if (inputWert === undefined || inputWert === null) {

          this.zeigeToast("Keine Antwort ausgewählt.");
          return false;
        }

        if (inputWert == "canberra") {

          antwort1richtig = true;
        }
      }
    };

    const pruefButton2 = {
      text: "Weiter",
      handler: (inputWert) => {

        if (inputWert === undefined || inputWert === null) {

          this.zeigeToast("Keine Antwort ausgewählt.");
          return false;
        }

        if (inputWert == "ottawa") {

          antwort2richtig = true;
        }
      }
    };

    const abbrechenButton = {
      text: "Abbrechen",
      role: "Cancel",
      handler: () => {

        abgebrochen = true;
        this.zeigeToast("Vorgang abgebrochen");
      }
    };

    const alert1 = await this.alertController.create({
      header: "Single-Choice-Frage 1",
      message: "Welches ist die Hauptstadt von Australien?",
      buttons: [pruefButton1, abbrechenButton],
      backdropDismiss: false,
      inputs: [ { name: "australien_1", type: "radio", label: "Canberra" , value: "canberra"  },
                { name: "australien_2", type: "radio", label: "Melbourne", value: "melbourne" },
                { name: "australien_3", type: "radio", label: "Sydney"   , value: "sydney"    }
              ]
    });

    await alert1.present();
    await alert1.onDidDismiss();

    if (abgebrochen) { return; }

    const alert2 = await this.alertController.create({
      header: "Single-Choice-Frage 2",
      message: "Welches ist die Hauptstadt von Kanada?",
      buttons: [pruefButton2, abbrechenButton],
      inputs: [ { name: "kanada_1", type: "radio", label: "Montreal" , value: "montreal"  },
                { name: "kanada_1", type: "radio", label: "Ottawa"   , value: "ottawa"    },
                { name: "kanada_1", type: "radio", label: "Vancouver", value: "vancouver" }
              ]
    });

    await alert2.present();
    await alert2.onDidDismiss();

    if (abgebrochen) { return; }

    let anzahlRichtig = 0;
    if (antwort1richtig) { anzahlRichtig++; }
    if (antwort2richtig) { anzahlRichtig++; }

    this.zeigeDialog(`${anzahlRichtig} von 2 Fragen richtig beantwortet.`);
  }


  /**
   * Methode erzeugt Dialog zur Eingabe zweiter Datumswerte, für die die Differenz in Tagen berechnet wird.
   * <br><br>
   *
   * Eigentliche Datumsarithmetik wird mit moment.js gemacht. Die JavaScript-Library verfügt auch über eine
   * TypeScript-Definitions-Datei und kann deshalb in TypeScript-Projekten verwendet werden.
   * Befehl, um sie dem projekt hinzuzufügen: `npm install moment`.
   */
  async onDatumsBerechnung() {

    const berechnenButton = {
      text: "Berechnen",
      handler: (inputWerte) => {

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

        this.zeigeDialog(`Differenz: ${diffTage} Tag(e)`);
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
      buttons: [berechnenButton, abbrechenButton],
      backdropDismiss: false,
      inputs: [ { name: "datum_1", type: "date", label: "Datum 1:" },
                { name: "datum_2", type: "date", label: "Datum 2:" }
              ]
    });

    await alert.present();
  }


  /**
   * Öffnet Dialog zur Eingabe einer Länge in Zoll/Inch, die dann in cm umgerechnet wird.
   * In Chrome-basierten Browsern könnnen in das Eingabefeld nur Zahlenwerte und keine Buchstaben
   * eingegeben werden.
   */
  async onZollNachCentimeter() {

    const umrechnenButton = {
      text: "Umrechnen",
      handler: (inputWerte) => {

        let zollStr = inputWerte.input_zoll; // ist leerer String wenn in Firefox Buchstaben eingegeben werden

        if (zollStr === null || zollStr === undefined || zollStr.trim().length === 0) {

          this.zeigeToast("Kein Zoll-Wert eingegeben.");
          return false;
        }

        let zollNumber = parseFloat(zollStr);

        let cm = zollNumber * 2.54;

        let ergebnis = `${zollNumber} Zoll entsprechen ${cm} cm.`;
        this.zeigeDialog(ergebnis);
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
      header: "Zoll in cm umrechnen",
      message: "Geben Sie die Länge in Zoll (Inch) ein.",
      buttons: [umrechnenButton, abbrechenButton],
      backdropDismiss: false,
      inputs: [ { name: "input_zoll" , type: "number", placeholder: "Zoll/Inch" } ]
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
          await this.toastController.create({
            message: nachricht,
            duration: 2000
          });
    await toast.present();
  }


  /**
   * Nachricht in Dialog anzeigen.
   *
   * @param nachricht  Im Dialog anzuzeigende Nachricht.
   */
  async zeigeDialog(nachricht: string) {

    const alert =
          await this.alertController.create({
            header  : "Ergebnis",
            message : nachricht,
            buttons : [ "Ok" ],
            backdropDismiss: false,
          });

    await alert.present();
  }

}
