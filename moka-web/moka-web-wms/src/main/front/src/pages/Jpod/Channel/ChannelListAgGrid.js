import React, { useEffect, Suspense, useState } from 'react';
import { MokaTable } from '@components';
import { DISPLAY_PAGE_NUM } from '@/constants';
import { columnDefs } from './ChannelListAgGridColumns';
import { tempChannelList } from '@pages/Jpod/JpodConst';
import ImageRenderer from './ImageRenderer';
import { useHistory } from 'react-router-dom';

const ChannelListAgGrid = ({ match }) => {
    const history = useHistory();
    const [rowData, setRowData] = useState([]);
    const loading = false;
    const t_commentSeq = 121213;

    const handleClickListRow = ({ channelId }) => {
        history.push(`${match.path}/${channelId}`);
    };
    const handleChangeSearchOption = () => {};

    useEffect(() => {
        setRowData(
            tempChannelList.list.map((element) => {
                let startDt = element.startDt && element.startDt.length > 10 ? element.startDt.substr(0, 10) : element.startDt;

                return {
                    channelId: element.channelId,
                    startDt: startDt,
                    image: element.image,
                    name: element.name,
                    bio: element.bio,
                    roundinfo: `${element.roundinfo.total}/${element.roundinfo.round}`,
                    subscribe: element.subscribe,
                };
            }),
        );
    }, []);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={80}
            onRowNodeId={(data) => data.channelId}
            onRowClicked={(e) => handleClickListRow(e)}
            loading={loading}
            total={tempChannelList.total}
            page={tempChannelList.page}
            size={tempChannelList.size}
            displayPageNum={DISPLAY_PAGE_NUM}
            onChangeSearchOption={handleChangeSearchOption}
            selected={t_commentSeq}
            frameworkComponents={{ ImageRenderer: ImageRenderer }}
        />
    );
};

export default ChannelListAgGrid;
