var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Data = require('bui-data'),
  Grid = require('../src/grid'),
  Format = require('../src/format'),
  RowEditing = require('../src/plugins/rowediting'),
  Selection = require('../src/plugins/selection'),
  Plugins = require('../src/plugins/base');

describe('测试编辑器生成', function() {

  var enumObj = {
      '1': '选项一',
      '2': '选项二'
    },
    columns = [{
      title: '表头1',
      dataIndex: 'a'
    }, {
      id: '123',
      title: '表头2',
      dataIndex: 'b',
      width: 50,
      editor: {
        xtype: 'text',
        rules: {
          maxlength: 5
        }
      }
    }, {
      title: '表头3',
      dataIndex: 'c',
      editor: {
        xtype: 'date',
        validator: function(value, obj) {
          if (obj['b'] && !value) {
            return '表头2不为空时，表头3也不能为空！';
          }
        }
      },
      renderer: Format.dateRenderer
    }, {
      id: 'select',
      title: '选择',
      editor: {
        xtype: 'select',
        items: enumObj
      },
      dataIndex: 'd',
      renderer: Format.enumRenderer(enumObj)
    }],
    data = [{
      a: '123'
    }, {
      a: 'cdd',
      b: 'edd',
      c: 1362625302818
    }, {
      a: '123'
    }, {
      a: '1333',
      c: 'eee',
      d: 2
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }];


  var editing = new RowEditing(),
    store = new Data.Store({
      data: data
    }),
    grid = new Grid({
      render: '#J_Grid1',
      columns: columns,
      width: 800,
      height: 250,
      forceFit: true,
      store: store,
      plugins: [editing, Selection.CheckSelection]
    });;

  grid.render();


  function getField(field) {
    return form.getField(field);
  }

  function testVisible() {
    var columns = grid.get('columns');
    BUI.each(columns, function(column) {
      var visible = column.get('visible');
      if (column.get('editor')) {
        var field = getField(column.get('dataIndex'));
        expect(field).not.to.be(null);
        expect(field.get('visible')).to.be(visible);
      }

    });
  }

  /**/
  var editor = null,
    form = null;

  describe('测试编辑器生成', function() {
    it('测试初始化', function(done) {
      setTimeout(function() {
        editor = editing.getEditor('b'),
        form = editor.get('form');

        var editors = editing.get('editors');
        expect(editors.length).to.be(1);
        expect(grid.get('columns').length).to.be(editor.get('form').get('children').length);
        done();
      },1000);
    });
    it('测试默认隐藏列', function() {
      testVisible();
    });
  });


  describe('测试编辑器操作', function() {

    it('编辑字段', function() {
      var record = store.findByIndex(1);
      editing.edit(record, 'a');
      expect(editor.get('visible')).to.be(true);
      expect(editing.get('record')).to.be(record);
      expect(form.getFieldValue('a')).to.be(record['a']);
    });

    it('取消编辑', function() {
      editing.cancel();
      expect(editor.get('visible')).to.be(false);
    });

    it('测试出错', function() {
      var record = store.findByIndex(1);
      editing.edit(record, 'a');
      editor.setValue({
        b: '1234565'
      });
      editor.accept();
      expect(editor.get('visible')).to.be(true);
    });

    it('测试行间校验', function() {
      editor.cancel();
      var record = store.findByIndex(1);
      editing.edit(record, 'a');
      editor.setValue({
        b: '1234',
        c: '2001-01-01'
      });
      expect(editor.isValid()).to.be(true);
      var record = store.findByIndex(2);
      editing.edit(record, 'a');
      editor.setValue({
        b: '1234'
      });
      editor.valid();
      expect(editor.isValid()).to.be(false);
    });

    it('提交编辑', function() {
      editor.cancel();
      var record = store.findByIndex(2),
        newData = {
          b: '1234',
          c: '2001-01-01'
        };
      editing.edit(record, 'b');
      editor.setValue(newData);
      editor.accept();
      expect(editor.get('visible')).to.be(false);
      expect(record.b).to.be(newData.b);
    });
  });

  describe('测试表格操作', function() {

    it('测试删除正在编辑的记录', function() {
      var record = store.findByIndex(3);

      editing.edit(record, 'b');
      store.remove(record);
      expect(editor.get('visible')).to.be(false);
      expect(editing.get('record')).to.be(null);
    });

    it('测试隐藏列', function() {
      var column = grid.findColumnByField('b');
      column.set('visible', false);
      //testVisible();
    });

    it('测试显示列', function() {
      var column = grid.findColumnByField('b');
      column.set('visible', true);
      testVisible();
    });

    it('测试改变表格宽度', function() {

    });

    it('测试表格滚动', function() {

    });
  });

});

describe('测试编辑器操作', function() {

  var enumObj = {
      '1': '选项一',
      '2': '选项二'
    },
    columns = [{
      title: '表头1',
      dataIndex: 'a'
    }, {
      id: '123',
      title: '表头2',
      dataIndex: 'b',
      width: 50,
      editor: {
        xtype: 'text',
        rules: {
          maxlength: 5
        }
      }
    }, {
      title: '表头3',
      dataIndex: 'c',
      editor: {
        xtype: 'date',
        validator: function(value, obj) {
          if (obj['b'] && !value) {
            return '表头2不为空时，表头3也不能为空！';
          }
        }
      },
      renderer: Format.dateRenderer
    }, {
      id: 'select',
      title: '选择',
      editor: {
        xtype: 'select',
        items: enumObj
      },
      dataIndex: 'd',
      renderer: Format.enumRenderer(enumObj)
    }, {
      title: '操作',
      renderer: function() {
        return '<span class="grid-command btn-edit">编辑</span>'
      }
    }],
    data = [{
      a: '123'
    }, {
      a: 'cdd',
      b: 'edd',
      c: 1362625302818
    }, {
      a: '123'
    }, {
      a: '1333',
      c: 'eee',
      d: 2
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }, {
      a: '123'
    }];


  var editing = new RowEditing({
      triggerCls: 'btn-edit'
    }),
    store = new Data.Store({
      data: data
    }),
    grid = new Grid({
      render: '#J_Grid5',
      columns: columns,
      width: 800,
      height: 250,
      forceFit: true,
      store: store,
      plugins: [editing]
    });;

  grid.render();


  function getField(field) {
    return form.getField(field);
  }


  /**/
  var editor = null,
    form = null;

});