var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Grid = require('../src/grid'),
  Plugins = require('../src/plugins/base');

/*
describe('测试汇总行生成', function() {
  var columns = [{
    title: '表头1',
    id: 'menu',
    dataIndex: 'a',
    sortState: 'ASC',
    summary: true
  }, {
    id: '123',
    title: '表头2',
    summary: true,
    dataIndex: 'b',
    sortable: false
  }, {
    title: '表头3',
    dataIndex: 'c'
  }, {
    id: 'd',
    title: '表头3',
    summary: true,
    dataIndex: 'd'
  }];

  var summary = new Plugins.Summary(),
    store = new Data.Store({
      autoLoad: false,
      url: 'data/summary.php',
      pageSize: 10
    }),
    grid = new Grid({
      render: '#J_Grid5',
      columns: columns,
      plugins: [summary],
      forceFit: true,
      store: store,
      bbar: {
        pagingBar: true
      }
    });

  grid.render();

  var el = grid.get('el');

  describe('测试汇总行生成', function() {
    it('测试汇总行生成', function() {
      expect(el.find('tfoot').length).not.to.be(0);
      expect(summary.get('footerEl')).not.to.be(null);
    });
  });

  describe('测试汇总行加载数据', function() {

    it('测试加载数据,无汇总', function(done) {
      store.load({
        type: 0
      });
      setTimeout(function() {
        var pageSummary = summary.get('pageSummary'),
          summaryObj = summary.get('summary');
        expect(pageSummary).not.to.be(undefined);

        expect(summaryObj).to.be(undefined);
        done();
      },300);
    });
    it('测试加载数据,仅总体汇总', function(done) {
      store.load({
        type: 1
      });
      setTimeout(function() {
        var pageSummary = summary.get('pageSummary'),
          summaryObj = summary.get('summary');
        expect(pageSummary).not.to.be(undefined);
        expect(summaryObj).not.to.be(undefined);
        done();
      },300);
    });

    it('测试加载数据,包含所有汇总', function(done) {
      store.load({
        type: 2
      });
      setTimeout(function() {
        var pageSummary = summary.get('pageSummary'),
          summaryObj = summary.get('summary');
        expect(pageSummary).not.to.be(undefined);
        expect(summaryObj).not.to.be(undefined);
        done();
      },300);
    });
  });

  describe('测试表格变化', function() {
    var column = grid.findColumn(1);
    var footerEl = summary.get('footerEl');
    it('测试隐藏列', function() {
      expect(footerEl.find('.grid-td-' + column.get('id')).length).not.to.be(0);
      column.set('visible', false);
      expect(footerEl.find('.grid-td-' + column.get('id')).length).to.be(0);
    });

    it('测试显示列', function() {
      column.set('visible', true);
      expect(footerEl.find('.grid-td-' + column.get('id')).length).not.to.be(0);
    });
  });
});

describe('测试本页汇总', function() {
  var columns = [{
    title: '表头1',
    id: 'a1',
    dataIndex: 'a',
    sortState: 'ASC',
    summary: true,
    showMenu: true
  }, {
    id: 'b1',
    title: '表头2',
    summary: true,
    dataIndex: 'b',
    sortable: false,
    showMenu: true
  }, {
    title: '表头3',
    dataIndex: 'c'
  }, {
    id: 'd1',
    title: '表头3',
    summary: true,
    dataIndex: 'd'
  }];
  var data = [{
    a: 1,
    b: 2,
    c: 3,
    d: 4
  }, {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  }, {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  }, {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  }, {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  }];
  var store = new Data.Store({
      autoLoad: true,
      data: data
    }),
    summary = new Plugins.Summary(),
    grid = new Grid({
      render: '#J_Grid6',
      columns: columns,
      plugins: [summary],
      forceFit: true,
      store: store
    });

  grid.render();
  var pageEl = summary.get('pageEl');

  describe('测试本页汇总', function() {
    it('测试汇总行生成', function() {
      var pageSummary = summary.get('pageSummary'),
        summaryObj = summary.get('summary');
      expect(pageSummary).not.to.be(undefined);

      expect(summaryObj).to.be(undefined);
    });
  });

  describe('测试表格变化', function() {


    it('测试添加数据', function() {
      var name = 'b',
        pageSummary = summary.get('pageSummary'),
        obj = {
          'b': 2
        },
        prevValue = pageSummary[name];

      expect(pageSummary).not.to.be(undefined);
      store.add(obj);

      pageSummary = summary.get('pageSummary');
      var val = pageSummary[name];
      expect(val).to.be(prevValue + obj[name]);
      expect(pageEl.find('.grid-td-b1').text()).to.be(val.toString());
    });

    it('测试删除数据', function() {
      var record = store.findByIndex(2),
        name = 'd',
        pageSummary = summary.get('pageSummary'),
        prevValue = pageSummary[name];

      store.remove(record);

      pageSummary = summary.get('pageSummary');
      var val = pageSummary[name];
      expect(val).to.be(prevValue - record[name]);
      expect(pageEl.find('.grid-td-d1').text()).to.be(val.toString());
    });

    it('测试更新数据', function() {
      var record = store.findByIndex(2),
        name = 'd',
        newVal = 10,
        pageSummary = summary.get('pageSummary'),
        prevValue = pageSummary[name];
      record[name] = newVal;

      store.update(record);
      pageSummary = summary.get('pageSummary');
      var val = pageSummary[name];
      expect(pageEl.find('.grid-td-d1').text()).to.be(val.toString());
    });

    it('测试首行文本', function() {
      var firstCell = pageEl.children().first(),
        title = summary.get('pageSummaryTitle'),
        text = firstCell.text();
      expect(text.indexOf(title)).not.to.be(-1);

    });

  });
});

*/