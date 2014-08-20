var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Grid = require('../src/grid'),
  RowNumber = require('../src/plugins/rownumber');

/**/

var columns = [{
  title: '表头1',
  id: 'menu',
  dataIndex: 'a',
  sortState: 'ASC'
}, {
  id: '123',
  title: '表头2',
  dataIndex: 'b'
}, {
  title: '表头3',
  dataIndex: 'c'
}, {
  id: 'd',
  title: '表头3'
}];

var data = [{
  a: '123'
}, {
  a: 'cdd',
  b: 'edd'
}, {
  a: '1333',
  c: 'eee',
  d: 2
}];

grid = new Grid({
  render: '#J_Grid7',
  columns: columns,
  plugins: [RowNumber],
  forceFit: true
});


grid.render();
grid.showData(data);

var el = grid.get('el');

describe('测试序列的生成', function() {

});