import React, { useEffect, useState, useCallback } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaSearchInput, MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './RepoterModalGridColumns';
import { GET_REPORTER_LIST, getReporterList, clearReporter, changeReporterSearchOption } from '@store/jpod';
import { useSelector, useDispatch } from 'react-redux';

const RepoterModal = (props) => {
    const dispatch = useDispatch();

    const { total, list, search, loading } = useSelector((store) => ({
        total: store.jpod.channel.reporter.total,
        list: store.jpod.channel.reporter.list,
        search: store.jpod.channel.reporter.search,
        loading: store.loading[GET_REPORTER_LIST],
    }));

    const { show, onHide } = props;
    const [rowData, setRowData] = useState([]);

    const [searchData, setSearchData] = useState(search);

    const handleClickHide = () => {
        onHide();
    };

    const handleClickListRow = () => {
        // history.push(`${match.path}/${channelId}`);
    };

    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...searchData, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            setRowData([]);
            setSearchData(temp);
            dispatch(changeReporterSearchOption(temp));
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
                selected={null}
            />
        </MokaModal>
    );
};

export default RepoterModal;
