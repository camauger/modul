import moment from 'moment';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import I18nFilterPlugin from '../../../filters/i18n/i18n';
import { FRENCH, Messages } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import AccordionPlugin from '../../accordion/accordion';
import { ERROR_TECHNICAL_DIFFICULTY_NAME } from '../../component-names';
import I18nPlugin from '../../i18n/i18n';
import MessagePagePlugin, { Link } from '../../message-page/message-page';
import { MMessageState } from '../../message/message';
import PanelPlugin from '../../panel/panel';
import WithRender from './error-technical-difficulty.html?style=./error-technical-difficulty.scss';


@WithRender
@Component
export class MErrorTechnicalDifficulty extends ModulVue {

    @Prop({
        default: () => (Vue.prototype).$i18n.translate('m-error-technical-difficulty:title')
    })
    public title: string;

    @Prop({
        default: () => [
            new Link((Vue.prototype).$i18n.translate('m-error-technical-difficulty:home-label'), '\\')]
    })
    public links: Link[];

    @Prop({
        default: () => [
            (Vue.prototype).$i18n.translate('m-error-technical-difficulty:hint.primary'),
            (Vue.prototype).$i18n.translate('m-error-technical-difficulty:hint.secondary')]
    })
    public hints: string[];

    @Prop({
        default: () => moment()
    })
    public errorDate: moment.Moment;

    /**
     * Reference number must be generated by the parent component
     */
    @Prop()
    public errorReferenceNumber?: string;

    @Prop({
        default: false
    })
    public showStackTrace: boolean;

    /**
     * Javascript Error containing the stack trace to be displayed
     */
    @Prop()
    public error?: Error;

    public state: string = MMessageState.Error;

    public svgName: string = 'm-svg__error-technical-difficulty';

    /**
     * Returns the formatted date for the value received as props (format = YYYY-MM-DD). Used to display the date when the error was generated.
     */
    public get formattedDate(): string {
        return this.errorDate.format('YYYY-MM-DD');
    }

    /**
     * Returns the formatted time for the value received as props (format = HH:mm:ss). Used to display the time when the error was generated.
     */
    public get formattedTime(): string {
        return this.errorDate.format('HH:mm:ss');
    }

    /**
     * Defines if the stack trace is to be displayed based on the showStrackTrace prop and the presence of the attribute stack in the error.
     */
    public get propStacktrace(): boolean {
        return this.showStackTrace && !!this.error;
    }

    /**
     * Returns the current userAgent string.
     */
    public get userAgent(): string {
        return window.navigator.userAgent;
    }

}

const ErrorTechnicalDifficultyPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(I18nPlugin);
        v.use(I18nFilterPlugin);
        v.use(AccordionPlugin);
        v.use(PanelPlugin);
        v.use(MessagePagePlugin);
        v.component(ERROR_TECHNICAL_DIFFICULTY_NAME, MErrorTechnicalDifficulty);
    }
};

export default ErrorTechnicalDifficultyPlugin;
