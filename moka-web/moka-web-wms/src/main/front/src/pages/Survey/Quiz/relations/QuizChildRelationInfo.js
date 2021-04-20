import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import SortAgGrid from '@pages/Survey/component/SortAgGrid';
import { QuizSearchModal } from '@pages/Survey/Quiz/modals';
import { MokaCard, MokaInputLabel } from '@components';
import QuizSortAgGrid from './QuizSortAgGrid';

/**
 * 퀴즈 관리 > 관련 정보 편집
 */
const QuizChildRelationInfo = ({ HandleSave }) => {
    const history = useHistory();
    const [quizSearchModalState, setQuizSearchModalState] = useState(false);

    /**
     * 정보창 오른쪽 탭이 2개라서 실제 저장 기능은 QuizEdit 에서 처리 하기위해 props 로 저장 전달 처리
     */
    const handleClickSaveButton = () => {
        HandleSave();
    };

    return (
        <MokaCard
            title="관련 정보"
            className="w-100"
            footer
            footerButtons={[
                { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-1' },
                { text: '취소', variant: 'negative', onClick: () => history.push('/quiz') },
            ]}
            width={750}
        >
            <div>
                <Form.Row>
                    <MokaInputLabel as="none" label="관련 퀴즈" />
                    <Button variant="searching" size="s" onClick={() => setQuizSearchModalState(true)}>
                        퀴즈 검색
                    </Button>
                </Form.Row>

                <QuizSortAgGrid />

                <hr />

                <SortAgGrid />

                <QuizSearchModal
                    show={quizSearchModalState}
                    onHide={() => {
                        setQuizSearchModalState(false);
                    }}
                />
            </div>
        </MokaCard>
    );
};

export default QuizChildRelationInfo;
