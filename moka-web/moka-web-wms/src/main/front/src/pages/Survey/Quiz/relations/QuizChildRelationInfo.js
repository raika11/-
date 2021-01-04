import React from 'react';
import { MokaCard } from '@components';
import { useHistory } from 'react-router-dom';

const QuizChildRelationInfo = () => {
    const history = useHistory();

    return (
        <MokaCard
            title="관련 정보"
            className="flex-fill"
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '저장', variant: 'positive', onClick: () => console.log('저장'), className: 'mr-05' },
                { text: '취소', variant: 'negative', onClick: () => history.push('/quiz'), className: 'mr-05' },
            ]}
            width={750}
        >
            관련 정보
        </MokaCard>
    );
};

export default QuizChildRelationInfo;
