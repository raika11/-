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
