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
