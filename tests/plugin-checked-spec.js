var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Grid = require('../src/grid'),
  Plugins = require('../src/plugins/base');

require('./checked.css');

$('<div id="col1"></div>').appendTo('body');

var columns = [{
    title: '表头1',
    dataIndex: 'a',
    sortState: 'ASC'
  }, {
    id: '123',
    title: '表头2',
    dataIndex: 'b',
    checkable : true
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
    b : false
  }, {
    a: 'cdd',
    b: true,
    disabled: true
  }, {
    a : '1333',
    b : false,
    c: 'eee',
    d: 2
  }];

var store = new Data.Store({
  data : data
});

var grid = new Grid({
  render: '#col1',
  columns: columns,
  plugins: [Plugins.ColumnChecked],
  forceFit: true,
  store : store
});
grid.render();


