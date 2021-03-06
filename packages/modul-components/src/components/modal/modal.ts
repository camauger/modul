import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { BackdropMode, Portal, PortalMixin, PortalMixinImpl, PortalTransitionDuration } from '../../mixins/portal/portal';
import UserAgentUtil from '../../utils/user-agent/user-agent';
import { ModulVue } from '../../utils/vue/vue';
import { ICON_BUTTON_NAME, MODAL_NAME } from '../component-names';
import { MIconButton } from '../icon-button/icon-button';
import WithRender from './modal.html';
import './modal.scss';

export enum MModalSize {
    FullScreen = 'full-screen',
    Large = 'large',
    Regular = 'regular',
    Small = 'small'
}

@WithRender
@Component({
    components: {
        [ICON_BUTTON_NAME]: MIconButton
    },
    mixins: [Portal]
})
export class MModal extends ModulVue implements PortalMixinImpl {
    @Prop({
        default: MModalSize.Regular,
        validator: value =>
            value === MModalSize.Regular ||
            value === MModalSize.FullScreen ||
            value === MModalSize.Large ||
            value === MModalSize.Small
    })
    public size: MModalSize;

    @Prop({ default: true })
    public closeOnBackdrop: boolean;

    @Prop({ default: true })
    public focusManagement: boolean;

    @Prop()
    public title: string;

    @Prop({ default: true })
    public bodyMaxWidth: boolean;

    /** @deprecated will be removed in v2, please use css variables to customize visuals. */
    @Prop({ default: true })
    public paddingBody: boolean;

    public hasKeyboard: boolean = false;

    $refs: {
        body: HTMLElement;
        modalWrap: HTMLElement;
        article: HTMLElement;
    };

    private closeTitle: string = this.$i18n.translate('m-modal:close');

    public closeModal(): void {
        this.as<PortalMixin>().tryClose();
    }

    public handlesFocus(): boolean {
        return this.focusManagement;
    }

    public doCustomPropOpen(value: boolean): boolean {
        return false;
    }

    public getBackdropMode(): BackdropMode {
        return this.sizeFullSceen
            ? BackdropMode.ScrollOnly
            : BackdropMode.BackdropFast;
    }

    public get sizeFullSceen(): boolean {
        let fullScreen: boolean = !this.as<MediaQueriesMixin>().isMqMinS
            ? true
            : this.size === MModalSize.FullScreen
                ? true
                : false;
        this.as<Portal>().transitionDuration = fullScreen
            ? PortalTransitionDuration.XSlow
            : PortalTransitionDuration.Regular;
        return fullScreen;
    }

    public get sizeLarge(): boolean {
        return (
            this.as<MediaQueriesMixin>().isMqMinS && this.size === MModalSize.Large
        );
    }

    public get sizeSmall(): boolean {
        return (
            this.as<MediaQueriesMixin>().isMqMinS && this.size === MModalSize.Small
        );
    }

    public getPortalElement(): HTMLElement {
        return this.$refs.article;
    }

    protected mounted(): void {
        if (!this.title && !Boolean(this.$slots.header)) {
            this.$log.warn('<m-modal> needs a header slot or title prop.');
        }
    }

    private backdropClick(): void {
        if (this.closeOnBackdrop) {
            this.as<PortalMixin>().tryClose();
        }
    }

    private get isAndroid(): boolean {
        return UserAgentUtil.isAndroid();
    }

    private onFocusIn(): void {
        if (this.isAndroid) {
            this.hasKeyboard = true;
        }
    }

    private onFocusOut(): void {
        if (!this.isAndroid) {
            return;
        }

        setTimeout(() => {
            this.hasKeyboard = false;
        });
    }
}

const ModalPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(MODAL_NAME, MModal);
    }
};

export default ModalPlugin;
