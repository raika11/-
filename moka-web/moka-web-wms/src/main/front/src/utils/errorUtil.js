// 에러여부 조회 ( list:에러목록, field: 에러필드 )
export const isError = (list, field) => {
    let find = false;
    if (list) {
        find = !!list.find((item) => {
            return item.field === field;
        });
    }
    return find;
};
// 에러메세지 조회 ( list:에러목록, field: 에러필드 )
export const getReason = (list, field) => {
    let reason = '';
    if (list) {
        const item = list.find((a) => {
            return a.field === field;
        });
        if (item) reason = item.reason;
    }
    return reason;
};
// 에러extra 조회 ( list:에러목록, field: 에러필드 )
export const getExtra = (list, field) => {
    let extra = '';
    if (list) {
        const item = list.find((a) => {
            return a.field === field;
        });
        if (item) extra = item.extra;
    }
    return extra;
};
