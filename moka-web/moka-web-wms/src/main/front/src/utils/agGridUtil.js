import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

export function agGrids() {}
agGrids.prototype.grids = [];
agGrids.prototype.rgrids = { main: {}, rel: {} }; // 관련기사 다이얼로그
agGrids.prototype.change = function (idx, instance, etc) {
    if (etc) {
        const { target, field } = etc;
        if (target === 'relationArticle') {
            this.rgrids[field] = instance;
        }
    } else {
        this.grids[idx] = instance;
    }
};

/**
 * 편집제목 셀 만들기
 * @param {string} title 기사제목
 * @param {string} distYmdt 배부시간
 * @param {number} relCount 관련기사 건수
 * @param {number} pvCount 편집기사의 PV
 * @param {number} uvCount 편집기사의 UV
 */
export const makeTitleEx = (title, distYmdt, relCount, pvCount, uvCount) => {
    let titleStr = title;
    const distYmdtStr = `배부 ${moment(distYmdt, DB_DATEFORMAT).format('YYYYMMDD hh:mm')}`;
    const relCountStr = relCount && relCount > 0 ? ` 관련기사: ${relCount}건` : '';
    const pvUvCountStr = ` PV(${pvCount}) UV(${uvCount})`;
    const strArr = [
        // eslint-disable-next-line max-len
        '<p style="font-size:14px; margin: 0; text-overflow: ellipsis; width: 100%; white-space: nowrap; overflow: hidden;">',
        titleStr,
        '</p>',
        '<p style="font-size:10px; color:rgba(0, 0, 0, 0.65); margin: 0;">',
        distYmdtStr,
        relCountStr,
        pvUvCountStr,
        '</p>',
    ];
    return strArr.join('');
};

/**
 * 마우스 위치에 따른 row index 찾는 함수
 * @param {object} event 드래그 이벤트
 */
export const getRowIndex = (event) => {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const agGridRow = elements.find((r) => r.classList.contains('ag-row'));
    if (agGridRow) {
        const index = agGridRow.getAttribute('row-index');
        return Number(index);
    }
    return -1;
};
