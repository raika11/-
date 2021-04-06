import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaCardTabs } from '@components';
import { ABMainForm, ABEtcForm, ABStatusRow } from '../components';

/**
 * A/B 테스트 > 직접 설계 > 등록, 수정
 */
const DirectEdit = ({ match }) => {
    const isAdd = true;
    const history = useHistory();
    const [activeKey, setActiveKey] = useState(0);

    const renderFooter = useCallback(() => {
        return (
            <React.Fragment>
                <Button variant="positive-a" className="mr-1">
                    저장
                </Button>
                <Button variant="positive" className="mr-1">
                    임시저장
                </Button>
                <Button variant="negative" onClick={() => history.push(match.path)}>
                    취소
                </Button>
                {isAdd && (
                    <Button
                        variant="negative"
                        style={{ marginLeft: 162 }}
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

    const renderTabNavs = useCallback(() => {
        return isAdd ? ['STEP 1\n주요 설정', 'STEP 2\n기타 설정'] : ['주요 설정', '기타 설정'];
    }, [isAdd]);

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
                        <ABMainForm />
                    </React.Fragment>,
                    <ABEtcForm />,
                ]}
            />
        </MokaCard>
    );
};

export default DirectEdit;
