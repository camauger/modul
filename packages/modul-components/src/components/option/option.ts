import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { ICON_BUTTON_NAME, OPTION_ITEM_ADD_NAME, OPTION_ITEM_ARCHIVE_NAME, OPTION_ITEM_DELETE_NAME, OPTION_ITEM_EDIT_NAME, OPTION_ITEM_NAME, OPTION_NAME, OPTION_SEPARATOR, OPTION_TITLE, POPUP_NAME } from '../component-names';
import { MIconButton, MIconButtonSkin } from '../icon-button/icon-button';
import { MPopperPlacement } from '../popper/popper';
import { MPopup } from '../popup/popup';
import { MOptionItem } from './option-item/option-item';
import { MOptionItemAdd } from './option-item/option-item-add';
import { MOptionItemArchive } from './option-item/option-item-archive';
import { MOptionItemDelete } from './option-item/option-item-delete';
import { MOptionItemEdit } from './option-item/option-item-edit';
import { MOptionSeparator } from './option-separator/option-separator';
import { MOptionTitle } from './option-title/option-title';
import WithRender from './option.html';
import './option.scss';

export abstract class BaseOption extends ModulVue {
}

export interface MOptionInterface {
    hasIcon: boolean;
    hasItemBorder: boolean;
    maxWidth: string;
    checkIcon(el: boolean): void;
    checkBorder(): void;
    close(): void;
}

export enum MOptionsSkin {
    Light = 'over-light',
    Dark = 'over-dark',
    Mixed = 'over-mixed'
}

@WithRender
@Component({
    components: {
        [POPUP_NAME]: MPopup,
        [ICON_BUTTON_NAME]: MIconButton
    },
    mixins: [
        MediaQueries
    ]
})
export class MOption extends BaseOption implements MOptionInterface {
    @Prop({
        default: MPopperPlacement.Bottom,
        validator: value =>
            value === MPopperPlacement.Bottom ||
            value === MPopperPlacement.BottomEnd ||
            value === MPopperPlacement.BottomStart ||
            value === MPopperPlacement.Left ||
            value === MPopperPlacement.LeftEnd ||
            value === MPopperPlacement.LeftStart ||
            value === MPopperPlacement.Right ||
            value === MPopperPlacement.RightEnd ||
            value === MPopperPlacement.RightStart ||
            value === MPopperPlacement.Top ||
            value === MPopperPlacement.TopEnd ||
            value === MPopperPlacement.TopStart
    })
    public placement: MPopperPlacement;
    @Prop({
        default: MOptionsSkin.Light,
        validator: value =>
            value === MOptionsSkin.Light ||
            value === MOptionsSkin.Dark ||
            value === MOptionsSkin.Mixed
    })
    public skin: MOptionsSkin;
    @Prop()
    public openTitle: string;
    @Prop()
    public closeTitle: string;
    @Prop()
    public disabled: boolean;
    @Prop({ default: '44px' })
    public size: string;
    @Prop({ default: false })
    public focusManagement: boolean;
    @Prop({ default: true })
    public scroll: boolean;
    @Prop({ default: '220px' })
    public maxWidth: string;

    public hasIcon: boolean = false;
    public hasItemBorder: boolean = true;
    private open = false;
    private id: string = `mOption-${uuid.generate()}`;

    public checkIcon(icon: boolean): void {
        if (icon) {
            this.hasIcon = true;
        }
    }

    public checkBorder(): void {
        this.$slots.default!.forEach(vNode => {
            if (vNode && vNode.componentOptions && (vNode.componentOptions.tag === OPTION_SEPARATOR || vNode.componentOptions.tag === OPTION_TITLE)) {
                this.hasItemBorder = false;
            }
        });
    }

    public close(): void {
        this.open = false;
        this.onClose();
    }

    public onOpen(): void {
        this.$emit('open');
    }

    public onClose(): void {
        this.$emit('close');
    }

    public onClick($event: MouseEvent): void {
        this.$emit('click', $event);
    }

    private getOpenTitle(): string {
        return this.openTitle === undefined ? this.$i18n.translate('m-option:open') : this.openTitle;
    }

    private getCloseTitle(): string {
        return this.closeTitle === undefined ? this.$i18n.translate('m-option:close') : this.closeTitle;
    }

    public get propTitle(): string {
        return this.open ? this.getCloseTitle() : this.getOpenTitle();
    }

    public get optionMaxWidth(): string {
        return this.as<MediaQueriesMixin>().isMqMinM ? this.maxWidth : 'none';
    }

    public get ariaControls(): string {
        return this.id + '-controls';
    }

    public get menuMaxHeight(): string | undefined {
        return this.scroll ? undefined : 'none';
    }

    public get isSkinMixed(): boolean {
        return this.skin === MOptionsSkin.Mixed;
    }

    public get iconButtonSkin(): string | undefined {
        switch (this.skin) {
            case MOptionsSkin.Light:
                return MIconButtonSkin.Light;
            case MOptionsSkin.Dark:
                return MIconButtonSkin.Dark;
            default:
                throw new Error('skin not supported!');
        }
    }
}

const OptionPlugin: PluginObject<any> = {
    install(v, options): void {

        v.use(MediaQueriesPlugin);
        v.component(OPTION_ITEM_NAME, MOptionItem);
        v.component(OPTION_ITEM_ARCHIVE_NAME, MOptionItemArchive);
        v.component(OPTION_ITEM_ADD_NAME, MOptionItemAdd);
        v.component(OPTION_ITEM_DELETE_NAME, MOptionItemDelete);
        v.component(OPTION_ITEM_EDIT_NAME, MOptionItemEdit);
        v.component(OPTION_TITLE, MOptionTitle);
        v.component(OPTION_SEPARATOR, MOptionSeparator);
        v.component(OPTION_NAME, MOption);

    }
};

export default OptionPlugin;
