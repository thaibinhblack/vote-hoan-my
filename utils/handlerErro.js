import notify from "devextreme/ui/notify";

export default function CheckError(err, messageCustom) {

    //console.log(err.response.data.internal_error);
    if (err.response && err.response.data) {

        if (err.response.status === 400) {
            let message = err.response.data.internal_error;

            if (message == null) {
                message = err.response.data.message;
            }
            if (message == null) {
                message = err.response.data.error.value
            }

            notify(message, "error");
            return;
        }

        let message = err.response.data.internal_error;
        if (message) {
            notify(message, "error");
            return;
        }
        message = err.response.data.message
        if (message !== null) {
            notify(message, "error")
            return;
        }

        message = err.response.data.error.value

        if (message !== null) {
            notify(message, "error")
            return;
        }

        if (messageCustom) {
            notify(messageCustom, "error");
        }
    }


    if (messageCustom) {
        notify(messageCustom, "error");
    }

    console.log(err);

}
