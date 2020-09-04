import palette from '../palette';

export default {
    dialogRoot: {
        '& .MuiPickersToolbar-toolbar ': {
            backgroundColor: palette.basic.etc[2],
            flexFlow: 'column wrap',
            boxSizing: 'border-box',
            padding: '16px 24px',
            textAlign: 'center',
            justifyContent: 'flex-start',
            '& button': {
                height: 30,
                '&:nth-child(1) .MuiPickersToolbarText-toolbarTxt': {
                    fontSize: 16
                },
                '&:nth-child(2) .MuiPickersToolbarText-toolbarTxt': {
                    fontSize: 27
                }
            }
        },
        '& .MuiPickersBasePicker-pickerView': {
            '& .MuiPickersDay-daySelected': {
                backgroundColor: palette.basic.etc[2]
            },
            '& .MuiPickersClock-pin': {
                backgroundColor: palette.basic.etc[2]
            },
            '& .MuiPickersClockPointer-pointer': {
                backgroundColor: palette.basic.etc[2]
            },
            '& .MuiPickersClockPointer-thumb': {
                border: `14px solid ${palette.basic.etc[2]}`
            }
        },
        '& .MuiButton-textPrimary': {
            color: palette.basic.etc[2],
            height: 32,
            fontSize: 13,
            fontWeight: 500,
            '&:hover': {
                backgroundColor: 'inherit'
            }
        },
        '& .MuiDialogActions-root': {
            flexDirection: 'row-reverse',
            justifyContent: 'flex-start'
        }
    }
};
