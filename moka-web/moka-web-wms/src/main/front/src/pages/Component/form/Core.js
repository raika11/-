/**
 * 수정/등록 코어
 */
export default function Core() {}
Core.prototype.saveObj = {};
Core.prototype.push = function (type, { key, value }) {
    if (type === 'save') {
        this.saveObj[key] = value;
    }
};
Core.prototype.onSave = function () {
    if (typeof this.onSaveAction === 'function') {
        this.onSaveAction(this.saveObj);
    }
};
