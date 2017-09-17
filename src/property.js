import parse_value_group from './parser/parse-value-group';
import parse_grid  from './parser/parse-grid';
import Shapes from './shapes';
import { memo } from './utils';

const property = {

  ['@size'](value) {
    var [w, h = w] = parse_value_group(value);
    return `width: ${ w }; height: ${ h };`;
  },

  ['@min-size'](value) {
    var [w, h = w] = parse_value_group(value);
    return `min-width: ${ w }; min-height: ${ h };`;
  },

  ['@max-size'](value) {
    var [w, h = w] = parse_value_group(value);
    return `max-width: ${ w }; max-height: ${ h };`;
  },

  ['@place-absolute'](value) {
    var parsed = parse_value_group(value);
    if (parsed[0] !== 'center') return value;
    return `
      position: absolute;
      top: 0; bottom: 0;
      left: 0; right: 0;
      margin: auto !important;
    `;
  },

  ['@grid'](value) {
    var [ grid, size ] = value.split('/').map(s => s.trim());
    return {
      grid: parse_grid(grid),
      size: size ? this['@size'](size) : ''
    };
  },

  ['@shape']: memo('shape-property', function(value) {
    var [type, ...args] = parse_value_group(value);
    return Shapes[type]
      ? `clip-path: ${ Shapes[type].apply(null, args) };`
      : '';
  })

}

property['size'] = property['@size'];
property['min-size'] = property['@min-size'];
property['max-size'] = property['@max-size'];

export default property;
