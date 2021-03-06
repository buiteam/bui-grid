var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Grid = require('../src/grid'),
  Plugins = require('../src/plugins/base');


var CLS_RADIO = 'bui-grid-radio',
  columns = [{
    title: '表头1',
    dataIndex: 'a'
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
    a: '123'
  }, {
    a: 'cdd',
    b: 'edd'
  }, {
    a: '1333',
    c: 'eee',
    d: 2
  }];

var grid = new Grid({
  render: '#J_Grid1',
  columns: columns,
  width: 800,
  forceFit: true,
  plugins: [Plugins.RadioSelection]
});
grid.render();
grid.showData(data);
var gridEl = grid.get('el'),
  header = grid.get('header'),
  bodyEl = gridEl.find('.bui-grid-body'),
  columns = grid.get('columns');
describe("测试生成check列", function() {

  it('测试生成内容', function() {

    var
      rows = bodyEl.find('.bui-grid-row');
    rows.each(function(index, row) {
      expect($(row).find('.' + CLS_RADIO)).not.to.be(null);
    });

  });

});

describe("测试事件", function() {
  var col = columns[0],
    rows = bodyEl.find('.bui-grid-row');

  it('测试勾选行,取消勾选', function() {
    var index = 1,
      record = data[index],
      row = rows[index],
      radio = $(row).find('.' + CLS_RADIO);
    grid.setSelection(record);
    expect(!!radio.attr('checked')).to.be(true);
    grid.clearSelection();
    expect(!!radio.attr('checked')).to.be(false);
  });


});