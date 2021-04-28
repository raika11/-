import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { DB_DATEFORMAT, S_MODAL_PAGESIZE_OPTIONS, DESK_STATUS_PUBLISH } from '@/constants';
import common from '@utils/commonUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { messageBox } from '@utils/toastUtil';
import { MokaModal, MokaInput, MokaTable } from '@components';
import {
    initialState,
    getIssueDeskingHistoryList,
    getIssueDeskingHistory,
    GET_ISSUE_DESKING_HISTORY_LIST,
    GET_ISSUE_DESKING_HISTORY,
    clearIssueDeskingHistory,
} from '@store/issue';

moment.locale('ko');

const propTypes = {
    compNo: PropTypes.number,
    pkgSeq: PropTypes.string,
    onLoad: PropTypes.func,
};
const defaultProps = {};

/**
 * 이슈의 데스킹 히스토리 모달 (전송 히스토리)
 */
const DeskingHistoryModal = ({ show, onHide, compNo, pkgSeq, onLoad }) => {
    const dispatch = useDispatch();
    const { total, list, search, detail } = useSelector(({ issue }) => issue.deskingHistory);
    const { loading, detailLoading } = useSelector(({ loading }) => ({
        loading: loading[GET_ISSUE_DESKING_HISTORY_LIST],
        detailLoading: loading[GET_ISSUE_DESKING_HISTORY],
    }));
    const [rowData, setRowData] = useState([]);
    const [dRowData, setDRowData] = useState([]);
    const [selected, setSelected] = useState({});
    const [searchDt, setSearchDt] = useState(null);

    /**
     * row clicked
     * @param {object} data row Data
     */
    const handleRowClicked = (data) => {
        setSelected(data);
        dispatch(
            getIssueDeskingHistory({
                compNo,
                pkgSeq,
                regDt: data.regDt,
                status: DESK_STATUS_PUBLISH,
                approvalYn: data.approvalYn,
            }),
        );
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        const ns = { ...search, page: key !== 'page' ? 0 : value, [key]: value, searchDt: moment(searchDt).format(DB_DATEFORMAT) };
        dispatch(getIssueDeskingHistoryList({ search: ns }));
    };

    useEffect(() => {
        if (show) {
            const newDt = moment(new Date()).startOf('day');
            dispatch(
                getIssueDeskingHistoryList({
                    search: {
                        ...initialState.deskingHistory.search,
                        pkgSeq,
                        compNo,
                        searchDt: newDt.format(DB_DATEFORMAT),
                    },
                }),
            );
            setSearchDt(newDt);
        } else {
            dispatch(clearIssueDeskingHistory());
        }
    }, [compNo, dispatch, pkgSeq, show]);

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
                displayRegDt: moment(data.regDt, moment.ISO_8601).format(DB_DATEFORMAT),
                worker: `${data.regNm}(${data.regId})`,
                onClick: (rowData) => {
                    messageBox.confirm(
                        '현재 작업 중인 목록이 히스토리 목록으로 변경됩니다.\n변경하시겠습니까?',
                        () => {
                            if (selected.regDt !== rowData.regDt) {
                                dispatch(
                                    getIssueDeskingHistory({
                                        compNo,
                                        pkgSeq,
                                        approvalYn: rowData.approvalYn,
                                        regDt: rowData.regDt,
                                        status: DESK_STATUS_PUBLISH,
                                        callback: ({ header, body }) => {
                                            if (header.success) {
                                                setSelected(rowData);
                                                onLoad(body.issueDeskings);
                                            }
                                        },
                                    }),
                                );
                            } else {
                                onLoad(detail.issueDeskings);
                            }
                        },
                        () => {},
                    );
                },
            })),
        );
    }, [compNo, selected, dispatch, list, onLoad, pkgSeq, detail]);

    useEffect(() => {
        if (detail?.issueDeskings) {
            setDRowData(
                detail.issueDeskings.map((d) => ({
                    ...d,
                    id: `${d.contentsId}-${common.getUniqueKey()}`,
                })),
            );
        } else {
            setDRowData([]);
        }
    }, [detail.issueDeskings]);

    return (
        <MokaModal title="히스토리" show={show} onHide={onHide} size="lg" width={850} height={550} centered>
            <Row className="h-100" noGutters>
                <Col sm={6} className="h-100 pr-12 d-flex flex-column">
                    <div className="d-flex mb-14">
                        <MokaInput
                            as="dateTimePicker"
                            inputProps={{ timeFormat: null, timeDefault: 'start' }}
                            className="mr-2"
                            value={searchDt}
                            onChange={(date) => {
                                if (typeof date === 'object') setSearchDt(date);
                                else if (date === '') setSearchDt(null);
                            }}
                        />
                        <Button className="flex-shrink-0" variant="searching" onClick={() => handleChangeSearchOption({ key: 'page', value: 0 })}>
                            검색
                        </Button>
                    </div>
                    <MokaTable
                        rowData={rowData}
                        className="overflow-hidden flex-fill"
                        total={total}
                        page={search.page}
                        size={search.size}
                        onRowNodeId={(data) => data.regDt}
                        onRowClicked={handleRowClicked}
                        onChangeSearchOption={handleChangeSearchOption}
                        columnDefs={columnDefs}
                        displayPageNum={2}
                        pageSize={S_MODAL_PAGESIZE_OPTIONS}
                        loading={loading}
                        preventRowClickCell={['load']}
                        selected={selected.regDt}
                        enableBrowserTooltips
                    />
                </Col>
                <Col sm={6} className="pl-12 h-100">
                    <MokaTable
                        className="h-100"
                        rowData={dRowData}
                        columnDefs={detailColumnDefs}
                        onRowNodeId={(data) => data.id}
                        paging={false}
                        loading={detailLoading}
                        enableBrowserTooltips
                    />
                </Col>
            </Row>
        </MokaModal>
    );
};

DeskingHistoryModal.propTypes = propTypes;
DeskingHistoryModal.defaultProps = defaultProps;

const columnDefs = [
    {
        headerName: 'No',
        field: 'rownum',
        width: 50,
    },
    {
        headerName: '전송일시',
        field: 'displayRegDt',
        width: 125,
        cellClassRules: {
            'text-positive': ({ data }) => data.approvalYn === 'N', // 예약 데이터
        },
    },
    {
        headerName: '작업자',
        field: 'worker',
        tooltipField: 'worker',
        width: 70,
        flex: 1,
    },
    {
        headerName: '불러오기',
        field: 'load',
        width: 60,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-file-import', overlayText: '불러오기' },
    },
];

const detailColumnDefs = [
    {
        headerName: 'No',
        field: 'contentsOrd',
        width: 30,
    },
    {
        headerName: '제목',
        field: 'title',
        tooltipValueGetter: (params) => unescapeHtmlArticle(params.data.title || ''),
        flex: 1,
        valueGetter: (params) => unescapeHtmlArticle(params.data.title || ''),
    },
];

export default DeskingHistoryModal;
