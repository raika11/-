import React, { useEffect, useState, useCallback } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaCard, MokaInputLabel, MokaInput, MokaSearchInput } from '@components';
import { blockReason } from '@pages/CommentManage/CommentConst';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './RepoterModalGridColumns';
import { tempRepoterList } from '@pages/Jpod/JpodConst';

import { GET_REPORTER_LIST, getReporterList, clearReporter, changeReporterSearchOption } from '@store/jpod';

import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

/**
 * ModalBody로 Input 한개 있는 Modal
 */
const RepoterModal = (props) => {
    const dispatch = useDispatch();

    const { total, list, search, loading } = useSelector((store) => ({
        total: store.jpod.channel.reporter.total,
        list: store.jpod.channel.reporter.list,
        search: store.jpod.channel.reporter.search,
        loading: store.loading[GET_REPORTER_LIST],
    }));

    const { show, onHide, inputData, onSave, ModalUsage } = props;
    const [data, setData] = useState({ title: '', value: '', isInvalid: false });
    const [rowData, setRowData] = useState([]);

    const [searchData, setSearchData] = useState(search);

    const t_commentSeq = null;

    /**
     * 닫기
     */
    const handleClickHide = () => {
        // setData({ title: '', value: '', isInvalid: false });
        onHide();
    };

    /**
     * input 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setData({
            ...data,
            value: e.target.value,
        });
    };

    /**
     * 저장 버튼 클릭 이벤트
     */
    const handleClickSave = () => {
        onSave(data, invalidCheckCallback);
    };

    const invalidCheckCallback = (isInvalid) => {
        setData({ ...data, isInvalid });
    };

    /**
     * inputData 값 변경
     */
    useEffect(() => {
        setData(inputData);
    }, [inputData]);

    const handleClickListRow = ({ channelId }) => {
        // history.push(`${match.path}/${channelId}`);
    };

    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...searchData, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            setRowData([]);
            dispatch(changeReporterSearchOption(searchData));
            dispatch(getReporterList());
        },
        [dispatch, searchData],
    );

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...search,
            [name]: value,
        });
    };

    const handleClickSearchButton = () => {
        setRowData([]);
        dispatch(changeReporterSearchOption(searchData));
        dispatch(getReporterList());
    };

    useEffect(() => {
        const initGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    return {
                        repoterInfo: {
                            memRepSeq: element.repSeq,
                            joinsId: element.joinsId,
                            memNm: element.repName,
                            repTitle: element.repTitle,
                            nickNm: '',
                            memMemo: '',
                        },
                        repoterSeq: element.repSeq,
                        repoterId: element.joinsId,
                        repoterImage: element.repImg,
                        repoterName: element.repName,
                        repoterBelong: element.r1CdNm,
                        repoterRepTitle: element.repTitle,
                        repoterRepEmail: element.repEmail1,
                    };
                }),
            );
        };

        if (list) {
            initGridRow(list);
        }
    }, [list]);

    useEffect(() => {
        if (show === true) {
            dispatch(getReporterList());
        } else {
            dispatch(clearReporter());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <MokaModal
            width={800}
            show={show}
            onHide={handleClickHide}
            title={`기자 검색`}
            size="xl"
            bodyClassName="overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            buttons={[{ text: '닫기', variant: 'negative', onClick: handleClickHide }]}
            draggable
        >
            <Form>
                <Form.Row className="d-flex mb-3">
                    <Col xs={4}>
                        <MokaSearchInput
                            id="keyword"
                            name="keyword"
                            placeholder={'기자명을 입력해 주세요.'}
                            value={searchData.keyword}
                            onChange={(e) => handleSearchChange(e)}
                            onSearch={() => handleClickSearchButton()}
                        />
                    </Col>
                    <Col xs={1} className="mr-0">
                        {/* <Button variant="outline-neutral" onClick={() => handleClickSearchResetButton()}>
                            초기화
                        </Button> */}
                    </Col>
                </Form.Row>
            </Form>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={50}
                onRowNodeId={(data) => data.channelId}
                onRowClicked={(e) => handleClickListRow(e)}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={DISPLAY_PAGE_NUM}
                onChangeSearchOption={(e) => handleChangeSearchOption(e)}
                selected={t_commentSeq}
            />
        </MokaModal>
    );
};

export default RepoterModal;
