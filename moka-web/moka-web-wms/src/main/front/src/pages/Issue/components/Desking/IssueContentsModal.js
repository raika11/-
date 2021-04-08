import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, GET_ISSUE_CONTENTS_LIST_MODAL, getIssueContentsListModal } from '@store/issue';
import { MokaModal, MokaTable } from '@components';

const columnDefs = [
    {
        headerName: '',
        width: 64,
        field: '등록',
        cellRenderer: 'buttonRenderer',
    },
    {
        headerName: 'ID',
        width: 70,
        field: 'totalId',
        cellClass: 'user-select-text',
    },
    {
        headerName: '제목',
        field: 'artTitle',
        tooltipField: 'artTitle',
        flex: 1,
    },
];

/**
 * 홈 섹션편집 > 패키지 목록 > AgGrid > 이슈 컨텐츠 조회 모달
 */
const IssueContentsModal = ({ show, onHide, pkg }) => {
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_ISSUE_CONTENTS_LIST_MODAL]);
    const [list, setList] = useState([]);

    /**
     * 닫기
     */
    const handleHide = () => {
        setList([]);
        onHide();
    };

    useEffect(() => {
        if (show && pkg.pkgSeq) {
            dispatch(
                getIssueContentsListModal({
                    search: { ...initialState.contentsSearch, pkgSeq: pkg.pkgSeq },
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setList(body.list);
                        }
                    },
                }),
            );
        }
    }, [show, pkg.pkgSeq, dispatch]);

    return (
        <MokaModal show={show} onHide={handleHide} title={pkg.pkgTitle} loading={loading} width={600} height={400} bodyClassName="d-flex flex-column" centered>
            <MokaTable columnDefs={columnDefs} rowData={list} onRowNodeId={(art) => art.totalId} className="flex-fill" paging={false} />
        </MokaModal>
    );
};

export default IssueContentsModal;
