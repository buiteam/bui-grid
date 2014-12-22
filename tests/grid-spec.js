var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Format = require('../src/format'),
  Grid = require('../src/grid');

require('bui-dpl/css/bs3/dpl.css');
require('bui-dpl/css/bs3/bui.css');

function getSetWidth(el) {
  var dom = el[0];
  if (dom) {
    return dom.style.width;
  }
}

function getSetHeight(el) {
  var dom = el[0];
  if (dom) {
    return dom.style.height;
  }
}
/**/
describe('测试Grid生成', function() {

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
      dataIndex: 'd',
      visible: false
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
    }],
    store = new Data.Store({
      url: 'data/number40.json',
      autoLoad: false,
      pageSize: 3
    });
  var grid = new Grid({
    render: $('<div></div>').appendTo('body'),
    columns: columns,
    width: 800,
    height: 500,
    tbar: {

      items: [{
        xclass: 'bar-item-button',
        elCls: 'grid-bar-test',
        btnCls: 'button  button-primary',
        text: '测试3',
        listeners: {
          'click': function(event) {
            alert('122');
          }
        }
      }, {
        xclass: 'bar-item-separator'
      }, {
        xclass: 'bar-item-button',
        btnCls: 'button button-small',
        text: '删除',
        listeners: {
          'click': function(event) {
            alert('删除');
          }
        }
      }]
    },

    bbar: {
      pagingBar: true
    },
    store: store
  });
  grid.render();

  var gridEl = grid.get('el'),
    header = grid.get('header'),
    bodyEl = gridEl.find('.bui-grid-body');

  describe("测试Grid 生成", function() {
    it('测试Grid 元素生成', function() {
      expect(gridEl).not.to.be(null);
      expect(gridEl.hasClass('bui-grid')).to.be.ok();
    });

    it('测试Grid 表头生成', function() {
      var headerEl = gridEl.find('.bui-grid-header');
      expect(headerEl).not.to.be(null);
    });

    it('测试Grid Body生成', function() {

      expect(bodyEl).not.to.be(null);
    });

    it('测试Grid初始化宽度', function() {
      expect(grid._getInnerWidth()).to.be(header.get('width'));
      //expect(grid._getInnerWidth()).to.be(getSetWidth());
      expect(gridEl.hasClass('bui-grid-width')).to.be.ok();
    });

    it('测试Grid初始化高度', function() {
      expect(gridEl.hasClass('bui-grid-height')).to.be.ok();
      expect(getSetHeight(bodyEl)).not.to.be(undefined);
    });

    it('测试Grid 命令栏的生成', function() {
      expect(gridEl.find('.grid-bar-test').length).not.to.be(0);
    });

    it('测试Grid 分页栏的生成', function() {
      expect(gridEl.find('.bui-pagingbar').length).not.to.be(0);
    });
    it('测试Grid显示数据', function(done) {
      store.load();
      //store.setResult(data);
      setTimeout(function() {
        expect($('.bui-grid-row', gridEl).length).to.be(store.getCount());
        done();
      }, 200);
      //
    });

  });

  describe("测试 子模块之间的联动", function() {
    describe("测试表头和内容之间的联动", function() {
      it('排序', function() {
        var index = 0,
          colObj = grid.findColumn(index);

        // spyOn(grid, 'onLocalSort').andCallThrough();
        // colObj.set('sortState', 'DESC');
        // expect(grid.onLocalSort).toHaveBeenCalled();
      });

      it('测试更改列宽度', function() {
        var index = 2,
          colObj = grid.findColumn(index),
          firstRowEl = bodyEl.find('.bui-grid-header-row'),
          width = 150,
          cellEl = grid.findCell(colObj.get('id'), firstRowEl);

        colObj.set('width', width);
        expect(getSetWidth(cellEl)).to.be(width + 'px');
      });

      // it('显示、隐藏列', function() {
      //   var index = 2,
      //     colObj = grid.findColumn('colhide'),
      //     firstRowEl = bodyEl.find('.bui-grid-header-row'),
      //     width = 150,
      //     cellEl = grid.findCell(colObj.get('id'), firstRowEl);
          
      //   expect(cellEl.css('display')).to.be('none');
      //   colObj.set('visible', true);
      //   expect(cellEl.css('display')).not.to.be('none');
      //   colObj.set('visible', false);
      // });

      it('添加列,删除列', function() {
        var cfg = {
            id: 'new1',
            title: '新建表头'
          },
          colObj = null,
          index = 0,
          tableEl = bodyEl.find('table'),
          rowEl = null,
          cellEl = null;
        colObj = grid.addColumn(cfg);
        index = header.getColumnIndex(colObj);
        expect(index).not.to.be(-1);
        rowEl = tableEl.find('.bui-grid-row');
        cellEl = grid.findCell(cfg.id, rowEl);
        expect(cellEl.length).not.to.be(0);

        grid.removeColumn(colObj);
        index = header.getColumnIndex(colObj);
        expect(index).to.be(-1);
        rowEl = tableEl.find('.bui-grid-row');
        cellEl = grid.findCell(cfg.id, rowEl);
        expect(cellEl.length).to.be(0);
      });
    });



    describe("测试维度配置项", function() {
      it('测试Grid，设置宽度', function() {
        var width = 500;
        grid.set('width', width);
        expect(grid._getInnerWidth()).to.be(width - 2);
        expect(header.get('width')).to.be(grid._getInnerWidth());
        expect(bodyEl.width()).to.be(grid._getInnerWidth());
      });


      it('测试forceFit = false时,Grid有宽度，调整列的宽度', function() {
        var width = 300;
        grid.set('width', width);
        var index = 2,
          colObj = grid.findColumn(index),
          tableEl = bodyEl.find('table'),
          formColWidth = colObj.get('width'),
          formTableWidth = tableEl.width();

        colObj.set('width', formColWidth + 100);
        if (header.getColumnsWidth() > width) {
          expect(tableEl.width()).to.be(formTableWidth + 100);
        } else {
          expect(getSetWidth(tableEl)).to.be(width + 'px');
        }
      });

      it('测试表格高度设置', function() {
        var height = 300;
        grid.set('height', height);
        expect(gridEl.hasClass('bui-grid-height')).to.be.ok();
      });

      it('测试表格高度设置', function() {
        var
          tableEl = bodyEl.find('table'),
          width = grid.get('width'),
          height = 400; //tableEl.height();
        grid.set('height', height);
        if (header.getColumnsWidth() <= width) {
          expect(getSetWidth(tableEl)).to.be((width - 17) + 'px');
        } else {
          expect(getSetWidth(tableEl)).to.be(header.getColumnsWidth() + 'px');
        }
        expect(gridEl.hasClass('bui-grid-height')).to.be.ok();
      });
      it('测试滚动条', function() {
        var callBack = sinon.spy(),
          left = 30;
        grid.on('scroll', function(e) {
          callBack(e.scrollLeft);
        });
        //spyOn(header, 'scrollTo').andCallThrough();
        bodyEl.scrollLeft(left);
        /*waits(100);
        runs(function() {
          expect(callBack).toHaveBeenCalledWith(left);
          expect(header.scrollTo).toHaveBeenCalled();
          expect(header.get('el').scrollLeft()).to.be(left)
          grid.set('width', 800);
        });*/
      });
    });

    describe("测试分页栏", function() {
      it('测试加载数据后分页栏的状态', function(done) {
        store.load();
        setTimeout(function() {
          expect(grid.get('bbar').get('totalPage')).not.to.be(1);
          done();
        },500);
      });
    });
  });


  describe("测试Grid 事件", function() {
    var CLS_SELECTED = 'bui-grid-row-selected',
      tableEl = bodyEl.find('table');
    it('测试Grid，单选模式下点击行', function(done) {

      var rows = $('.bui-grid-row', tableEl),
        rowEl = $(rows[0]);
      rowEl.trigger('click')
      setTimeout(function() {
        expect(rowEl.hasClass(CLS_SELECTED)).to.be.ok();
        done();
      },100);
    });
    it('测试Grid，测试单元格点击事件', function(done) {

      var rows = $('.bui-grid-row', tableEl),
        rowEl = $(rows[0]);
      rowEl.trigger('click')
      setTimeout(function() {
        expect(rowEl.hasClass(CLS_SELECTED)).to.be.ok();
        done();
      },100);
    });

    it('测试Grid，单选模式移除所有选中', function() {
      grid.clearSelection();
      expect($('.' + CLS_SELECTED, tableEl).length).to.be(0);
    });

    it('测试Grid，多选模式下点击行', function(done) {

      var rows = $('.bui-grid-row', tableEl),
        rowEl = $(rows[0]);
      grid.set('multipleSelect', true);
      rowEl.trigger('click');
      setTimeout(function() {
        expect(rowEl.hasClass(CLS_SELECTED)).to.be.ok();
        $(rows[1]).trigger('click');
        setTimeout(function() {
          expect($('.' + CLS_SELECTED, tableEl).length).to.be(2);
          rowEl.trigger('click');
          setTimeout(function() {
            expect(rowEl.hasClass(CLS_SELECTED)).not.to.be.ok();
            done();
          },100);
        },100);

      },100);
    });

    it('测试Grid，设置、获取选中', function() {
      var index = 1,
        record = store.getResult()[index];
      grid.clearSelection();
      expect($('.' + CLS_SELECTED, tableEl).length).to.be(0);

      grid.setSelection(record);
      expect($($('.bui-grid-row', tableEl)[index]).hasClass(CLS_SELECTED)).to.be.ok();
    });


    it('测试Grid，全选，全部取消选中', function() {
      var rows = $('.bui-grid-row', tableEl);
      grid.setAllSelection();
      expect(grid.getSelection().length).to.be(store.getCount());
      rows.each(function(index, row) {

        expect($(row).hasClass(CLS_SELECTED)).to.be.ok();
      });
      grid.clearSelection();
      rows.each(function(index, row) {
        expect($(row).hasClass(CLS_SELECTED)).not.to.be.ok();
      });
    });
  });

});

