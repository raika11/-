import React, { useState, useEffect } from 'react';
import { MokaCard, MokaTable } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import { channelEpisodeColumnDefs } from './ChannelListAgGridColumns';
import { useSelector } from 'react-redux';
import { DISPLAY_PAGE_NUM } from '@/constants';

import { initialState, GET_CH_EPISODES } from '@store/jpod';

const ChannelEpisode = () => {
    const [rowData, setRowData] = useState([]);
    const [episodeTitle, setEpisodeTitle] = useState('');
    const [selectEpsdSeq, setSelectEpsdSeq] = useState(null);
    const [episodeStat, setEpisodeStat] = useState({
        lastEpsoNo: null,
        unusedCnt: 0,
        usedCnt: 0,
    });
    const { loading, list, channelInfo } = useSelector((store) => ({
        list: store.jpod.channel.channelInfoEpisode.list,
        channelInfo: store.jpod.channel.channelInfo,
        loading: store.loading[GET_CH_EPISODES],
    }));

    const handleClickListRow = (e) => {
        setSelectEpsdSeq(e.epsdSeq);
    };

    // 목록이 4개 까지만 가지고 오기 떄문에 페이징 처리는 안하는걸로.
    const handleChangeSearchOption = () => {};

    useEffect(() => {
        const setGridRow = (data) => {
            setRowData([]);
            setRowData(
                data.map((e) => {
                    return {
                        epsdSeq: e.epsdSeq,
                        epsdNo: e.epsdNo,
                        epsdNm: e.epsdNm,
                        epsdMemo: e.epsdMemo,
                        epsdDate: e.epsdDate,
                        playTime: e.playTime,
                        usedYn: e.usedYn,
                    };
                }),
            );
        };

        // 로딩이 끝났을떄.
        loading === false && setGridRow(list);
    }, [list, loading]);

    useEffect(() => {
        if (channelInfo !== initialState.channel.channelInfo) {
            setEpisodeTitle(channelInfo.chnlNm);
            setEpisodeStat(channelInfo.episodeStat);
        }
    }, [channelInfo]);

    return (
        <div className="d-flex">
            <MokaCard className="flex-fill" title={`${episodeTitle} 에피소드 목록`} loading={false} footerClassName="d-flex justify-content-center">
                <Form>
                    <Form.Row className="d-flex justify-content-between mb-2">
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
                </Form>
                <Form.Row>
                    <MokaTable
                        className="overflow-hidden flex-fill"
                        columnDefs={channelEpisodeColumnDefs}
                        rowData={rowData}
                        localeText={{ noRowsToShow: '에피소드가 없습니다.', loadingOoo: '조회 중입니다..' }}
                        rowHeight={80}
                        agGridHeight={630}
                        onRowNodeId={(data) => data.epsdSeq}
                        onRowClicked={(e) => handleClickListRow(e)}
                        loading={loading}
                        paging={false}
                        displayPageNum={DISPLAY_PAGE_NUM}
                        onChangeSearchOption={handleChangeSearchOption}
                        selected={selectEpsdSeq}
                    />
                </Form.Row>
            </MokaCard>
        </div>
    );
};

export default ChannelEpisode;
