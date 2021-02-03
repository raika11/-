import React, { useState, useCallback, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';
import { initialState, getMicBannerListModal, saveMicBanner, GET_MIC_BANNER_LIST_MODAL, SAVE_MIC_BANNER } from '@store/mic';
import { MokaCard, MokaImageInput, MokaInputLabel, MokaModal, MokaTable } from '@/components';
import columnDefs from './BannerModalAgGridColumns';

/**
 * 다른 주제 공통 배너 모달
 */
const BannerModal = (props) => {
    const { show, onHide } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_MIC_BANNER_LIST_MODAL]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState(initialState.banner.search);
    const [rowData, setRowData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selected, setSelected] = useState(null);

    /**
     * 사용여부 변경
     */
    const handleChangeUsedYn = useCallback(
        (banner) => {
            if (banner) {
                dispatch(
                    saveMicBanner({
                        banner,
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success(header.message);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            }
        },
        [dispatch],
    );

    /**
     * 배너 리스트 조회
     */
    const getList = useCallback(
        (search) => {
            dispatch(
                getMicBannerListModal({
                    search,
                    callback: ({ header, body }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        } else {
                            setRowData(
                                body.list.map((data) => ({
                                    ...data,
                                    regDt: (data.regDt || '').slice(0, -3),
                                    onChangeUsedYn: handleChangeUsedYn,
                                })),
                            );
                            setTotal(body.totalCnt);
                        }
                    },
                }),
            );
        },
        [dispatch, handleChangeUsedYn],
    );

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let ns = { ...search, [key]: value };
            if (key !== 'page') {
                ns['page'] = 0;
            }
            setSearch(ns);
            getList(ns);
        },
        [search, getList],
    );

    /**
     * 모달 닫기
     */
    const handleHide = useCallback(() => {
        setEditMode(false);
        setSelected(null);
        setTotal(0);
        setRowData([]);
        setSearch(initialState.banner.search);
        onHide();
    }, [onHide]);

    /**
     * 테이블 row 클릭
     * @param {object} row rowData
     */
    const handleRowClicked = (row) => {
        setSelected(row);
        setEditMode(true);
    };

    /**
     * 수정/등록 취소
     */
    const handleClickCancel = () => {
        setEditMode(false);
        setSelected(null);
    };

    /**
     * 등록
     */
    const handleAdd = () => {
        setEditMode(true);
        setSelected(null);
    };

    useEffect(() => {
        if (show) {
            getList(initialState.banner.search);
        }
    }, [show, getList]);

    return (
        <MokaModal title="다른 주제 공통 배너 관리" height={685} show={show} onHide={handleHide} size="xl" centered>
            <Container className="p-0 h-100" fluid>
                <Row className="m-0 h-100">
                    <Col className="p-0 d-flex flex-column h-100 overflow-hidden flex-shrink-0" style={{ minWidth: 500 }}>
                        <div className="mb-2 d-flex justify-content-end">
                            <Button variant="positive" onClick={handleAdd}>
                                등록
                            </Button>
                        </div>
                        <MokaTable
                            className="overflow-hidden flex-fill"
                            columnDefs={columnDefs}
                            rowData={rowData}
                            rowHeight={100}
                            onRowNodeId={(data) => data.bnnrSeq}
                            onRowClicked={handleRowClicked}
                            loading={loading}
                            total={total}
                            page={search.page}
                            size={search.size}
                            selected={selected?.bnnrSeq}
                            onChangeSearchOption={handleChangeSearchOption}
                            preventRowClickCell={['usedYn']}
                        />
                    </Col>
                    {!!editMode && (
                        <Col className="p-0">
                            <MokaCard
                                title={selected?.bnnrSeq ? '공통 배너 수정' : '공통 배너 등록'}
                                className="shadow-none w-100 h-100"
                                footerClassName="justify-content-center"
                                footer
                                footerButtons={[
                                    { text: selected ? '수정' : '저장', variant: 'positive', className: 'mr-2' },
                                    { text: '취소', variant: 'negative', onClick: handleClickCancel },
                                ]}
                            >
                                <div className="mb-2 d-flex align-items-end">
                                    <MokaImageInput className="mr-2" width={280} />
                                    <div>
                                        <Button variant="outline-neutral">내 PC</Button>
                                    </div>
                                </div>
                                <MokaInputLabel label="링크 주소" value={''} onChange={(e) => {}} />
                            </MokaCard>
                        </Col>
                    )}
                </Row>
            </Container>
        </MokaModal>
    );
};

export default BannerModal;
