import React, { useState, useEffect } from 'react';
import { MokaCard, MokaTable } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import { channelEpisodeColumnDefs } from './ChannelListAgGridColumns';
import { useSelector } from 'react-redux';
import { initialState, GET_CHNL_EPSD_LIST } from '@store/jpod';

/**
 * J팟관리 > 채널 > 에피소드
 */
const ChannelEpisode = () => {
    const loading = useSelector(({ loading }) => loading[GET_CHNL_EPSD_LIST]);
    const { list, channel } = useSelector(({ jpod }) => ({
        list: jpod.channel.channelEpisode.list,
        channel: jpod.channel.channel,
    }));
    const [episodeStat, setEpisodeStat] = useState(initialState.channel.channel.episodeStat);
    const [episodeTitle, setEpisodeTitle] = useState('');
    const [rowData, setRowData] = useState([]);

    /**
     * row 클릭
     * @param {object} data rowData
     */
    const handleRowClicked = (data) => {
        // 별도 액션 없음
        // window.open(`/jpod-episode/${data.chnlSeq}/${data.epsdSeq}`);
    };

    useEffect(() => {
        setEpisodeTitle(channel?.chnlNm);
        setEpisodeStat(channel?.episodeStat);
    }, [channel]);

    useEffect(() => {
        setRowData(
            list.map((li) => ({
                ...li,
                seasonNo: `시즌${li.seasonNo > 0 ? li.seasonNo : ''}`,
                playTime: (li.playTime || '').slice(0, 5),
            })),
        );
    }, [list]);

    return (
        <MokaCard className="w-100 flex-fill" bodyClassName="d-flex flex-column" title={`${episodeTitle} 에피소드 목록`}>
            <Form.Row className="d-flex justify-content-between mb-14">
                <Col xs={6} className="pl-0 d-flex align-items-center">
                    <Form.Label className="mb-0">{`등록된 에피소드: 사용(${episodeStat.usedCnt}) 중지(${episodeStat.unusedCnt})`}</Form.Label>
                </Col>
                <Col xs={6} className="d-flex justify-content-end pr-0">
                    <Button variant="searching" onClick={(e) => window.open('/jpod-episode')} className="mr-1">
                        에피소드 목록
                    </Button>
                    <Button variant="positive" onClick={(e) => window.open('/jpod-episode/add')}>
                        에피소드 등록
                    </Button>
                </Col>
            </Form.Row>

            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={channelEpisodeColumnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.epsdSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                paging={false}
            />
        </MokaCard>
    );
};

export default ChannelEpisode;
