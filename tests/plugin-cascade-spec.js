var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Grid = require('../src/grid'),
  Plugins = require('../src/plugins/base'),
  Cascade = Plugins.Cascade;

var cascade = new Cascade({
  renderer: function(record) {
    return '<h1>' + record.a + '</h1>';
  }
});

var columns = [{
    title: '表头1',
    dataIndex: 'a',
    sortState: 'ASC',
    showMenu: true
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

var CLS_CASCADE = 'bui-grid-cascade',
  CLS_CASCADE_ROW = CLS_CASCADE + '-row',
  store = new Data.Store({
    autoLoad: true,
    data: data
  }),
  grid = new Grid({
    render: '#J_Grid3',
    columns: columns,
    plugins: [cascade],
    forceFit: true,
    store: store
  });
grid.render();

var el = grid.get('el');

describe('测试展开折叠列生成', function() {

  it('测试生成折叠列', function() {
    var columns = grid.get('columns');
    expect(columns[0].get('title')).to.be('');

  });
  it('测试生成折图标', function() {
    expect(el.find('.bui-grid-cascade').length).to.be(data.length);
  });

  it('测试展开,折叠', function(done) {
    var cell = el.find('.' + CLS_CASCADE).first(),
      row = cell.parents('.bui-grid-row');
    cell.trigger('click');
    setTimeout(function() {
      var cascadeRow = row.next('.' + CLS_CASCADE_ROW);
      expect(cascadeRow.length).to.be(1);
      expect(cascadeRow.hasClass(CLS_CASCADE + '-collapse')).not.to.be(true);

      cell.trigger('click');
      setTimeout(function() {
        expect(cascadeRow.hasClass(CLS_CASCADE + '-collapse')).to.be(true);
        done();
      },100);

    },100);
  });

});

describe('测试操作展开，折叠', function() {

  it('全部展开', function() {
    cascade.expandAll();
    expect(el.find('.' + CLS_CASCADE_ROW).length).to.be(data.length);
    expect(el.find('.' + CLS_CASCADE_ROW).hasClass(CLS_CASCADE + '-collapse')).to.be(false);
  });

  it('全部折叠', function() {
    cascade.collapseAll();
    expect(el.find('.' + CLS_CASCADE_ROW).hasClass(CLS_CASCADE + '-collapse')).to.be(true);
  });

  it('清除展开列', function() {
    cascade.removeAll();
    expect(el.find('.' + CLS_CASCADE_ROW).length).to.be(0);
  });

  it('测试展开事件', function() {
    var callback = sinon.spy();
    cascade.on('expand', callback);
    cascade.expandAll();
    expect(callback.called).to.be(true);
    cascade.off('expand', callback);
  });

  it('测试折叠事件', function() {
    var callback = sinon.spy();
    cascade.on('collapse', callback);
    cascade.collapseAll();
    expect(callback.called).to.be(true);
    cascade.off('collapse', callback);
  });

  it('测试移除事件', function() {
    var callback = sinon.spy();
    cascade.on('removed', callback);
    cascade.removeAll();
    expect(callback.called).to.be(true);
    cascade.off('removed', callback);
  });
});

describe('测试列变化', function() {

  function testColspan(rows) {
    $.each(rows, function(index, row) {
      var gridRow = $(row).prev();
      expect($(row).find('.bui-grid-cascade-cell').attr('colspan')).to.be(cascade._getColumnCount(gridRow).toString());
    });
  }
  it('测试添加、删除列', function() {

    var config = {
        title: '添加列',
        dataIndex: 'e'
      },
      column = grid.addColumn(config),
      rows = el.find('.bui-grid-cascade-row');

    cascade.expandAll();
    testColspan(rows);

    grid.removeColumn(column);

    cascade.expandAll();
    testColspan(rows);
  });

  it('测试隐藏列', function() {
    var column = grid.findColumn('123');
    column.set('visible', false);

    var rows = el.find('.bui-grid-cascade-row');
    testColspan(rows);
    column.set('visible', true);

    testColspan(rows);
  });
});

describe('测试行变化', function() {

  it('测试添加纪录', function() {
    var record = {
      a: '124344'
    };
    store.add(record);
    expect(el.find('.bui-grid-cascade').length).to.be(store.getCount());
  });

  it('测试删除纪录', function() {

    store.remove({
      a: '123'
    }, function(obj1, obj2) {
      return obj1.a == obj2.a;
    });
    expect(el.find('.bui-grid-cascade').length).to.be(store.getCount());

  });

  it('测试清空纪录', function() {
    store.setResult([]);
    expect(el.find('.' + CLS_CASCADE_ROW).length).to.be(0);
    store.setResult(data);
  });
}); /**/