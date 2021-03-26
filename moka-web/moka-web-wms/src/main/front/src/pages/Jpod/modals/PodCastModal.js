import React, { useEffect, useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { MokaModal, MokaTable } from '@components';
import { columnDefs } from './PodCastModalGridColumns';
import { useSelector, useDispatch } from 'react-redux';
import { GET_BRIGHT_OVP, getBrightOvp, clearBrightOvp, selectBrightovp, changeBrightovpSearchOption } from '@store/jpod';
import PodCastUploadModal from './PodCastUploadModal';
import { DISPLAY_PAGE_NUM } from '@/constants';

/**
 * J팟 관리 > 에피소드 > 팟 캐스트 모달
 * 파일 업로드(브라이트코브에 업로드)
 */
const PodCastModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide, epsdNm } = props;
    const [rowData, setRowData] = useState([]);

    const [podCastUploadModalState, setPodCastUploadModalState] = useState(false);

    const { list, total, loading, search } = useSelector((store) => ({
        list: store.jpod.brightOvp.list,
        search: store.jpod.brightOvp.search,
        total: store.jpod.brightOvp.total,
        loading: store.loading[GET_BRIGHT_OVP],
    }));

    // 새로고침 버튼 클릭.
    const handleClickReload = () => {
        setRowData([]);
        dispatch(clearBrightOvp());
        dispatch(getBrightOvp());
    };

    // 닫기 버튼
    const handleClickHide = () => {
        onHide();
    };

    // 목록 클릭 store 를 업데이트후 모달창 닫기.
    const handleClickListRow = (e) => {
        dispatch(selectBrightovp(e));
        onHide();
    };

    // 업로드 버큰 클릭.
    const handleClickUploadButton = () => {
        setPodCastUploadModalState(true);
    };
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            setRowData([]);
            dispatch(changeBrightovpSearchOption(temp));
            dispatch(getBrightOvp());
        },
        [dispatch, search],
    );

    // 모달창이 열리면 팟캐스트 목록 가져오고, 닫으면 목록 초기화.
    useEffect(() => {
        if (show === true) {
            dispatch(getBrightOvp());
        } else {
            dispatch(clearBrightOvp());
        }
        // show 값이 변경 되었을때만 처리.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        const initGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    let regDt = element.created_at && element.created_at.length > 10 ? element.created_at.substr(0, 10) : element.created_at;
                    return {
                        id: element.id,
                        name: element.name,
                        state: element.state,
                        regDt: regDt,
                    };
                }),
            );
        };

        if (list.length > 0) {
            initGridRow(list);
        }
    }, [list]);

    return (
        <>
            <MokaModal
                width={900}
                show={show}
                onHide={handleClickHide}
                title={`브라이트 코브 등록`}
                size="xl"
                bodyClassName="overflow-x-hidden custom-scroll d-flex flex-column"
                footerClassName="d-flex justify-content-center"
                draggable
            >
                <Form>
                    <Form.Row className="d-flex mb-3 d-flex justify-content-end">
                        <div className="mr-0 pl-1 pr-2">
                            <Button variant="outline-neutral" onClick={() => handleClickReload()}>
                                새로고침
                            </Button>
                        </div>
                        <div className="mr-0 pl-1 pr-2">
                            <Button variant="positive" onClick={() => handleClickUploadButton()}>
                                업로드
                            </Button>
                        </div>
                    </Form.Row>
                </Form>
                <MokaTable
                    className="overflow-hidden flex-fill"
                    columnDefs={columnDefs}
                    rowData={rowData}
                    // rowHeight={50}
                    onRowNodeId={(data) => data.id}
                    onRowClicked={(e) => handleClickListRow(e)}
                    loading={loading}
                    paging={true}
                    preventRowClickCell={['shareUrl']}
                    oading={loading}
                    total={total}
                    page={list.page}
                    size={list.size}
                    displayPageNum={DISPLAY_PAGE_NUM}
                    onChangeSearchOption={handleChangeSearchOption}
                    selected={null}
                />

                <PodCastUploadModal
                    show={podCastUploadModalState}
                    epsdNm={epsdNm}
                    onHide={() => {
                        setPodCastUploadModalState(false);
                    }}
                />
            </MokaModal>
        </>
    );
};

export default PodCastModal;
