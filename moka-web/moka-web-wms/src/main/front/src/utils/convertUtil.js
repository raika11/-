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
            formData.append(namespace, val.toString());
        }
    }
    return formData;
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
