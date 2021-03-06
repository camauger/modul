import { storiesOf } from '@storybook/vue';
import { OPTION_NAME } from '@ulaval/modul-components/dist/components/component-names';
import { modulComponentsHierarchyRootSeparator } from '../../../utils';


storiesOf(`${modulComponentsHierarchyRootSeparator}${OPTION_NAME}`, module)

    .add('default', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-item-add></m-option-item-add>
                       <m-option-item-edit></m-option-item-edit>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete :disabled="true"></m-option-item-delete>
                   </m-option>
                   `
    }))
    .add('option-separator', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-item-add></m-option-item-add>
                       <m-option-separator></m-option-separator>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete></m-option-item-delete>
                   </m-option>`
    }))
    .add('option-title', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-title>Title 1</m-option-title>
                       <m-option-item-add></m-option-item-add>
                       <m-option-title>Title 2</m-option-title>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete></m-option-item-delete>
                   </m-option>`
    }))
    .add('option-title & separator', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-title>Title 1</m-option-title>
                       <m-option-item-add></m-option-item-add>
                       <m-option-separator></m-option-separator>
                       <m-option-title>Title 2</m-option-title>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete></m-option-item-delete>
                   </m-option>`
    }))
    .add('scroll', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option :scroll="false">
                       <m-option-title>Title 1</m-option-title>
                       <m-option-item-add></m-option-item-add>
                       <m-option-separator></m-option-separator>
                       <m-option-title>Title 2</m-option-title>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete></m-option-item-delete>
                   </m-option>`
    }))
    .add('max-width', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option max-width="333px">
                       <m-option-item>Very very very wide custom option menu</m-option-item>
                       <m-option-item>Custom option menu</m-option-item>
                   </m-option>`
    }));

storiesOf(`${modulComponentsHierarchyRootSeparator}${OPTION_NAME}/skin`, module)

    .add('skin="over-light" (default)', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option>
                       <m-option-item-add></m-option-item-add>
                       <m-option-item-edit></m-option-item-edit>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete :disabled="true"></m-option-item-delete>
                   </m-option>
                   `
    }))
    .add('skin="over-dark"', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<div style="position:relative;background-color:black;">
                    <m-option skin="over-dark">
                       <m-option-item-add></m-option-item-add>
                       <m-option-item-edit></m-option-item-edit>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete :disabled="true"></m-option-item-delete>
                   </m-option>
                   </div>
                   `
    }))
    .add('skin="over-mixed"', () => ({
        data: () => ({
            model1: '',
            img: 'https://picsum.photos/id/1025/400/300'
        }),
        template: `<div style="position:relative;">
                        <m-option style="position:relative; z-index:2;" skin="over-mixed">
                            <m-option-item-add></m-option-item-add>
                            <m-option-item-edit></m-option-item-edit>
                            <m-option-item-archive></m-option-item-archive>
                            <m-option-item-delete :disabled="true"></m-option-item-delete>
                        </m-option>
                        <img style="position:absolute; left:0;" :src="img" alt="exemple"/>
                   </div>
                   `
    }));

storiesOf(`${modulComponentsHierarchyRootSeparator}${OPTION_NAME}/disabled`, module)

    .add('skin="over-light"', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option disabled="true">
                       <m-option-item-add></m-option-item-add>
                       <m-option-item-edit></m-option-item-edit>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete :disabled="true"></m-option-item-delete>
                   </m-option>
                   `
    }))
    .add('skin="over-dark"', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option skin="over-dark" disabled="true">
                       <m-option-item-add></m-option-item-add>
                       <m-option-item-edit></m-option-item-edit>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete :disabled="true"></m-option-item-delete>
                   </m-option>
                   `
    }))
    .add('skin="over-mixed"', () => ({
        data: () => ({
            model1: ''
        }),
        template: `<m-option skin="over-mixed" disabled="true">
                       <m-option-item-add></m-option-item-add>
                       <m-option-item-edit></m-option-item-edit>
                       <m-option-item-archive></m-option-item-archive>
                       <m-option-item-delete :disabled="true"></m-option-item-delete>
                   </m-option>
                   `
    }));

