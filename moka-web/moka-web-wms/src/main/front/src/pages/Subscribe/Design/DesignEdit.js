import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { MokaCard, MokaCardTabs } from '@components';
import { messageBox } from '@utils/toastUtil';
import DesignStep1Form from '../components/DesignStep1Form/index';
import ChangeCommentModal from '../modals/ChangeCommentModal';

// 채널타입 관리 방법 정해야함
const CHANNEL_TYPE = [
    {
        code: 'HOME',
        name: '중앙일보',
    },
    {
        code: 'ARTPKG',
        name: '기사패키지',
    },
    {
        code: 'REPORTER',
        name: '기자',
    },
    {
        code: 'PKG',
        name: '이슈패키지',
    },
    {
        code: 'LETTER',
        name: '뉴스레터',
    },
    {
        code: 'JPOD',
        name: 'J팟',
    },
    {
        code: 'URL',
        name: '개별페이지URL',
    },
];

/**
 * 구독 관리 > 구독 설계 > 등록, 수정
 */
const DesignEdit = ({ match }) => {
    const { scbNo } = useParams();
    const history = useHistory();
    const [activeKey, setActiveKey] = useState(0);
    const [temp, setTemp] = useState({
        channelType: CHANNEL_TYPE[0].code,
        artView: 'Y',
        reserveYn: 'N',
    });
    const [commentModalShow, setCommentModalShow] = useState(false);

    /**
     * 구독 임시데이터 변경
     * @param {object} newData 변경 데이터
     * @param {boolean} reset newData를 spread로 넣을지 말지
     */
    const handleChangeValue = (newData, reset = false) => {
        setTemp(reset ? newData : { ...temp, ...newData });
    };

    /**
     * 취소
     */
    const handleCancle = () => {
        history.push(match.path);
    };

    return (
        <MokaCard
            title={`구독 ${scbNo ? '수정' : '등록'}`}
            className="w-100"
            headerClassName="pb-0"
            bodyClassName="p-0 m-0"
            footerClassName="position-relative"
            footerButtons={[
                scbNo && {
                    text: '복사',
                    variant: 'outline-neutral',
                    className: 'mr-1',
                },
                scbNo && {
                    text: '수정',
                    variant: 'positive',
                    className: 'mr-1',
                    onClick: () => setCommentModalShow(true),
                },
                scbNo && {
                    text: '취소',
                    variant: 'negative',
                    className: 'mr-1',
                    onClick: handleCancle,
                },
                scbNo && {
                    text: '중지',
                    variant: 'negative',
                },
                !scbNo && {
                    text: '임시저장',
                    variant: 'temp',
                    className: 'mr-1',
                },
                !scbNo && {
                    text: '취소',
                    variant: 'negative',
                    className: 'mr-1',
                    onClick: handleCancle,
                },
                !scbNo && {
                    text: '등록',
                    variant: 'positive',
                    disabled: activeKey !== 3,
                },
                activeKey !== 3 && {
                    text: '다음',
                    variant: 'negative',
                    onClick: () => setActiveKey(Number(activeKey + 1)),
                    style: { position: 'absolute', right: 0 },
                },
            ].filter(Boolean)}
        >
            <MokaCardTabs
                fill
                activeKey={activeKey}
                onSelectNav={(key) => setActiveKey(key)}
                className="w-100 h-100 shadow-none"
                tabs={[<DesignStep1Form CHANNEL_TYPE={CHANNEL_TYPE} scb={temp} onChangeValue={handleChangeValue} />]}
                tabNavs={['STEP 1\n기본정보 설정', 'STEP 2\n대상고객 설정', 'STEP 3\n구독제안 설정', 'STEP 4\n제안방법 설정']}
            />

            <ChangeCommentModal
                show={commentModalShow}
                onHide={() => setCommentModalShow(false)}
                onSave={() => {
                    messageBox.alert('구독상품이 수정되었습니다.');
                    setCommentModalShow(false);
                }}
            />
        </MokaCard>
    );
};

export default DesignEdit;
