import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { I18N_NAME } from '../../../filters/filter-names';
import { i18nFilter } from '../../../filters/i18n/i18n';
import uuid from '../../../utils/uuid/uuid';
import { ICON_NAME } from '../../component-names';
import { MIcon } from '../../icon/icon';
import WithRender from './chip-delete.html?style=./chip-delete.scss';

enum MChipSize {
    Small = 'small',
    Large = 'large'
}

@WithRender
@Component({
    components: {
        [ICON_NAME]: MIcon
    },
    filters: {
        [I18N_NAME]: i18nFilter
    }
})
export default class MChipDelete extends Vue {
    @Prop()
    disabled: boolean;

    @Prop({
        default: MChipSize.Large,
        validator: value =>
            value === MChipSize.Large ||
            value === MChipSize.Small
    })
    size: MChipSize;

    @Emit('click')
    public emitClick(): void { }

    @Emit('delete')
    public emitDelete(): void { }

    public textId: string = `mChipDeleteText-${uuid.generate()}`;
    public iconHover: boolean = false;

    public get iconSize(): string {
        return this.size === MChipSize.Small ? '8px' : '14px';
    }

    public onClick(event: Event): void {
        if (this.disabled) {
            return;
        }
        this.emitClick();
        this.emitDelete();
    }

    public onMouseOver(event: Event): void {
        this.iconHover = true;
    }

    public onMouseLeave(event: Event): void {
        this.iconHover = false;
    }
}
