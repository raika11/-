import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { MODAL_PAGESIZE_OPTIONS, DB_DATEFORMAT } from '@/constants';
import { messageBox } from '@utils/toastUtil';
import { initialState, GET_PODCAST_LIST, getPodcastList, clearPodcast, changePodcastSearchOption } from '@store/jpod';
import { MokaModal, MokaTable } from '@components';
import PodcastUploadModal from './PodcastUploadModal';
import { columnDefs } from './PodcastModalColumns';

/**
 * J팟 관리 > 에피소드 > 팟 캐스트 모달
 * 파일 업로드(브라이트코브에 업로드)
 */
const PodcastModal = (props) => {
    const { show, onHide, onRowClicked, selectedChannel } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_PODCAST_LIST]);
    const { list, total, search } = useSelector(({ jpod }) => jpod.podcast);
    const [rowData, setRowData] = useState([]);
    const [uploadShow, setUploadShow] = useState(false);

    /**
     * 새로고침
     */
    const handleReload = () => {
        dispatch(changePodcastSearchOption(initialState.podcast.search));
        dispatch(getPodcastList({ search: initialState.podcast.search }));
    };

    /**
     * 닫기
     */
    const handleHide = useCallback(() => {
        onHide();
    }, [onHide]);

    /**
     * row 클릭
     */
    const handleRowClicked = useCallback(
        (podcast) => {
            onRowClicked(podcast);
            handleHide();
        },
        [handleHide, onRowClicked],
    );

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') temp['page'] = 0;

            dispatch(changePodcastSearchOption(temp));
            dispatch(getPodcastList({ search: temp }));
        },
        [dispatch, search],
    );

    useEffect(() => {
        if (show) {
            dispatch(
                getPodcastList({
                    search,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearPodcast());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, show]);

    useEffect(() => {
        setRowData(
            list.map((data, idx) => {
                return {
                    ...data,
                    idx: `${data.id}_${idx}`,
                    stateText: data.state === 'ACTIVE' ? '정상' : '대기',
                    regDt: moment(data.regDt, DB_DATEFORMAT).format('YYYY-MM-DD LTS'),
                    onClick: handleRowClicked,
                };
            }),
        );
    }, [list, handleRowClicked]);

    return (
        <MokaModal
            width={750}
            show={show}
            onHide={handleHide}
            title="팟캐스트 등록"
            size="lg"
            bodyClassName="overflow-x-hidden custom-scroll d-flex flex-column"
            id="podcast-modal"
            centered
        >
            <Form.Row className="d-flex mb-14 d-flex justify-content-end">
                <Button variant="outline-neutral" className="mr-1 flex-shrink-0" onClick={() => handleReload()}>
                    새로고침
                </Button>
                <Button variant="positive" className="flex-shrink-0" onClick={() => setUploadShow(true)}>
                    업로드
                </Button>
                <PodcastUploadModal show={uploadShow} onHide={() => setUploadShow(false)} selectedChannel={selectedChannel} />
            </Form.Row>

            <MokaTable
                agGridHeight={450}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.idx}
                loading={loading}
                total={total}
                page={list.page}
                size={list.size}
                pageSizes={MODAL_PAGESIZE_OPTIONS}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </MokaModal>
    );
};

export default PodcastModal;
