import * as Dialogs from "@jsplumbtoolkit/dialogs"

export function initialiseDialogs() {
    const dialogs = Dialogs.newInstance({
        dialogs: {
            dlgText: {
                template:'<input type="text" size="50" jtk-focus jtk-att="text" value="${text}" jtk-commit="true"/>',
                title:'Enter Text',
                cancelable:true
            },
            dlgConfirm: {
                template:'${msg}',
                title:'Please Confirm',
                cancelable:true
            },
            dlgMessage: {
                template:'${msg}',
                title:'Message',
                cancelable:false
            }
        }
    })

    const dialogManager = {
        showEdgeLabelDialog: (data, callback, abort) => {
            dialogs.show({
                id: 'dlgText',
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
                id: "dlgConfirm",
                data: {
                    msg: `Delete '${data.text}'?`
                },
                onOK: callback
            });
        },
        editName:(data, callback) => {
            dialogs.show({
                id: "dlgText",
                data: data,
                title: "Edit " + data.type + " name",
                onOK:  callback
            });
        }
    }

    return dialogManager
}


