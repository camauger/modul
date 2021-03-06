import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { MOpenTrigger, OpenTrigger, OpenTriggerMixin } from '../../mixins/open-trigger/open-trigger';
import { ModulVue } from '../../utils/vue/vue';
import { POPPER_NAME, POPUP_NAME, SIDEBAR_NAME } from '../component-names';
import { MPopper, MPopperPlacement } from '../popper/popper';
import { MSidebar } from '../sidebar/sidebar';
import WithRender from './popup.html?style=./popup.scss';


@WithRender
@Component({
    components: {
        [POPPER_NAME]: MPopper,
        [SIDEBAR_NAME]: MSidebar
    },
    mixins: [MediaQueries, OpenTrigger]
})
export class MPopup extends ModulVue {

    @Prop()
    public open: boolean;
    @Prop({ default: MPopperPlacement.Bottom })
    public placement: MPopperPlacement;
    @Prop({ default: MOpenTrigger.Click })
    public openTrigger: MOpenTrigger;
    @Prop()
    public closeOnBackdrop: boolean;
    @Prop({ default: true })
    public focusManagement: boolean;
    @Prop({ default: 'auto' })
    public width: string;
    @Prop()
    public id: string;
    @Prop()
    public disabled: boolean;
    @Prop()
    public shadow: boolean;
    @Prop({ default: true })
    public padding: boolean;
    @Prop({ default: true })
    public paddingHeader: boolean;
    @Prop({ default: true })
    public paddingBody: boolean;
    @Prop({ default: true })
    public paddingFooter: boolean;
    @Prop({ default: true })
    public background: boolean;
    @Prop()
    public beforeEnter: any;
    @Prop()
    public enter: any;
    @Prop()
    public afterEnter: any;
    @Prop()
    public enterCancelled: any;
    @Prop()
    public beforeLeave: any;
    @Prop()
    public leave: any;
    @Prop()
    public afterLeave: any;
    @Prop()
    public leaveCancelled: any;
    @Prop()
    public desktopOnly: boolean;
    @Prop()
    public className: string;
    @Prop()
    public preload: boolean;
    @Prop()
    public trigger: HTMLElement;
    @Prop({ default: true })
    public lazy: boolean;
    @Prop()
    public sidebarFullHeight: boolean;

    public $refs: {
        popper: MPopper;
    };

    private internalOpen: boolean = false;

    @Emit('open')
    public onOpen(): void { }

    @Emit('close')
    public onClose(): void { }

    @Emit('portal-mounted')
    public onPortalMounted(): void { }

    @Emit('portal-after-open')
    public onPortalAfterOpen(): void { }

    public get popupBody(): Element {
        return (this.$children[0] as any).popupBody;
    }

    public get propOpenTrigger(): MOpenTrigger {
        return this.openTrigger; // todo: mobile + hover ??
    }

    public get propTrigger(): HTMLElement {
        return this.trigger || this.as<OpenTriggerMixin>().triggerHook || undefined;
    }

    public get hasTriggerSlot(): boolean {
        return !!this.$slots.trigger;
    }

    public onSideBarOpen(value: boolean): void {

        if (!this.disabled && this.isSidebarUsed) {
            this.internalOpen = value;
            this.$emit('update:open', value);
        }
    }

    public onPopperOpen(value: boolean): void {
        if (!this.disabled && !this.isSidebarUsed) {
            this.internalOpen = value;
            this.$emit('update:open', value);
        }
    }

    public get sideBarOpen(): boolean {
        if (this.isSidebarUsed) {
            return this.open === undefined ? this.internalOpen : this.open;
        } else {
            return false;
        }

    }

    public get popperOpen(): boolean {

        if (!this.isSidebarUsed) {
            return (this.open === undefined ? this.internalOpen : this.open);
        } else {
            return false;
        }

    }

    public update(): void {
        if (!this.isSidebarUsed) { // Pas de popper en mobile
            this.$refs.popper.update();
        }
    }


    public get isSidebarUsed(): boolean {
        // Use a sidebar instead when in mobile
        return this.as<MediaQueries>().isMqMaxS;
    }

}

const PopupPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(POPUP_NAME, MPopup);
    }
};

export default PopupPlugin;
