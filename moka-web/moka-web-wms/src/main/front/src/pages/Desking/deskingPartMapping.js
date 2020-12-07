import { CODETYPE_DS_FONT_IMGD, CODETYPE_DS_FONT_IMGW, CODETYPE_DS_FONT_VODD } from '@/constants';
import { REQUIRED_REGEX } from '@utils/regexUtil';

// 편집영역에서 사용하는 partList
export const deskingPartList = [
    { index: 0, title: '약물', id: 'SPECIAL_CHAR' },
    { index: 1, title: '이미지', id: 'THUMB_FILE_NAME' },
    { index: 2, title: '아이콘', id: 'ICON_FILE_NAME' },
    { index: 3, title: 'Box 제목', id: 'NAMEPLATE' },
    { index: 4, title: 'Box URL', id: 'NAMEPLATE_URL' },
    { index: 5, title: '말머리', id: 'TITLE_PREFIX' },
    { index: 6, title: '제목/부제위치', id: 'TITLE_LOC' },
    { index: 7, title: '제목', id: 'TITLE' },
    { index: 8, title: '부제', id: 'SUB_TITLE' },
    { index: 9, title: '리드문', id: 'BODY_HEAD' },
    { index: 10, title: 'URL', id: 'LINK_URL' },
    { index: 11, title: '영상', id: 'VOD_URL' },
];

// 제목의 폰트 사이즈 리스트 (편집영역에서 사용)
export const fontSizeList = [
    { index: 0, title: 'Image type1-기본', id: CODETYPE_DS_FONT_IMGD },
    { index: 1, title: 'Vod type1-기본', id: CODETYPE_DS_FONT_VODD },
    { index: 2, title: 'Image type1-와이드', id: CODETYPE_DS_FONT_IMGW },
];
export const fontSizeObj = fontSizeList.reduce((all, ft) => ({ ...all, [ft.id]: ft }), {});

// regex가 여러개일 때 리스트로 변경 -> 추후 필요시 작업
export default {
    // 제목
    TITLE: {
        as: 'textarea',
        field: 'title',
        label: '제목',
        errorCheck: true,
        regex: REQUIRED_REGEX,
        inputProps: {
            className: 'resize-none custom-scroll',
            rows: 2,
        },
    },
    // box 제목
    NAMEPLATE: {
        as: 'textarea',
        field: 'nameplate',
        label: 'Box 제목',
        inputProps: {
            className: 'resize-none custom-scroll',
            rows: 2,
        },
    },
    // box url
    NAMEPLATE_URL: {
        as: 'input',
        type: 'text',
        field: 'nameplateUrl',
        label: 'Box URL',
        placeholder: 'Box URL을 입력하세요',
    },
    // 부제
    SUB_TITLE: {
        as: 'textarea',
        field: 'subTitle',
        label: '부제',
        inputProps: {
            className: 'resize-none custom-scroll',
            rows: 2,
        },
    },
    // 리드문
    BODY_HEAD: {
        as: 'textarea',
        field: 'bodyHead',
        label: '리드문',
        inputProps: {
            className: 'resize-none custom-scroll',
            rows: 5,
        },
    },
    // linkUrl
    LINK_URL: {
        as: 'input',
        type: 'text',
        field: 'linkUrl',
        label: 'URL',
        placeholder: 'URL을 입력하세요',
    },
};
