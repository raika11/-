import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { MokaInput, MokaModal, MokaSearchInput, MokaTable } from '@components';
import { messageBox } from '@utils/toastUtil';
import { JPLUS_REP_DIV_DEFAULT } from '@/constants';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import { initialState, getReporterListModal, GET_REPORTER_LIST_MODAL } from '@store/reporter';
import { getNewsLetterChannelType } from '@store/newsLetter';
import { getJplusRep } from '@store/codeMgt';
import { repColumnDefs } from './ReporterListModalColumns';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * row click (add버튼)
     */
    onRowClicked: PropTypes.func,
    /**
     * 뉴스레터 채널 타입(뉴스레터 channelType='REPORTER')
     */
    channelType: PropTypes.string,
};
const defaultProps = {
    channelType: null,
};

/**
 * 기자 목록 모달
 */
const ReporterListModal = (props) => {
    const { show, onHide, onRowClicked, channelType } = props;
    const dispatch = useDispatch();
    const jplusRepRows = useSelector(({ codeMgt }) => codeMgt.jplusRepRows);
    const letterChannelTypeList = useSelector(({ newsLetter }) => newsLetter.newsLetter.letterChannelTypeList);
    const loading = useSelector(({ loading }) => loading[GET_REPORTER_LIST_MODAL]);
    const [setGridInstance] = useState(null);
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);

    /**
     * row 클릭
     * @param {object} data data
     */
    const handleRowClicked = useCallback(
        (row) => {
            if (onRowClicked) {
                onRowClicked(row);
                if (channelType) {
                    onHide();
                }
            }
        },
        [onRowClicked, channelType, onHide],
    );

    /**
     * 기자 조회 함수
     */
    const getReporterList = useCallback(
        ({ search: appendSearch }) => {
            setSearch({ ...search, ...appendSearch });

            if (channelType) {
                dispatch(
                    getNewsLetterChannelType({
                        channelType,
                        callback: ({ header, body }) => {
                            if (header.success && body) {
                                dispatch(
                                    getReporterListModal({
                                        search,
                                        callback: ({ header, body }) => {
                                            if (header.success) {
                                                setRowData(
                                                    body.list.map((reporter) => ({
                                                        ...reporter,
                                                        jplusRepDivNm: (reporter.jplusRepDivNm || JPLUS_REP_DIV_DEFAULT).slice(0, 2),
                                                        letterYn: letterChannelTypeList.indexOf(reporter.repSeq) > -1 ? 'Y' : 'N',
                                                        onClick: handleRowClicked,
                                                    })),
                                                );
                                                setTotal(body.totalCnt);
                                            } else {
                                                messageBox.alert(header.message);
                                            }
                                        },
                                    }),
                                );
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            } else {
                dispatch(
                    getReporterListModal({
                        search,
                        callback: ({ header, body }) => {
                            if (header.success) {
                                setRowData(
                                    body.list.map((reporter) => ({
                                        ...reporter,
                                        jplusRepDivNm: (reporter.jplusRepDivNm || JPLUS_REP_DIV_DEFAULT).slice(0, 2),
                                        onClick: handleRowClicked,
                                    })),
                                );
                                setTotal(body.totalCnt);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            }
        },
        [search, channelType, dispatch, letterChannelTypeList, handleRowClicked],
    );

    /**
     * 검색조건 변경
     */
    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setSearch({ ...search, [name]: value });
        },
        [search],
    );

    /**
     * 테이블에서 검색조건 변경
     */
    const changeTableSearchOption = useCallback(
        ({ key, value }) => {
            let ns = { [key]: value };
            if (key !== 'page') ns['page'] = 0;
            getReporterList({ search: ns });
        },
        [getReporterList],
    );

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        let ns = { page: 0 };
        getReporterList({ search: ns });
    }, [getReporterList]);

    /**
     * 취소
     */
    const handleHide = () => {
        setSearch(initialState.search);
        setRowData([]);
        setTotal(0);
        onHide();
    };

    useEffect(() => {
        if (show) {
            getReporterList({});
        } else {
            setSearch(initialState.search);
            setRowData([]);
            setTotal(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        if (show && !jplusRepRows) dispatch(getJplusRep());
    }, [dispatch, jplusRepRows, show]);

    return (
        <MokaModal show={show} onHide={handleHide} title="기자 검색" size="xl" bodyClassName="d-flex flex-column" width={970} height={800} centered draggable>
            <div className="mb-14 d-flex">
                <div style={{ width: 180 }} className="mr-2">
                    <MokaInput as="select" name="jplusRepDiv" value={search.jplusRepDiv} onChange={handleChange}>
                        <option value="">전체</option>
                        {jplusRepRows &&
                            jplusRepRows.map((rep) => (
                                <option key={rep.cdOrd} value={rep.dtlCd}>
                                    {rep.cdNm}
                                </option>
                            ))}
                        <option value="NL">일보기자</option>
                    </MokaInput>
                </div>
                <MokaSearchInput name="keyword" className="flex-fill" value={search.keyword} onChange={handleChange} onSearch={handleSearch} placeholder="기자 이름을 검색하세요" />
            </div>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={repColumnDefs(props)}
                rowData={rowData}
                rowHeight={GRID_ROW_HEIGHT.C[0]}
                onRowNodeId={(reporter) => reporter.repSeq}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                setGridInstance={setGridInstance}
                onChangeSearchOption={changeTableSearchOption}
            />
        </MokaModal>
    );
};

ReporterListModal.propTypes = propTypes;
ReporterListModal.defaultProps = defaultProps;

export default ReporterListModal;
