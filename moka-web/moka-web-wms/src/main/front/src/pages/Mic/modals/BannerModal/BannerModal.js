import React, { useState, useCallback, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { invalidListToError } from '@utils/convertUtil';
import { initialState, getMicBannerListModal, putMicBannerToggle, saveMicBanner, GET_MIC_BANNER_LIST_MODAL, SAVE_MIC_BANNER } from '@store/mic';
import { MokaModal, MokaTable } from '@components';
import BannerForm from './BannerForm';
import columnDefs from './BannerModalColumns';

/**
 * 다른 주제 공통 배너 모달
 */
const BannerModal = (props) => {
    const { show, onHide } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_MIC_BANNER_LIST_MODAL]);
    const formLoading = useSelector(({ loading }) => loading[SAVE_MIC_BANNER]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState(initialState.banner.search);
    const [instance, setInstance] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selected, setSelected] = useState({});
    const [error, setError] = useState({});

    /**
     * 사용여부 변경
     */
    const handleChangeUsedYn = useCallback(
        (banner) => {
            if (banner) {
                dispatch(
                    putMicBannerToggle({
                        bnnrSeq: banner.bnnrSeq,
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success(header.message);
                                setEditMode(false);
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
        setSelected({});
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
        console.log(instance);
        setSelected(row);
        setEditMode(true);
    };

    /**
     * 수정/등록 취소
     */
    const handleClickCancel = () => {
        setEditMode(false);
        setSelected({});
    };

    /**
     * validate
     * @param {object} banner banner 데이터
     */
    const validate = (banner) => {
        let isInvalid = false;
        let errList = [];

        // 이미지 필수
        if ((!banner.imgLink || !REQUIRED_REGEX.test(banner.imgLink)) && !banner.imgFile) {
            errList.push({
                field: 'imgLink',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }
        // 링크 필수
        if (!banner.linkUrl || !REQUIRED_REGEX.test(banner.linkUrl)) {
            errList.push({
                field: 'linkUrl',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        setError(invalidListToError(errList));
        return !isInvalid;
    };

    /**
     * 저장
     * @param {object} banner banner 데이터
     */
    const handleSave = (banner) => {
        if (validate(banner)) {
            dispatch(
                saveMicBanner({
                    banner: {
                        ...banner,
                        onChangeUsedYn: undefined,
                    },
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                            getList(search);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 등록
     */
    const handleAdd = () => {
        setEditMode(true);
        setSelected({});
    };

    useEffect(() => {
        if (show) {
            getList(initialState.banner.search);
        }
    }, [show, getList]);

    return (
        <MokaModal title="다른 주제 공통 배너 관리" height={685} show={show} onHide={handleHide} size="lg" centered>
            <Container className="p-0 h-100" fluid>
                <Row className="m-0 h-100">
                    <Col className="p-0 d-flex flex-column h-100 overflow-hidden flex-shrink-0" style={{ minWidth: 450 }}>
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
                            setGridInstance={setInstance}
                        />
                    </Col>
                    {!!editMode && (
                        <Col className="p-0">
                            <BannerForm banner={selected} onCancle={handleClickCancel} loading={formLoading} onSave={handleSave} error={error} setError={setError} />
                        </Col>
                    )}
                </Row>
            </Container>
        </MokaModal>
    );
};

export default BannerModal;
