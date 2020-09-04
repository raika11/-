/**
 * 입력 코어
 */
export default function Core() {}
Core.prototype.infoObj = {};
Core.prototype.dummyObj = {};
Core.prototype.push = function (type, { key, value }) {
    if (type === 'info') {
        this.infoObj[key] = value;
    } else if (type === 'dummy') {
        this.dummyObj[key] = value;
    }
};
Core.prototype.onSave = function () {
    if (typeof this.onSaveAction === 'function') {
        this.onSaveAction(this.infoObj);
    }
};
