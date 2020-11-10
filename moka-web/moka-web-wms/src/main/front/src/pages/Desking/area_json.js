export const data = {
    header: {
        success: true,
        resultCode: 200,
        resultType: 200,
        message: 'OK',
        redirect: null,
    },
    body: [
        {
            areaSeq: 24,
            areaNm: 'PC홈',
            parentAreaSeq: 0,
            ordNo: 1,
            nodes: [
                {
                    areaSeq: 35,
                    areaNm: '정치',
                    parentAreaSeq: 24,
                    parentAreaNm: 'PC홈',
                    ordNo: 1,
                    nodes: [
                        {
                            areaSeq: 43,
                            areaNm: '정치1',
                            parentAreaSeq: 35,
                            parentAreaNm: '정치',
                            ordNo: 1,
                        },
                    ],
                },
                {
                    areaSeq: 42,
                    areaNm: '사설',
                    parentAreaSeq: 24,
                    parentAreaNm: 'PC홈',
                    ordNo: 1,
                },
                {
                    areaSeq: 44,
                    areaNm: '사회',
                    parentAreaSeq: 24,
                    parentAreaNm: 'PC홈',
                    ordNo: 1,
                },
            ],
        },
        {
            areaSeq: 26,
            areaNm: '사설',
            parentAreaSeq: 0,
            ordNo: 1,
            nodes: [
                {
                    areaSeq: 29,
                    areaNm: '오피니언',
                    parentAreaSeq: 26,
                    parentAreaNm: '사설',
                    ordNo: 1,
                },
            ],
        },
    ],
};
