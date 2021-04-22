import React, { useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaCardTabs } from '@components';
import { ABMainForm, ABEtcForm, ABStatusRow } from '../components';

/**
 * A/B 테스트 > 직접 설계 > 등록, 수정
 */
const AutoEdit = ({ match }) => {
    const { abTestSeq } = useParams();
    const history = useHistory();
    const [isAdd, setIsAdd] = useState(true);
    const [activeKey, setActiveKey] = useState(0);
    const [temp, setTemp] = useState({});

    /**
     * 카드 버튼 렌더러
     */
    const renderFooter = useCallback(() => {
        return (
            <React.Fragment>
                <Button variant="positive" className="mr-1">
                    저장
                </Button>
                <Button variant="temp" className="mr-1">
                    임시저장
                </Button>
                <Button variant="negative" onClick={() => history.push(match.path)}>
                    취소
                </Button>
                {isAdd && (
                    <Button
                        variant="negative"
                        style={{ marginLeft: 170 }}
                        onClick={() => {
                            if (activeKey === 0) setActiveKey(1);
                            else setActiveKey(0);
                        }}
                    >
                        {activeKey === 0 ? '다음' : '이전'}
                    </Button>
                )}
            </React.Fragment>
        );
    }, [activeKey, history, isAdd, match]);

    /**
     * 탭 nav 렌더러
     */
    const renderTabNavs = useCallback(() => {
        return isAdd ? ['STEP 1\n주요 설정', 'STEP 2\n기타 설정'] : ['주요 설정', '기타 설정'];
    }, [isAdd]);

    /**
     * AB데이터 수정
     * @param {object} 변경될 값들이 담겨져있는 obj
     */
    const handleChange = useCallback(
        (valueObj) => {
            setTemp({ ...temp, ...valueObj });
        },
        [temp],
    );

    useEffect(() => {
        if (!abTestSeq) {
            // 등록페이지
            setIsAdd(true);
        } else {
            setIsAdd(false);
        }
    }, [abTestSeq]);

    return (
        <MokaCard
            title="AB테스트 제목"
            className="w-100"
            headerClassName="pb-0"
            bodyClassName="p-0 m-0"
            footer
            footerClassName={clsx('d-flex align-items-center', {
                'justify-content-end': isAdd,
                'justify-content-center': !isAdd,
            })}
            footerAs={renderFooter()}
        >
            <MokaCardTabs
                fill={isAdd}
                activeKey={activeKey}
                onSelectNav={(key) => setActiveKey(key)}
                className="w-100 h-100 shadow-none"
                tabNavs={renderTabNavs()}
                tabs={[
                    <React.Fragment>
                        {!isAdd && <ABStatusRow />}
                        <ABMainForm data={temp} onChange={handleChange} />
                    </React.Fragment>,
                    <ABEtcForm data={temp} onChange={handleChange} />,
                ]}
            />
        </MokaCard>
    );
};

export default AutoEdit;
