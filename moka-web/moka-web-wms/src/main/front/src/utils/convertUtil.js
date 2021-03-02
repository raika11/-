import { decode } from 'html-entities';
import moment from 'moment';
import commonUtil from '@utils/commonUtil';

/**
 * js object를 폼데이터로 변환한다
 * https://stackoverflow.com/a/63840358
 * @param {object} data 오브젝트
 */
export const objectToFormData = (val, formData = new FormData(), namespace = '') => {
    if (typeof val !== 'undefined' && val !== null) {
        if (val instanceof Date) {
            formData.append(namespace, val.toISOString());
        } else if (val instanceof Array) {
            for (let i = 0; i < val.length; i++) {
                objectToFormData(val[i], formData, namespace + '[' + i + ']');
            }
        } else if (typeof val === 'object' && !(val instanceof File)) {
            for (let propertyName in val) {
                if (val.hasOwnProperty(propertyName)) {
                    objectToFormData(val[propertyName], formData, namespace ? `${namespace}.${propertyName}` : propertyName);
                }
            }
        } else if (val instanceof File) {
            formData.append(namespace, val);
        } else {
            formData.append(namespace, val);
        }
    }
    return formData;
};

/**
 * unescape html special chars
 * @param {string} str 문자열
 */
export const unescapeHtml = (str) => {
    if (str && str !== '') {
        if (typeof decode === 'function') {
            // decode를 import 못하는 경우가 있어서 예외처리
            return decode(str);
        } else {
            return str;
        }
    } else return str;
};

/**
 * 등록기사/수신기사 문자열 unescape html
 * 기사에만 타는 특문 + 기본 특문
 * @param {string} str 문자열
 */