$('<div id="J_Grid1"></div>').appendTo('body');


describe('测试Grid自适应', function() {

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
      width: 120,
      dataIndex: 'c',
      renderer: Format.dateRenderer
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
      c: 1349600235595,
      d: 2
    }],
    store = new Data.Store({
      autoLoad: true,
      data: data
    });
  var grid = new Grid({
    render: '#J_Grid1',
    columns: columns,
    //innerBorder:false,
    store: store,
    forceFit: true
  });

  grid.render();
  var header = grid.get('header'),
    body = grid.get('body');

  describe("测试Grid forceFit = true", function() {
    var emptyCell = header.get('el').find('.bui-grid-hd-empty');
    it('测试表格宽度默认等于容器宽度', function() {
      expect(grid.get('width')).to.be($('#J_Grid1').width());
    });
    it('测试列自适应', function() {
      var width = 500;
      grid.set('width', width);
      expect(header.getColumnsWidth()).to.be(grid._getInnerWidth());
    });

    it('测试列显示隐藏列后的自适应', function() {
      var index = 2,
        colObj = grid.findColumn(index);
      colObj.set('visible', false);
      expect(header.getColumnsWidth()).to.be(header.get('width'));

      colObj.set('visible', true);
      expect(header.getColumnsWidth()).to.be(header.get('width'));
    });

    it('测试列改变宽度后的自适应', function() {
      var index = 2,
        colObj = grid.findColumn(index);
      colObj.set('width', 150);
      expect(header.getColumnsWidth()).to.be(header.get('width'));
      colObj.set('width', 100);
      expect(header.getColumnsWidth()).to.be(header.get('width'));
    });

    it('设置高度后，测试列自适应', function() {
      grid.showData(data);
      var height = 500;
      grid.set('height', height);
      expect(header.getColumnsWidth()).to.be(header.get('width') - 17);


    });


  });

});


