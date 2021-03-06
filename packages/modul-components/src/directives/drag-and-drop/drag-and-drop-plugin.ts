import { PluginObject } from 'vue';
import '../../utils/polyfills/drag-and-drop.polyfill';
import DraggablePlugin from './draggable/draggable';
import DraggableAllowScrollPlugin from './draggable/draggable-allow-scroll';
import DroppablePlugin from './droppable/droppable';
import DroppableGroupPlugin from './droppable/droppable-group';


const DragAndDropPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(DraggablePlugin);
        v.use(DraggableAllowScrollPlugin);
        v.use(DroppablePlugin);
        v.use(DroppableGroupPlugin);
    }
};

export default DragAndDropPlugin;
