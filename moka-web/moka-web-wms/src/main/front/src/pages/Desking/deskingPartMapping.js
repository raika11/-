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
        label: 'box 제목',
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
