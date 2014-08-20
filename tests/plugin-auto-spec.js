var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Grid = require('../src/grid'),
  Plugins = require('../src/plugins/base');


var columns = [{
    title: '表头1',
    dataIndex: 'a',
    sortState: 'ASC'
  }, {
    id: '123',
    title: '表头2',
    dataIndex: 'b',
    sortable: false
  }, {
    title: '表头3',
    dataIndex: 'c'
  }, {
    id: 'colhide',
    title: '隐藏',
    dataIndex: 'd'
  }],
  data = [{
    a: '123',
    selected: true
  }, {
    a: 'cdd',
    b: 'edd',
    disabled: true
  }, {
    a: '1333',
    c: 'eee',
    d: 2
  }];

var grid = new Grid({
  render: '#J_Auto',
  columns: columns,
  plugins: [Plugins.AutoFit],
  itemStatusFields: {
    selected: 'selected',
    disabled: 'disabled'
  },
  forceFit: true
});
grid.render();
grid.showData(data);
var gridEl = grid.get('el'),
  header = grid.get('header'),
  bodyEl = gridEl.find('.bui-grid-body'),
  columns = grid.get('columns');