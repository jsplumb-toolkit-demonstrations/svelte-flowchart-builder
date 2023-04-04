import { Dialogs } from "@jsplumbtoolkit/browser-ui"

const DIALOG_TEXT = "dlgText"
const DIALOG_CONFIRM = "dlgConfirm"
const DIALOG_MESSAGE = "dlgMessage"

export function initialiseDialogs() {
    const dialogs = new Dialogs({
        dialogs: {
            [DIALOG_TEXT]: {
                template:'<input type="text" size="50" jtk-focus jtk-att="text" value="{{text}}" jtk-commit="true"/>',
                title:'Enter Text',
                cancelable:true
            },
            [DIALOG_CONFIRM]: {
                template:'{{msg}}',
                title:'Please Confirm',
                cancelable:true
            },
            [DIALOG_MESSAGE]: {
                template:'{{msg}}',
                title:'Message',
                cancelable:false
            }
        }
    })

    const dialogManager = {
        showEdgeLabelDialog: (data, callback, abort) => {
            dialogs.show({
                id: DIALOG_TEXT,
                data: {
                    text: data.label || ''
                },
                onOK: (d) => {
                    callback({label: d.text || ''})
                },
                onCancel: abort
            })
        },
        confirmDelete:(data, callback) => {
            dialogs.show({
                id: DIALOG_CONFIRM,
                data: {
                    msg: `Delete '${data.text}'?`
                },
                onOK: callback
            });
        },
        editName:(data, callback) => {
            dialogs.show({
                id: DIALOG_TEXT,
                data: data,
                title: `Edit ${data.type} name`,
                onOK:  callback
            });
        }
    }

    return dialogManager
}


