import { AlertButton, useIonAlert } from "@ionic/react";

export const AlertMsg = async (presentAlert: any, header: string, message: string, buttons: string[]) => {

    let result = "";
    let totalButton: AlertButton[] = [];
    for (let i = 0; i < buttons.length; i++) {
        totalButton.push({
            text: buttons[i],
            handler: () => {
                result = buttons[i];
            },
        })
    }
    presentAlert({
        header: header,
        message: message,
        buttons: totalButton,
        mode: "ios",
    });
    while (result === "") {
        await new Promise(r => setTimeout(r, 100));
    }
    console.log("result = " + result);
    return result;
};



