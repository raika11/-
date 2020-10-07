import React, { useState } from 'react';
import produce from 'immer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@moka/fontawesome-pro-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { MokaCardEditor, MokaCardToggleTabs, MokaFoldableCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';

const Dashboard = () => {
    const [expansionState, setExpansionState] = useState([true, false, true]);

    /**
     * 리스트 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleListExpansion = (expansion) => {
        setExpansionState(
            produce(expansionState, (draft) => {
                if (!draft[2] && !expansion) {
                    draft[1] = true;
                } else {
                    draft[1] = false;
                }
                draft[0] = expansion;
            }),
        );
    };

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
                <MokaFoldableCard className="mr-10" title="페이지관리" height={CARD_DEFAULT_HEIGHT} expansion={expansionState[0]} onExpansion={handleListExpansion}>
                    <div>TEST</div>
                </MokaFoldableCard>

                {/* 에디터 */}
                <MokaCardEditor className="mr-10 flex-fill" title="에디터 영역" height={CARD_DEFAULT_HEIGHT} expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                {/* 탭 */}
                <MokaCardToggleTabs
                    expansion={expansionState[2]}
                    onExpansion={handleTabExpansion}
                    height={CARD_DEFAULT_HEIGHT}
                    tabWidth={412}
                    tabs={[
                        <Card bg="light">
                            <Card.Header>
                                <Card.Title className="h-100">탭컨텐츠1</Card.Title>
                            </Card.Header>
                            <Card.Body></Card.Body>
                        </Card>,
                        <Card bg="light">
                            <Card.Header>
                                <Card.Title className="h-100">탭 컨텐츠2</Card.Title>
                            </Card.Header>
                            <Card.Body></Card.Body>
                        </Card>,
                        <Card bg="light">
                            <Card.Header>
                                <Card.Title className="h-100">탭 컨텐츠3</Card.Title>
                            </Card.Header>
                            <Card.Body></Card.Body>
                        </Card>,
                    ]}
                    tabNavWidth={48}
                    tabNavs={[
                        { title: '버튼1', icon: 'info' },
                        { title: '버튼2', icon: <FontAwesomeIcon icon={faCoffee} /> },
                        { title: '버튼3', icon: <FontAwesomeIcon icon={faCoffee} /> },
                    ]}
                />
            </div>
        </Container>
    );
};

export default Dashboard;
