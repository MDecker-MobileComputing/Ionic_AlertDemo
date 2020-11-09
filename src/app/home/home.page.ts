import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';


/**
 * Definition Interface AlertInput (wird benötigt, um Eingabe-Elemente auf Dialog zu definieren):
 * https://github.com/ionic-team/ionic-framework/blob/master/core/src/components/alert/alert-interface.ts#L25
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
   * Öffnet Alertdialog mit zwei Texteingabefeldern, die beide ausgefüllt werden müssen.
   */
  async onHalloNameButton() {

    const okButton = {
      text: "Weiter",
      handler: async (inputWerte) => {

        const vorname  = inputWerte.vorname;
        const nachname = inputWerte.nachname;

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
      inputs: [ { name: "vorname" , type: "text", placeholder: "Vorname" },
                { name: "nachname", type: "text", placeholder: "Nachname" }
              ]
    });

    await alert.present();
  }

  async onSingleChoiceButton() {

  }

  async onMultiChoiceButton() {

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
