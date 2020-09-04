import React from 'react';
import moment from 'moment';
import 'moment/locale/ko';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// moment lib instance locale setting
moment.locale('ko');

// DatePicker, TimePicker Utils setting
class LocalizedUtils extends MomentUtils {
    getDatePickerHeaderText(date) {
        return this.moment(date).format('YYYY년 MMMM DD일');
    }

    getCalendarHeaderText(date) {
        return this.moment(date).format('MMMM');
    }
}

const WmsPickersUtilsProvider = ({ children }) => {
    return (
        <MuiPickersUtilsProvider libInstance={moment} utils={LocalizedUtils}>
            {children}
        </MuiPickersUtilsProvider>
    );
};

export default WmsPickersUtilsProvider;
