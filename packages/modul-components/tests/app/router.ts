import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Meta from '../../src/meta/meta';
import { FRENCH } from '../../src/utils/i18n';
import { Attributes } from './attributes/attributes';
import { Navigation } from './navigation/navigation';
import { MediaQuery } from './media-query/media-query';
import { Viewer } from './viewer';

Vue.use(Router);

const componentRoutes: RouteConfig[] = [{
    path: '/',
    component: Navigation
}, {
    path: '/attributes',
    component: Attributes
}, {
    path: '/media-query',
    component: MediaQuery
}];

Meta.getTagsByLanguage(FRENCH).forEach(tag => {
    componentRoutes.push({
        path: '/' + tag,
        meta: tag,
        component: Viewer
    });
});

export default new Router({
    mode: 'history',
    routes: componentRoutes
});
