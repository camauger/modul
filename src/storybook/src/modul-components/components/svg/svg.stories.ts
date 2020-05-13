import { actions } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { SVG_NAME } from '@ulaval/modul-components/dist/components/component-names';
import { modulComponentsHierarchyRootSeparator } from '../../../utils';

export default {
    title: `${modulComponentsHierarchyRootSeparator}${SVG_NAME}`,
    parameters: { fileName: __filename }
};

export const defaultStory = () => ({
    props: {
        name: {
            default: text('Prop name', 'error')
        },
        width: {
            default: text('Prop width', '1em')
        },
        height: {
            default: text('Prop height', '1em')
        },
        svgTitle: {
            default: text('Prop svg-title', 'Inspect the HTML to see title tag inside the SVG.')
        },
        showCustomSvg: {
            default: boolean('Show custom svg', false)
        }
    },
    computed: {
        customSvg(): string {
            const _this: any = this;
            return _this.showCustomSvg ? require('./custom-icon.svg') : '';
        }
    },
    methods: actions('emitClick', 'emitKeydown', 'emitMouseover', 'emitMouseleave'),
    template: `<${SVG_NAME}
        :name="name"
        :svg-title="svgTitle"
        :custom-svg="customSvg"
        @click="emitClick"
        @keydown="emitKeydown"
        @mouseover="emitMouseover"
        @mouseleave="emitMouseleave"
    />`
});

defaultStory.story = {
    name: 'sandbox'
};

export const PropCustomSvg = () => ({
    props: {
        showCustomSvg: {
            default: boolean('Show custom svg', true)
        }
    },
    computed: {
        customSvg(): string {
            const _this: any = this;
            return _this.showCustomSvg ? require('./custom-icon.svg') : '';
        }
    },
    template: `<${SVG_NAME}
        name="warning"
        :custom-svg="customSvg"
        width="5em"
        height="5em"
    />`
});

export const PropWidth = () => ({
    props: {
        width: {
            default: text('Prop width', '50px')
        }
    },
    template: `<${SVG_NAME}
        name="lock"
        :width="width"
        :height="width"
    />`
});

export const PropHeight = () => ({
    props: {
        height: {
            default: text('Prop height', '120px')
        }
    },
    template: `<${SVG_NAME}
        name="profile"
        :width="height"
        :height="height"
    />`
});

export const PropSvgTitle = () => ({
    props: {
        svgTitle: {
            default: text('Prop svg-title', 'Inspect the HTML to see title tag inside the SVG.')
        }
    },
    template: `<${SVG_NAME}
        name="clock"
        :svg-title="svgTitle"
        width="3em"
        height="3em"
    />`
});
