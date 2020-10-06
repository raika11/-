import React, { useState } from 'react';
import produce from 'immer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@moka/fontawesome-pro-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { MokaEditor, MokaCardToggleTabs } from '@components';
import { CARD_DEFAULT_HEIGHT, CARD_FOLDING_WIDTH } from '@/constants';

const Dashboard = () => {
    const [expansionState, setExpansionState] = useState([true, false, true]);

    /**
     * 에디터 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleEditorExpansion = (expansion) => {
        if (expansion) {
            setExpansionState([false, expansion, false]);
        } else {
            setExpansionState([true, expansion, true]);
        }
    };

    /**
     * 탭 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleTabExpansion = (expansion) => {
        setExpansionState(
            produce(expansionState, (draft) => {
                if (!draft[0] && !expansion) {
                    draft[1] = true;
                } else {
                    draft[1] = false;
                }
                draft[2] = expansion;
            }),
        );
    };

    return (
        <Container className="p-0" fluid>
            <div className="d-flex">
                {/* 리스트 */}
                <Card bg="light" className="mr-10px" style={{ width: expansionState[0] ? 350 : CARD_FOLDING_WIDTH, height: CARD_DEFAULT_HEIGHT }}>
                    <Card.Header>
                        <Card.Title>페이지 관리</Card.Title>
                    </Card.Header>
                    <Card.Body></Card.Body>
                </Card>

                {/* 에디터 */}
                <MokaEditor className="mr-10px flex-fill" title="에디터 영역" height={CARD_DEFAULT_HEIGHT} expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                {/* 탭 */}
                <MokaCardToggleTabs
                    expansion={expansionState[2]}
                    onExpansion={handleTabExpansion}
                    height={CARD_DEFAULT_HEIGHT}
                    tabWidth={412}
                    tabs={[
                        <Card bg="light">
                            <Card.Header>
                                <Card.Title>탭컨텐츠1</Card.Title>
                            </Card.Header>
                            <Card.Body></Card.Body>
                        </Card>,
                        <Card bg="light">
                            <Card.Header>
                                <Card.Title>탭 컨텐츠2</Card.Title>
                            </Card.Header>
                            <Card.Body></Card.Body>
                        </Card>,
                        <Card bg="light">
                            <Card.Header>
                                <Card.Title>탭 컨텐츠3</Card.Title>
                            </Card.Header>
                            <Card.Body></Card.Body>
                        </Card>,
                    ]}
                    tabNavWidth={48}
                    tabNavs={[
                        { title: '버튼1', icon: <FontAwesomeIcon icon={faCoffee} /> },
                        { title: '버튼2', icon: <FontAwesomeIcon icon={faCoffee} /> },
                        { title: '버튼3', icon: <FontAwesomeIcon icon={faCoffee} /> },
                    ]}
                />
            </div>
        </Container>
    );
};

export default Dashboard;
