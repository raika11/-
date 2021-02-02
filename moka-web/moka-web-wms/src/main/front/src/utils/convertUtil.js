/**
 * js object를 폼데이터로 변환한다
 * @param {object} obj 오브젝트
 */
export const objectToFormData = (obj) => {
    const form_data = new FormData();

    Object.keys(obj).forEach((key) => {
        let value = obj[key];

        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                form_data.append(key, JSON.stringify(value));
            } else {
                form_data.append(key, value);
            }
        }
    });

    return form_data;
};

/**
 * escape html special chars
 * @param {string} str 문자열
 */
export const escapeHtml = (str) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '[': '&#91;',
        ']': '&#93;',
        '‘': '&#8216;',
        '’': '&#8217;',
        '%': '&#37;',
        '·': '&middot;',
    };
    return str.replace(/[&<>"'\[\]‘’%·]/g, function (m) {
        return map[m];
    });
};

/**
 * unescape html special chars
 * @param {string} str 문자열
 */
export const unescapeHtml = (str) => {
    if (str && str !== '') {
        return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#0*39;/g, "'")
            .replace(/&#91;/g, '[')
            .replace(/&#93;/g, ']')
            .replace(/&quot;/g, '"')
            .replace(/&#34;/g, '"')
            .replace(/&#8216;/g, '‘')
            .replace(/&#8217;/g, '’')
            .replace(/&#037;/g, '%')
            .replace(/&middot;/g, '·')
            .replace(/&hellip;/g, '…');
    } else return str;
};

/**
 * 등록기사/수신기사 문자열 escape html
 * @param {string} str 문자열
 */
export const escapeHtmlArticle = (str) => {
    const map = {
        "'": '&#39;',
        '"': '&#34;',
        '[': '&#91;',
        ']': '&#93;',
        '...': '…',
        '\r\n': '<br/>',
    };
    return str
        .replace(/["'\[\]]/g, function (m) {
            return map[m];
        })
        .replace(/\.{3}/g, function (m) {
            return map[m];
        })
        .replace(/\r\n/g, function (m) {
            return map[m];
        });
};

/**
 * 등록기사/수신기사 문자열 unescape html
 * @param {string} str 문자열
 */
export const unescapeHtmlArticle = (str) => {
    if (str && str !== '') {
        return str
            .replace(/&#0*39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&#34;/g, '"')
            .replace(/&#91;/g, '[')
            .replace(/&#93;/g, ']')
            .replace(/…/g, '...')
            .replace(/\<br\/\>/g, '\r\n');
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
