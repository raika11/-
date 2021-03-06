import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './ArticleAgGridColumns';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { MokaTable } from '@components';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { GET_ARTICLE_LIST, changeSearchOption, getArticleList, stopArticle, deleteArticle, clearArticle } from '@store/article';
import { DB_DATEFORMAT, ARTICLE_URL } from '@/constants';

moment.locale('ko');

/**
 * 등록기사 AgGrid 컴포넌트
 */
const ArticleAgGrid = ({ match, ja }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_LIST]);
    const OVP_PREVIEW_URL = useSelector(({ app }) => app.OVP_PREVIEW_URL);
    const { total, list, search, article } = useSelector(({ article }) => article);
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeSearchOption(temp));
            dispatch(getArticleList({ search: temp }));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (data) => {
            history.push(`${match.path}/${data.totalId}`);
        },
        [history, match.path],
    );

    /**
     * ag-grid queue empty 시점에서 실행 => 고정 2줄로 변경되어 사용하지 않음. 참고용으로 주석처리
     * https://www.ag-grid.com/documentation/javascript/grid-events/
     */
    // const handleRowRendered = useCallback((params) => {
    //     setTimeout(function () {
    //         params.api.forEachNode((rowNode) => {
    //             // autoHeight 셀 = 매체, 제목
    //             const cells = params.api.getCellRendererInstances({ columns: ['source', 'artTitle'], rowNodes: [rowNode] });
    //             if (cells.length === 2) {
    //                 const height = cells[0].getGui().offsetHeight > cells[1].getGui().offsetHeight ? cells[0].getGui().offsetHeight : cells[1].getGui().offsetHeight;
    //                 if (height + 8 > rowNode.rowHeight) {
    //                     rowNode.setRowHeight(height + 8);
    //                 }
    //             }
    //         });
    //         params.api.onRowHeightChanged();
    //     });
    // }, []);

    /**
     * 삭제
     */
    const handleClickDelete = useCallback(
        ({ totalId }) => {
            messageBox.confirm(
                '삭제 후 복구가 불가능합니다.\n그래도 해당 기사를 삭제하시겠습니까?',
                () => {
                    dispatch(
                        deleteArticle({
                            totalId: totalId,
                            callback: ({ header }) => {
                                if (header.success) {
                                    toast.success(header.message);
                                    history.push(match.path);
                                    dispatch(clearArticle());
                                } else {
                                    toast.fail(header.message);
                                }
                            },
                        }),
                    );
                },
                () => {},
            );
        },
        [dispatch, history, match.path],
    );

    /**
     * 중지
     */
    const handleClickStop = useCallback(
        ({ totalId }) => {
            messageBox.confirm(
                '기사가 더이상 서비스 되지 않습니다.\n다시 서비스하려면 기사 수정 기능을 사용하세요.\n계속 하시겠습니까?',
                () => {
                    dispatch(
                        stopArticle({
                            totalId: totalId,
                            callback: ({ header }) => {
                                if (header.success) {
                                    toast.success(header.message);
                                } else {
                                    toast.fail(header.message);
                                }
                            },
                        }),
                    );
                },
                () => {},
            );
        },
        [dispatch],
    );

    useEffect(() => {
        setRowData(
            list.map((data) => {
                // 면판 replace
                let myunPan = '';
                myunPan = `${data.pressMyun || ''}/${data.pressPan || ''}`;

                let source = '';
                source = `${data.sourceName}\n${data.contentKorname}`;

                return {
                    ...data,
                    source,
                    artTitle: unescapeHtmlArticle(data.artTitle),
                    artUrl: `${ARTICLE_URL}${data.totalId}`,
                    regDt: moment(data.serviceDaytime, DB_DATEFORMAT).format('MM-DD HH:mm'),
                    myunPan,
                    handleRowClicked,
                    vodFullLink: `${OVP_PREVIEW_URL}${(data.ovpLink || '').replaceAll('?', '&')}`,
                    ja, // 편집그룹 표기 유무
                    handleClickDelete,
                    handleClickStop,
                };
            }),
        );
    }, [OVP_PREVIEW_URL, handleClickDelete, handleClickStop, handleRowClicked, ja, list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs.map((def) => (def.field === 'view' ? { ...def, width: !ja ? 90 : def.width } : def))}
            rowData={rowData}
            headerHeight={GRID_ROW_HEIGHT.T[0]}
            rowHeight={GRID_ROW_HEIGHT.T[1]}
            onRowNodeId={(data) => data.totalId}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['view', 'register']}
            refreshCellsParams={{
                force: true,
                columns: ['register'],
            }}
            selected={article.totalId}
            // onAnimationQueueEmpty={handleRowRendered}
        />
    );
};

export default ArticleAgGrid;
