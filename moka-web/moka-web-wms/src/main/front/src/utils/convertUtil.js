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
 * unescape html special chars
 * @param {string} str 문자열
 */
export const unescapeHtml = (str) => {
    if (str && str !== '') {
        return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'")
            .replace(/&#039;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&#91;/g, '[')
            .replace(/&#93;/g, ']')
            .replace(/&#34;/g, '"')
            .replace(/&#8216;/g, '‘')
            .replace(/&#8217;/g, '’')
            .replace(/&#037;/g, '%')
            .replace(/&middot;/g, '·');
    } else return str;
};

/**
 * escape html special chars
 * @param {string} str 문자열
 */
export const escapeHtml = (str) => {
    if (str && str !== '') {
        return str
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll("'", '&#39;')
            .replaceAll('"', '&quot;')
            .replaceAll('[', '&#91;')
            .replaceAll(']', '&#93;')
            .replaceAll('‘', '&#8216;')
            .replaceAll('’', '&#8217;')
            .replaceAll('%', '&#037;')
            .replaceAll('·', '&middot;');
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
