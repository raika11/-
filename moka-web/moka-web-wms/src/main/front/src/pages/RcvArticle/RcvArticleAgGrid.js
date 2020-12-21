import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './RcvArticleAgGridColumns';
import { MokaTable } from '@components';
import { GET_TEMPLATE_LIST, getTemplateList, changeSearchOption } from '@store/template';

const testData = [
    {
        totalId: '1234',
        rcvDate: '11-30',
        rcvTime: '10:30',
        source: '[연합]정치',
        artTitle: '[속보]미-이란 무력 충돌 우려...주식 울고 비트코인 웃었다',
        regTime: '13:25',
    },
    {
        totalId: '1234',
        rcvDate: '11-30',
        rcvTime: '10:30',
        source: '[뉴시스]',
        artTitle: '[수정]미-이란 무력 충돌 우려...주식 울고 비트코인 웃었다',
        regTime: '13:25',
    },
];

/**
 * 수신기사 AgGrid 컴포넌트
 */
const RcvArticleAgGrid = ({ onDelete }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    //state
    const [rowData, setRowData] = useState(testData);

    const rcvArticle = useSelector((store) => store.rcvArticle || {});
    const { total, list, search, loading } = useSelector((store) => ({
        total: store.template.total,
        list: store.template.list,
        search: store.template.search,
        loading: store.loading[GET_TEMPLATE_LIST],
    }));

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getTemplateList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (data) => {
            history.push(`/rcv-article/${data.totalId}`);
        },
        [history],
    );

    // useEffect(() => {
    //     if (list.length > 0) {
    //         setRowData(
    //             list.map((data) => {
    //                 let thumb = data.templateThumb;
    //                 if (thumb && thumb !== '') {
    //                     UPLOAD_PATH_URL                        thumb = `${API_BASE_URL}${UPLOAD_PATH_URL}/${thumb}`;
    //                 }
    //                 return {
    //                     ...data,
    //                     id: data.templateSeq,
    //                     name: data.templateName,
    //                     thumb,
    //                     onDelete,
    //                 };
    //             }),
    //         );
    //     } else {
    //         setRowData([]);
    //     }
    // }, [list, onDelete]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(data) => data.totalId}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['preview', 'register']}
            selected={rcvArticle.totalId}
        />
    );
};

export default RcvArticleAgGrid;
