import { storiesOf } from '@storybook/vue';
import { getSandboxesNames } from './sandbox-loader';

// legacy sandboxe loader for storybook
export const loadSandboxStories: any = () => {

    let sandboxes: any = storiesOf(`Sandboxes`, module);
    sandboxes.addParameters({
        options: {
            showPanel: false
        }
    });

    getSandboxesNames().forEach((sandboxeName) => {
        sandboxes.add(`${sandboxeName}`, () => `<m-${sandboxeName}-sandbox class="m-sandboxes"></m-${sandboxeName}-sandbox>`);
    });
};
