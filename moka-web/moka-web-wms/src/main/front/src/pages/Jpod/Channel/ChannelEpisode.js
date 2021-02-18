import React, { useState, useEffect } from 'react';
import { MokaCard, MokaTable } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
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
        <MokaCard
            className="overflow-hidden flex-fill w-100"
            title={`${episodeTitle} 에피소드 목록`}
            titleClassName="mb-0"
            loading={false}
            footerClassName="d-flex justify-content-center"
        >
            <Form>
                <Form.Row className="d-flex mb-3">
                    <Col xs={9}>{`등록된 에피소드: 사용(${episodeStat.usedCnt}) 중지(${episodeStat.unusedCnt})`}</Col>
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
            <Row>
                <MokaTable
                    className="overflow-hidden flex-fill"
                    columnDefs={channelEpisodeColumnDefs}
                    rowData={rowData}
                    localeText={{ noRowsToShow: '에피소드가 없습니다.', loadingOoo: '조회 중입니다..' }}
                    rowHeight={80}
                    onRowNodeId={(data) => data.epsdSeq}
                    onRowClicked={(e) => handleClickListRow(e)}
                    loading={loading}
                    paging={false}
                    displayPageNum={DISPLAY_PAGE_NUM}
                    onChangeSearchOption={handleChangeSearchOption}
                    selected={selectEpsdSeq}
                />
            </Row>
        </MokaCard>
    );
};

export default ChannelEpisode;
