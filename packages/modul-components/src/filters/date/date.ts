// tslint:disable-next-line: import-blacklist
import 'moment/locale/fr';
import { PluginObject } from 'vue';
import { DATE_NAME, DATE_TIME_NAME, PERIOD_NAME, TIME_ELAPSED_NAME } from '../filter-names';
import { dateTimeFilter } from './date-time/date-time';
import { dateFilter } from './date/date';
import { PeriodFilter } from './period/period';
import { TimeElapsedFilter } from './time-elapsed/time-elapsed';
import TimeFilterPlugin from './time/time';

const DateFilterPlugin: PluginObject<any> = {
    install(v): void {
        v.filter(DATE_NAME, dateFilter);
        v.filter(DATE_TIME_NAME, dateTimeFilter);
        v.use(TimeFilterPlugin);
        v.filter(PERIOD_NAME, PeriodFilter.formatPeriod);
        v.filter(TIME_ELAPSED_NAME, TimeElapsedFilter.format);
    }
};

export default DateFilterPlugin;
