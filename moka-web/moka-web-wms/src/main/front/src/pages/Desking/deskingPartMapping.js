import { CODETYPE_DS_FONT_IMGD, CODETYPE_DS_FONT_IMGW, CODETYPE_DS_FONT_VODD } from '@/constants';
import { REQUIRED_REGEX } from '@utils/regexUtil';

// 편집영역에서 사용하는 partList
export const deskingPartList = [
    { title: '약물', id: 'SPECIAL_CHAR' },
    { title: '이미지', id: 'THUMB_FILE_NAME' },
    { title: '아이콘', id: 'ICON_FILE_NAME' },
    { title: 'Box 제목', id: 'NAMEPLATE' },
    { title: 'Box URL', id: 'NAMEPLATE_URL' },
    { title: '말머리', id: 'TITLE_PREFIX' },
    { title: '제목/부제위치', id: 'TITLE_LOC' },
    { title: '제목', id: 'TITLE' },
    { title: '부제', id: 'SUB_TITLE' },
    { title: '리드문', id: 'BODY_HEAD' },
    { title: 'URL', id: 'LINK_URL' },
    { title: '영상', id: 'VOD_URL' },
].map((part, index) => ({ ...part, index }));

// 제목의 폰트 사이즈 리스트 (편집영역에서 사용)
export const fontSizeList = [
    { title: 'Image type1-기본', id: CODETYPE_DS_FONT_IMGD },
    { title: 'Vod type1-기본', id: CODETYPE_DS_FONT_VODD },
    { title: 'Image type1-와이드', id: CODETYPE_DS_FONT_IMGW },
].map((size, index) => ({ ...size, index }));
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
            rows: 2,
        },
    },
    // 리드문
    BODY_HEAD: {
        as: 'textarea',
        field: 'bodyHead',
        label: '리드문',
        inputProps: {
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
