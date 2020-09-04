/* https://momentjs.com/docs/#/parsing/string/ */
import moment from 'moment';
import { DB_DATE_FORMAT } from '~/constants';

export const defaultFormat = (dateStr, identifier) => {
    const ide = identifier || '.';
    return moment(dateStr, DB_DATE_FORMAT).format(`YYYY${ide}MM${ide}DD HH:mm:ss`);
};