describe('测试Grid添加删除', function() {

  var columns = [{
      title: '表头1',
      dataIndex: 'a',
      sortState: 'ASC',
      width: '20%'
    }, {
      id: '123',
      title: '表头2',
      dataIndex: 'b',
      sortable: false,
      width: '20%'
    }, {
      title: '表头3',
      dataIndex: 'c',
      width: '20%'
    }, {
      id: 'colhide',
      title: '隐藏',
      dataIndex: 'd',
      width: '40%'
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
    }],
    store = new Data.Store({
      autoLoad: false,
      data: data
    });
  var grid = new Grid({
    render: '#J_Grid2',
    columns: columns,
    //innerBorder : false,
    //tableCls : 'table table-striped table-bordered',
    //forceFit:true,
    store: store,
    width: '100%'

  });

  grid.render();
  store.load();

  var gridEl = grid.get('el'),
    body = grid.get('body');
  describe('添加、删除纪录', function() {

    it('添加纪录', function() {
      var item = {
          a: '233'
        },
        count = store.getCount();
      store.add(item);
      expect(store.getCount()).to.be(count + 1);
      expect(gridEl.find('.bui-grid-row').length).to.be(count + 1);
    });

    it('删除纪录', function() {
      var item = {
          a: '233'
        },
        count = store.getCount();
      store.remove(item, function(obj1, obj2) {
        return obj1.a == obj2.a;
      });
      expect(store.getCount()).to.be(count - 1);
      expect(gridEl.find('.bui-grid-row').length).to.be(count - 1);
    });

  });

  describe('编辑纪录', function() {

    it('编辑纪录', function() {
      var item = {
          a: '233'
        },
        count = store.getCount();
      store.add(item);
      item.b = '344';
      store.update(item);
      expect(grid.findCell('123', item).text()).to.be(item.b);
      store.remove(item);
    });

    it('设置纪录值', function() {
      var item = {
        a: '233'
      };
      store.add(item);
      var b = '222';
      store.setValue(item, 'b', b);
      expect(grid.findCell('123', item).text()).to.be(b);
      store.remove(item);
    });

  });

});

describe('测试无数据', function() {

  var columns = [{
      title: '表头1',
      dataIndex: 'a',
      sortState: 'ASC',
      width: '20%'
    }, {
      id: '123',
      title: '表头2',
      dataIndex: 'b',
      sortable: false,
      width: '20%'
    }, {
      title: '表头3',
      dataIndex: 'c',
      width: '20%'
    }, {
      id: 'colhide',
      title: '隐藏',
      dataIndex: 'd',
      width: '40%'
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
    }],
    store = new Data.Store({
      autoLoad: false,
      data: data
    });
  var grid = new Grid({
    render: '#J_Grid4',
    columns: columns,
    store: store,
    emptyDataTpl: '<div class="centered"><img alt="Crying" src="http://img03.taobaocdn.com/tps/i3/T1amCdXhXqXXXXXXXX-60-67.png"><h2>查询的数据不存在</h2></div>',
    width: '100%'

  });

  grid.render();
  store.load();

  var gridEl = grid.get('el');
  describe('无数据显示文本', function() {

    it('存在数据时不显示提示信息', function() {
      expect(gridEl.find('.centered').length).to.be(0);
    });

    it('删除纪录', function() {
      store.setResult([]);
      expect(gridEl.find('.centered').length).to.be(1);
    });

  });

});
/**/
