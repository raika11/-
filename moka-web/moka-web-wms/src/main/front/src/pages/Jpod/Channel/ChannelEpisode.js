import React, { useState } from 'react';
import { MokaCard, MokaIconTabs, MokaLoader, MokaTable } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import { channelEpisodeColumnDefs } from './ChannelListAgGridColumns';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DISPLAY_PAGE_NUM } from '@/constants';

import { GET_CHANNELS, changeJpodSearchOption, getChannels, getChannelInfo, clearChannelInfo } from '@store/jpod';

const ChannelEpisode = ({ match }) => {
    const [rowData, setRowData] = useState([]);
    const { search, list, loading, total } = useSelector((store) => ({
        search: store.jpod.channel.jpod.search,
        list: store.jpod.channel.jpod.list,
        total: store.jpod.channel.jpod.total,
        loading: store.loading[GET_CHANNELS],
    }));

    const handleClickListRow = () => {};
    const handleChangeSearchOption = () => {};
    return (
        <MokaCard className="overflow-hidden flex-fill w-100" title={`에피소드 목록`} titleClassName="mb-0" loading={false} footerClassName="d-flex justify-content-center">
            <Form>
                <Form.Row className="d-flex mb-3">
                    <Col xs={9}>등록된 에피소드: 사용(201) 중지(1)</Col>
                    <Col xs={3}>
                        <Row>
                            <Col xs={6}>
                                <Button variant="searching" onClick={(e) => console.log(e)}>
                                    에피소드 목록
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button variant="positive" onClick={(e) => console.log(e)} className="pr-1">
                                    에피소드 등록
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Form.Row>
            </Form>

            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={channelEpisodeColumnDefs}
                rowData={rowData}
                rowHeight={80}
                onRowNodeId={(data) => data.chnlSeq}
                onRowClicked={(e) => handleClickListRow(e)}
                loading={loading}
                paging={false}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={DISPLAY_PAGE_NUM}
                onChangeSearchOption={handleChangeSearchOption}
                selected={0}
            />
        </MokaCard>
    );
};

export default ChannelEpisode;
