import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaTable } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
import { GET_ARTICLE_LIST, getArticleList, changeSearchOption } from '@store/article';
import columnDefs from './ArticleDeskAgGridColums';
import GroupNumberRenderer from './GroupNumberRenderer';

/**
 * 기사관리 ag-grid 컴포넌트 (페이지편집)
 */
const ArticleDeskAgGrid = forwardRef((props, ref) => {
    const { onDragStop, dropTargetAgGrid } = props;

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
    const [gridApi, setGridApi] = useState(null);

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
                    gridType: 'ARTICLE',
                };
            }),
        );
    }, [list]);

    useEffect(() => {
        /**
         * 드롭 타겟 ag-grid에 drop-zone 설정
         */
        if (gridApi) {
            if (Array.isArray(dropTargetAgGrid)) {
                dropTargetAgGrid.forEach((grid) => {
                    const dropZone = {
                        getContainer: () => {
                            //  .ag-body-viewport dom을 return한다
                            return grid.gridOptionsWrapper.layoutElements[2];
                        },
                        onDragStop: (target) => {
                            if (onDragStop) {
                                onDragStop(gridApi, target);
                            }
                        },
                    };

                    gridApi.removeRowDropZone(dropZone);
                    gridApi.addRowDropZone(dropZone);
                });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropTargetAgGrid, gridApi]);

    useEffect(() => {
        if (gridApi) {
            gridApi.redrawRows();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowData]);

    return (
        <MokaTable
            ref={ref}
            setGridApi={setGridApi}
            headerHeight={50}
            agGridHeight={623}
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(article) => article.totalId}
            onRowClicked={() => {}}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            showTotalString={false}
            error={error}
            onChangeSearchOption={handleChangeSearchOption}
            frameworkComponents={{ GroupNumberRenderer: GroupNumberRenderer }}
            dragManaged={false}
            animateRows={false}
        />
    );
});

export default ArticleDeskAgGrid;
