import _extends from "@babel/runtime/helpers/esm/extends";
import { createNamespace, addUnit } from '../utils';
import { toArray, readFile as _readFile, isOversize, isImageFile } from './utils';
import Icon from '../icon';
import Image from '../image';
import ImagePreview from '../image-preview';

var _createNamespace = createNamespace('uploader'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  inheritAttrs: false,
  model: {
    prop: 'fileList'
  },
  props: {
    disabled: Boolean,
    uploadText: String,
    afterRead: Function,
    beforeRead: Function,
    previewSize: [Number, String],
    name: {
      type: [Number, String],
      default: ''
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    fileList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    maxSize: {
      type: Number,
      default: Number.MAX_VALUE
    },
    maxCount: {
      type: Number,
      default: Number.MAX_VALUE
    },
    previewImage: {
      type: Boolean,
      default: true
    },
    resultType: {
      type: String,
      default: 'dataUrl'
    }
  },
  computed: {
    detail: function detail() {
      return {
        name: this.name
      };
    },
    previewSizeWithUnit: function previewSizeWithUnit() {
      return addUnit(this.previewSize);
    }
  },
  methods: {
    onChange: function onChange(event) {
      var _this = this;

      var files = event.target.files;

      if (this.disabled || !files.length) {
        return;
      }

      files = files.length === 1 ? files[0] : [].slice.call(files);

      if (this.beforeRead) {
        var response = this.beforeRead(files, this.detail);

        if (!response) {
          this.resetInput();
          return;
        }

        if (response.then) {
          response.then(function () {
            _this.readFile(files);
          }).catch(this.resetInput);
          return;
        }
      }

      this.readFile(files);
    },
    readFile: function readFile(files) {
      var _this2 = this;

      var oversize = isOversize(files, this.maxSize);

      if (Array.isArray(files)) {
        var maxCount = this.maxCount - this.fileList.length;

        if (files.length > maxCount) {
          files = files.slice(0, maxCount);
        }

        Promise.all(files.map(function (file) {
          return _readFile(file, _this2.resultType);
        })).then(function (contents) {
          var fileList = files.map(function (file, index) {
            return {
              file: file,
              content: contents[index]
            };
          });

          _this2.onAfterRead(fileList, oversize);
        });
      } else {
        _readFile(files, this.resultType).then(function (content) {
          _this2.onAfterRead({
            file: files,
            content: content
          }, oversize);
        });
      }
    },
    onAfterRead: function onAfterRead(files, oversize) {
      if (oversize) {
        this.$emit('oversize', files, this.detail);
        return;
      }

      this.resetInput();
      this.$emit('input', [].concat(this.fileList, toArray(files)));

      if (this.afterRead) {
        this.afterRead(files, this.detail);
      }
    },
    onDelete: function onDelete(file, index) {
      var fileList = this.fileList.slice(0);
      fileList.splice(index, 1);
      this.$emit('input', fileList);
      this.$emit('delete', file);
    },
    resetInput: function resetInput() {
      /* istanbul ignore else */
      if (this.$refs.input) {
        this.$refs.input.value = '';
      }
    },
    onPreviewImage: function onPreviewImage(item) {
      var imageFiles = this.fileList.filter(function (item) {
        return isImageFile(item);
      }).map(function (item) {
        return item.content || item.url;
      });
      ImagePreview({
        images: imageFiles,
        startPosition: imageFiles.indexOf(item.content || item.url)
      });
    },
    renderPreview: function renderPreview() {
      var _this3 = this;

      var h = this.$createElement;

      if (!this.previewImage) {
        return;
      }

      return this.fileList.map(function (item, index) {
        return h("div", {
          "class": bem('preview')
        }, [isImageFile(item) ? h(Image, {
          "attrs": {
            "fit": "cover",
            "src": item.content || item.url,
            "width": _this3.previewSize,
            "height": _this3.previewSize
          },
          "class": bem('preview-image'),
          "on": {
            "click": function click() {
              _this3.onPreviewImage(item);
            }
          }
        }) : h("div", {
          "class": bem('file'),
          "style": {
            width: _this3.previewSizeWithUnit,
            height: _this3.previewSizeWithUnit
          }
        }, [h(Icon, {
          "class": bem('file-icon'),
          "attrs": {
            "name": "description"
          }
        }), h("div", {
          "class": [bem('file-name'), 'van-ellipsis']
        }, [item.file ? item.file.name : item.url])]), h(Icon, {
          "attrs": {
            "name": "delete"
          },
          "class": bem('preview-delete'),
          "on": {
            "click": function click() {
              _this3.onDelete(item, index);
            }
          }
        })]);
      });
    },
    renderUpload: function renderUpload() {
      var h = this.$createElement;

      if (this.fileList.length >= this.maxCount) {
        return;
      }

      var slot = this.slots();
      var Input = h("input", {
        "attrs": _extends({}, this.$attrs, {
          "type": "file",
          "accept": this.accept,
          "disabled": this.disabled
        }),
        "ref": "input",
        "class": bem('input'),
        "on": {
          "change": this.onChange
        }
      });

      if (slot) {
        return h("div", {
          "class": bem('input-wrapper')
        }, [slot, Input]);
      }

      var style;

      if (this.previewSize) {
        var size = this.previewSizeWithUnit;
        style = {
          width: size,
          height: size
        };
      }

      return h("div", {
        "class": bem('upload'),
        "style": style
      }, [h(Icon, {
        "attrs": {
          "name": "plus"
        },
        "class": bem('upload-icon')
      }), this.uploadText && h("span", {
        "class": bem('upload-text')
      }, [this.uploadText]), Input]);
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("div", {
      "class": bem()
    }, [h("div", {
      "class": bem('wrapper')
    }, [this.renderPreview(), this.renderUpload()])]);
  }
});