export const unescapeHtmlArticle = (str) => {
    if (str && str !== '') {
        const ns = str
            .replace(/&#0*39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&#34;/g, '"')
            .replace(/&#91;/g, '[')
            .replace(/&#93;/g, ']')
            .replace(/…/g, '...')
            .replace(/\<br\/\>/g, '\r\n');
        return unescapeHtml(ns);
    } else return str;
};

/**
 * invalidList to error object
 * @param {array} invalidList invalidList
 */
export const invalidListToError = (invalidList) => {
    return Array.isArray(invalidList)
        ? invalidList.reduce(
              (all, c) => ({
                  ...all,
                  [c.field]: true,
                  [`${c.field}Message`]: c.reason,
              }),
              {},
          )
        : {};
};

/**
 * 사용 X
 * escape html special chars
 * @param {string} str 문자열
 */
// const escapeHtml = (str) => {
//     const map = {
//         '&': '&amp;',
//         '<': '&lt;',
//         '>': '&gt;',
//         '"': '&quot;',
//         "'": '&#39;',
//         '[': '&#91;',
//         ']': '&#93;',
//         '‘': '&#8216;',
//         '’': '&#8217;',
//         '%': '&#37;',
//         '·': '&middot;',
//     };
//     return str.replace(/[&<>"'\[\]‘’%·]/g, function (m) {
//         return map[m];
//     });
// };

/**
 * 사용 X
 * 등록기사/수신기사 문자열 escape html
 * @param {string} str 문자열
 */
// const escapeHtmlArticle = (str) => {
//     const map = {
//         "'": '&#39;',
//         '"': '&#34;',
//         '[': '&#91;',
//         ']': '&#93;',
//         '...': '…',
//         '\r\n': '<br/>',
//     };
//     return str
//         .replace(/["'\[\]]/g, function (m) {
//             return map[m];
//         })
//         .replace(/\.{3}/g, function (m) {
//             return map[m];
//         })
//         .replace(/\r\n/g, function (m) {
//             return map[m];
//         });
// };

export const toTourReservationMailPreviewHTML = (info) => {
    return (
        '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html;charset=euc-kr" />' +
        '<title>중앙일보 안내레터</title>' +
        '<style type="text/css">' +
        'body {margin:0;padding:0;}' +
        '</style>' +
        '</head>' +
        '<body>' +
        '<!-- Header -->' +
        tourReservationHTMLHeader() +
        '<!-- // Header -->' +
        '<!-- 레터 이미지  내용 -->' +
        tourReservationBody(info) +
        '<!-- // 레터 이미지  내용 -->' +
        tourReservationHTMLFooter() +
        '<!-- Footer -->' +
        '<!-- // Footer -->' +
        '<map name="Map_footer">' +
        '<area shape="rect" coords="59,45,144,60" href="http://joongang.joins.com/" target="_blank" alt="JoongAngIlbo.">' +
        '</map>' +
        '</body>' +
        '</html>'
    );
};

const tourReservationHTMLFooter = () => {
    return (
        '<table width="652" height="79" border="0" cellpadding="0" cellspacing="0" bgcolor="#eeeeee">' +
        '<tr>' +
        '<td width="20" rowspan="2" valign="top"><img src="http://images.joins.com/ui_portal/portal2010/letter/space.gif" width="20" height="10"></td>' +
        '<td width="115" valign="top" rowspan="2"><a href="http://joongang.joins.com/" target="_blank"><img border="0" alt="중앙일보" src="http://images.joins.com/ui_portal/portal2010/letter/footer_joongang_logo.gif"></a></td>' +
        '<td rowspan="2" valign="top"><img src="http://images.joins.com/ui_portal/portal2010/letter/footer_joongang.gif" border="0" usemap="#Map_footer"></td>' +
        '<td height="15" valign="top"><img src="http://images.joins.com/ui_portal/portal2010/letter/space.gif" height="15"></td>' +
        '<td width="20" rowspan="2" valign="top"><img src="http://images.joins.com/ui_portal/portal2010/letter/space.gif" width="20" height="10"></td>' +
        '</tr>' +
        '<tr>' +
        '  <td height="64" valign="top"><a href="http://my.joins.com" target="_blank"><img src="http://images.joins.com/ui_portal/portal2010/letter/btn_customer.gif" alt="고객센터" border="0"></a></td>' +
        '</tr>        ' +
        '</table>'
    );
};

const tourReservationHTMLHeader = () => {
    return (
        '<table border="0" cellspacing="0" cellpadding="0" bgcolor="white" style="width:652px;">' +
        '<tbody>' +
        '<tr>' +
        '<td width="20" height="66" rowspan="2">&nbsp;</td>' +
        '<td height="25" colspan="2">&nbsp;</td>' +
        '<td width="20" height="66" rowspan="2">&nbsp;</td>' +
        '</tr>' +
        '<tr>' +
        '<td valign="top" width="116" height="47" style="padding-top:2px;"><a href="http://joongang.joins.com/" target="_blank" title="(새창) 중앙일보 이동"><img src="http://images.joins.com/ui_portal/portal2016/letter/t_letter_joongang.jpg" alt="중앙일보" border="0" style="vertical-align:top;"></a></td>' +
        '<td valign="top" height="47"><img src="http://images.joins.com/ui_portal/portal2010/letter/t_info_v2.gif" alt="안내레터" border="0" /></td>' +
        '</tr>' +
        '<tr>' +
        '<td height="3" colspan="4" bgcolor="#231f20"></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'
    );
};
const tourReservationHTMLSuccessBody = (tourDate, tourTime, tourGroupNm, tourPersons, writerNm, writerPhone) => {
    return (
        '<table border="0" cellspacing="0" cellpadding="0" bgcolor="white" style="width:650px;font:normal 15px \'Malgun Gothic\',\'맑은 고딕\',dotum,\'돋움\',sans-serif,sans-serif-light;letter-spacing:-0.05em;color:#231f20;border:1px solid #eee;">' +
        '<tbody>' +
        '<tr>' +
        '<td colspan="3">' +
        '' +
        '<img border="0" src="http://images.joins.com/ui_joongang/news/pc/visit/v_visit_letter_title.jpg" style="vertical-align:top;" />' +
        '' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td width="40">&nbsp;</td>' +
        '<td>' +
        '<table border="0" cellspacing="0" cellpadding="0" bgcolor="white" style="width:570px;font:normal 13px/22px \'Malgun Gothic\',\'맑은 고딕\',dotum,\'돋움\',sans-serif,sans-serif-light;letter-spacing:-0.05em;color:#222;border-bottom:1px solid #000;">' +
        '<tbody>' +
        '<tr><td height="9" colspan="3"></td></tr>' +
        '' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">상태</td>' +
        '<td height="30" width="460" style="vertical-align:middle">신청 확정</td>' +
        '</tr>' +
        '' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">일시</td>' +
        `<td height="30" width="460" style="vertical-align:middle">${tourDate} ${tourTime}시</td>` +
        '</tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">단체명</td>' +
        `<td height="30" width="460" style="vertical-align:middle">${tourGroupNm}</td>` +
        '</tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">인원수</td>' +
        `<td height="30" width="460" style="vertical-align:middle">${tourPersons}명</td>` +
        '</tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">신청자</td>' +
        `<td height="30" width="460" style="vertical-align:middle">${writerNm} (${writerPhone})</td>` +
        '</tr>' +
        '' +
        '<tr><td height="9" colspan="3"></td></tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '<td width="40">&nbsp;</td>' +
        '</tr>' +
        '<tr>' +
        '<td height="50" colspan="3">&nbsp;</td>' +
        '</tr>' +
        '<tr>' +
        '<td height="50" colspan="3" align="center"><a href="http://news.joins.com/jtour#write_wrap" target="_blank"><img border="0" src="http://images.joins.com/ui_joongang/news/pc/visit/b_visit_letter.gif" style="vertical-align:top;" /></a></td>' +
        '</tr>' +
        '<tr>' +
        '<td height="50" colspan="3">&nbsp;</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'
    );
};

const tourReservationHTMLFailBody = (tourDate, tourTime, tourGroupNm, tourPersons, writerNm, writerPhone, returnReason) => {
    return (
        '<table border="0" cellspacing="0" cellpadding="0" bgcolor="white" style="width:650px;font:normal 15px \'Malgun Gothic\',\'맑은 고딕\',dotum,\'돋움\',sans-serif,sans-serif-light;letter-spacing:-0.05em;color:#231f20;border:1px solid #eee;">' +
        '<tbody>' +
        '<tr>' +
        '<td colspan="3">' +
        '<img border="0" src="http://images.joins.com/ui_joongang/news/pc/visit/v_visit_letter_title2.jpg" style="vertical-align:top;" />' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td width="40">&nbsp;</td>' +
        '<td>' +
        '<table border="0" cellspacing="0" cellpadding="0" bgcolor="white" style="width:570px;font:normal 13px/22px \'Malgun Gothic\',\'맑은 고딕\',dotum,\'돋움\',sans-serif,sans-serif-light;letter-spacing:-0.05em;color:#222;border-bottom:1px solid #000;">' +
        '<tbody>' +
        '<tr><td height="9" colspan="3"></td></tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">상태</td>' +
        '<td height="30" width="460" style="vertical-align:middle"><span style="color:#ff2222">신청 반려</span></td>' +
        '</tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">반려 사유</td>' +
        `<td height="30" width="460" style="vertical-align:middle"><span style="color:#ff2222">${returnReason}</span></td>` +
        '</tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">일시</td>' +
        `<td height="30" width="460" style="vertical-align:middle">${tourDate} ${tourTime}시</td>` +
        '</tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">단체명</td>' +
        `<td height="30" width="460" style="vertical-align:middle">${tourGroupNm}</td>` +
        '</tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">인원수</td>' +
        `<td height="30" width="460" style="vertical-align:middle">${tourPersons}명</td>` +
        '</tr>' +
        '<tr>' +
        '<td height="30" width="19">&nbsp;</td>' +
        '<td height="30" width="90" style="vertical-align:middle;font-weight:bold">신청자</td>' +
        `<td height="30" width="460" style="vertical-align:middle">${writerNm} (${writerPhone})</td>` +
        '</tr>' +
        '<tr><td height="9" colspan="3"></td></tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '<td width="40">&nbsp;</td>' +
        '</tr>' +
        '<tr>' +
        '<td height="50" colspan="3">&nbsp;</td>' +
        '</tr>' +
        '<tr>' +
        '<td height="50" colspan="3" align="center"><a href="http://news.joins.com/jtour#write_wrap" target="_blank"><img border="0" src="http://images.joins.com/ui_joongang/news/pc/visit/b_visit_letter.gif" style="vertical-align:top;" /></a></td>' +
        '</tr>' +
        '<tr>' +
        '<td height="50" colspan="3">&nbsp;</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'
    );
};

const tourReservationBody = (info) => {
    const { tourStatus, tourDate: infoTourDate, tourTime, tourGroupNm, tourPersons, writerNm, writerPhone, returnReason: infoReturnReason } = info;
    const tourDate = moment(infoTourDate).format('YYYY-MM-DD');
    const returnReason = commonUtil.isEmpty(infoReturnReason) ? '' : infoReturnReason;
    return tourStatus === 'A'
        ? tourReservationHTMLSuccessBody(tourDate, tourTime, tourGroupNm, tourPersons, writerNm, writerPhone)
        : tourReservationHTMLFailBody(tourDate, tourTime, tourGroupNm, tourPersons, writerNm, writerPhone, returnReason);
};
