import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop } from 'vue-property-decorator';
import { I18N_NAME as I18N_FILTER_NAME } from '../../filters/filter-names';
import { i18nFilter } from '../../filters/i18n/i18n';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { I18N_NAME, ICON_BUTTON_NAME, ICON_NAME, LINK_NAME, PAGINATION_NAME } from '../component-names';
import { MI18n } from '../i18n/i18n';
import { MIconButton } from '../icon-button/icon-button';
import { MIcon } from '../icon/icon';
import { MLink } from '../link/link';
import WithRender from './pagination.html?style=./pagination.scss';


const FIRST_PAGE: number = 1;
const DELTA_DESKTOP: number = 4;
const DELTA_MOBILE: number = 1;

interface PaginationItem {
    label: string;
    clickable: boolean;
    ellipsis?: boolean;
}

@WithRender
@Component({
    components: {
        [ICON_NAME]: MIcon,
        [LINK_NAME]: MLink,
        [ICON_BUTTON_NAME]: MIconButton,
        [I18N_NAME]: MI18n
    },
    filters: {
        [I18N_FILTER_NAME]: i18nFilter
    },
    mixins: [MediaQueries]
})
export class MPagination extends ModulVue {
    @Model('change')
    @Prop({ default: FIRST_PAGE })
    public value: number;

    @Prop({ required: true })
    public itemsTotal: number;

    @Prop({ default: 20 })
    public itemsPerPage: number;

    @Prop({ default: false })
    loading: boolean;

    @Emit('change')
    goToPage(value: number): void { }

    public get pagesTotal(): number {
        return Math.ceil(this.itemsTotal / this.itemsPerPage);
    }

    public get paginationItems(): PaginationItem[] {
        let items: PaginationItem[] = [];
        let delta: number = this.as<MediaQueriesMixin>().isMqMinS ? DELTA_DESKTOP : DELTA_MOBILE;
        let minDelta: number;
        let maxDelta: number;

        if (this.value <= FIRST_PAGE + delta) {
            let adjustDelta: number = (delta * 2) - (this.value - (FIRST_PAGE + 1));
            minDelta = FIRST_PAGE + 1;
            maxDelta = this.value + adjustDelta > this.pagesTotal - 1 ? this.pagesTotal - 1 : this.value + adjustDelta;
        } else if (this.value >= this.pagesTotal - delta) {
            let adjustDelta: number = (delta * 2) - ((this.pagesTotal - 1) - this.value);
            minDelta = this.value - adjustDelta < FIRST_PAGE + 1 ? FIRST_PAGE + 1 : this.value - adjustDelta;
            maxDelta = this.pagesTotal - 1;
        } else {
            minDelta = this.value - delta < FIRST_PAGE + 1 ? FIRST_PAGE + 1 : this.value - delta;
            maxDelta = this.value + delta > this.pagesTotal - 1 ? this.pagesTotal - 1 : this.value + delta;
        }

        items.push({ label: FIRST_PAGE.toString(), clickable: this.isPageActive(FIRST_PAGE) ? false : true });

        if (minDelta !== FIRST_PAGE + 1) {
            items.push({ label: this.$i18n.translate('m-pagination:ellipsis'), clickable: false, ellipsis: true });
        }

        for (let i: number = minDelta; i <= maxDelta; i++) {
            items.push({ label: i.toString(), clickable: this.isPageActive(i) ? false : true });
        }

        if (maxDelta !== this.pagesTotal - 1) {
            items.push({ label: this.$i18n.translate('m-pagination:ellipsis'), clickable: false, ellipsis: true });
        }

        items.push({ label: this.pagesTotal.toString(), clickable: this.isPageActive(this.pagesTotal) ? false : true });

        return items;
    }

    public get firstPageSelected(): boolean {
        return this.value === 1;
    }

    public get lastPageSelected(): boolean {
        return this.value === this.pagesTotal;
    }

    public pageFirstItemIndex(): number {
        return ((this.value - 1) * this.itemsPerPage) + 1;
    }

    public pageLastItemIndex(): number {
        return Math.min(this.value * this.itemsPerPage, this.itemsTotal);
    }

    public get status(): string {
        const key: string = this.itemsTotal <= this.itemsPerPage ?
            'm-pagination:status-single' : 'm-pagination:status';

        return this.$i18n.translate(key, {
            idxFirst: this.pageFirstItemIndex,
            idxLast: this.pageLastItemIndex,
            nbResults: this.itemsTotal
        }, this.itemsTotal, undefined, undefined, FormatMode.Sprintf);
    }

    public isPageActive(page: number): boolean {
        return page === this.value;
    }
}

const PaginationPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(PAGINATION_NAME, MPagination);
    }
};

export default PaginationPlugin;
