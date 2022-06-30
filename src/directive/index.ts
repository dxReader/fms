import Vue from 'vue';
import text from './filterLimitVal';
const filterText = Vue.directive('filter-text', text);

export { filterText };
