/**
 * js object를 폼데이터로 변환한다
 * @param {object} data 오브젝트
 */
export const objectToFormData = (data) => {
    const form_data = new FormData();

    for (let key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach((obj, index) => {
                let keyList = Object.keys(obj);
                keyList.forEach((keyItem) => {
                    let keyName = [key, '[', index, ']', '.', keyItem].join('');
                    if (obj[keyItem] !== undefined) {
                        form_data.append(keyName, obj[keyItem]);
                    }
                });
            });
        } else if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
            for (let innerKey in data[key]) {
                if (data[key][innerKey] !== undefined) {
                    form_data.append(`${key}.${innerKey}`, data[key][innerKey]);
                }
            }
        } else {
            form_data.append(key, data[key]);
        }
    }
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
