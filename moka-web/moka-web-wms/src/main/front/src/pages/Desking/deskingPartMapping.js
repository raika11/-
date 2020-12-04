export const deskingPartList = [
    { index: 0, title: '약물', id: 'specialChar' },
    { index: 1, title: '이미지', id: 'thumbFileName' },
    { index: 2, title: '아이콘', id: 'icon' },
    { index: 3, title: 'Box 제목', id: 'boxTitle' },
    { index: 4, title: 'Box URL', id: 'boxUrl' },
    { index: 5, title: '말머리', id: 'titlePrefix' },
    { index: 6, title: '제목/부제위치', id: 'titlePosition' },
    { index: 7, title: '제목', id: 'title' },
    { index: 8, title: '부제', id: 'subTitle' },
    { index: 9, title: '리드문', id: 'bodyHead' },
    { index: 10, title: 'URL', id: 'linkUrl' },
    { index: 11, title: '영상', id: 'video' },
    { index: 11, title: '라이브 제목', id: 'liveTitle' },
    { index: 11, title: '라이브 URL', id: 'liveUrl' },
];

export default {
    // 제목
    title: {
        as: 'textarea',
        field: 'title',
        label: '제목',
        errorCheck: true,
        inputProps: {
            className: 'resize-none custom-scroll',
            rows: 2,
        },
    },
    // box 제목
    boxTitle: {
        as: 'textarea',
        field: 'boxTitle',
        label: 'Box 제목',
        inputProps: {
            className: 'resize-none custom-scroll',
            rows: 2,
        },
    },
    // box url
    boxUrl: {
        as: 'input',
        type: 'text',
        field: 'boxUrl',
        label: 'Box URL',
        placeholder: 'URL을 입력하세요',
    },
    // 부제
    subTitle: {
        as: 'textarea',
        field: 'subTitle',
        label: '부제',
        inputProps: {
            className: 'resize-none custom-scroll',
            rows: 2,
        },
    },
    // 리드문
    bodyHead: {
        as: 'textarea',
        field: 'bodyHead',
        label: '리드문',
        inputProps: {
            className: 'resize-none custom-scroll',
            rows: 5,
        },
    },
    // linkUrl
    linkUrl: {
        as: 'input',
        type: 'text',
        field: 'linkUrl',
        label: 'URL',
        placeholder: 'URL을 입력하세요',
    },
    // moreUrl
    moreUrl: {
        as: 'input',
        type: 'text',
        field: 'moreUrl',
        label: '더보기 URL',
        placeholder: 'URL을 입력하세요',
    },
};
