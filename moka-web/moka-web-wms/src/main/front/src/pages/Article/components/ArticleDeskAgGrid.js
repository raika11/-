import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaTable } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
import { GET_ARTICLE_LIST, getArticleList, changeSearchOption } from '@store/article';
import columnDefs from './ArticleDeskAgGridColums';

const ArticleDeskAgGrid = forwardRef((props, ref) => {
    const { onRowDragMove } = props;

    const dispatch = useDispatch();
    const { search, list, total, error, loading } = useSelector((store) => ({
        search: store.article.search,
        list: store.article.list,
        total: store.article.total,
        error: store.article.error,
        loading: store.loading[GET_ARTICLE_LIST],
    }));

    // state
    const [rowData, setRowData] = useState([]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = () => {};

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getArticleList(changeSearchOption(temp)));
    };

    /**
     * 드래그
     */
    const handleRowDragMove = () => {
        if (typeof onRowDragMove === 'function') {
            onRowDragMove();
        }
    };

    useEffect(() => {
        setRowData(
            list.map((art) => {
                // 기자명 replace
                let reportersText = art.artReporter;
                const reporters = art.artReporter.split('.');
                if (reporters.length > 1) reportersText = `${reporters[0]} 외 ${reporters.length - 1}명`;

                // 제목 replace
                let escapeTitle = art.artTitle;
                if (escapeTitle && escapeTitle !== '') escapeTitle = unescapeHtml(escapeTitle);

                // 면판 replace
                let myunPan = '';
                if (art.pressMyun && art.pressMyun.replace(/\s/g, '') !== '') myunPan = `${art.pressMyun}/${art.pressPan}`;

                // 출고시간/수정시간 replace
                let articleDt = moment(art.serviceDaytime, DB_DATEFORMAT).format('MM-DD HH:mm');
                if (art.artModDt) {
                    articleDt = `${articleDt}\n${moment(art.artModDt, DB_DATEFORMAT).format('MM-DD HH:mm')}`;
                }

                return {
                    ...art,
                    escapeTitle,
                    myunPan,
                    articleDt,
                    reportersText,
                };
            }),
        );
    }, [list]);

    return (
        <MokaTable
            ref={ref}
            headerHeight={50}
            agGridHeight={623}
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(article) => article.totalId}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            showTotalString={false}
            error={error}
            onChangeSearchOption={handleChangeSearchOption}
            onRowDragMove={handleRowDragMove}
        />
    );
});

export default ArticleDeskAgGrid;
