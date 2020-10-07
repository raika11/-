import React, { useState } from 'react';
import produce from 'immer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import { MokaCardEditor, MokaCardToggleTabs } from '@components';
import { CARD_DEFAULT_HEIGHT, CARD_FOLDING_WIDTH } from '@/constants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@moka/fontawesome-pro-solid-svg-icons';
import { faFileAlt } from '@moka/fontawesome-pro-solid-svg-icons';
import { faBox } from '@moka/fontawesome-pro-solid-svg-icons';
import { faBallot } from '@moka/fontawesome-pro-solid-svg-icons';
import { faNewspaper } from '@moka/fontawesome-pro-solid-svg-icons';
import { faAd } from '@moka/fontawesome-pro-solid-svg-icons';
import { faHistory } from '@moka/fontawesome-pro-solid-svg-icons';
import PageManagement from './components/PageManagement';
import PageSearch from './components/PageSearch';

const Page = () => {
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
        <div className="d-flex">
            {/* 리스트 */}
            <Card bg="light" className="mr-10" style={{ width: expansionState[0] ? 350 : CARD_FOLDING_WIDTH, height: CARD_DEFAULT_HEIGHT }}>
                <Card.Header>
                    <Card.Title>페이지 관리</Card.Title>
                </Card.Header>
                <Card.Body className="p-2">
                    <Form.Group className="py-3">
                        <Form.Control as="select" className="mb-2" custom>
                            <option>중앙일보(https://joongang.joins.com/)</option>
                        </Form.Control>
                        <Form.Row>
                            <Col md={4}>
                                <Form.Control as="select">
                                    <option>페이지 전체</option>
                                </Form.Control>
                            </Col>
                            <Col>
                                <Form.Control placeholder="검색어를 입력하세요" />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Card.Body>
            </Card>

            {/* <Card border="light" style={{ width: '350px', height: '836px' }} className="mr-2">
                <Card.Body >
                    
                    <div style={{ height: '645px' }} className="mt-4">
                        node
                    </div>
                </Card.Body>
            </Card> */}

            {/* 에디터 */}
            <MokaCardEditor className="mr-10 flex-fill" title="에디터 영역" height={CARD_DEFAULT_HEIGHT} expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

            <MokaCardToggleTabs
                expansion={expansionState[2]}
                onExpansion={handleTabExpansion}
                height={CARD_DEFAULT_HEIGHT}
                tabWidth={412}
                tabs={[
                    <PageManagement />,
                    <PageSearch />,
                    <Card bg="light">
                        <Card.Header>
                            <Card.Title>탭 컨텐츠3</Card.Title>
                        </Card.Header>
                        <Card.Body></Card.Body>
                    </Card>,
                    <Card bg="light">
                        <Card.Header>
                            <Card.Title>탭 컨텐츠3</Card.Title>
                        </Card.Header>
                        <Card.Body></Card.Body>
                    </Card>,
                    <Card bg="light">
                        <Card.Header>
                            <Card.Title>탭 컨텐츠3</Card.Title>
                        </Card.Header>
                        <Card.Body></Card.Body>
                    </Card>,
                    <Card bg="light">
                        <Card.Header>
                            <Card.Title>탭 컨텐츠3</Card.Title>
                        </Card.Header>
                        <Card.Body></Card.Body>
                    </Card>,
                    <Card bg="light">
                        <Card.Header>
                            <Card.Title>탭 컨텐츠3</Card.Title>
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
                    { title: '사이트 정보', icon: 'info' },
                    { title: '페이지 검색', icon: <FontAwesomeIcon icon={faFile} /> },
                    { title: '콘텐츠 스킨 검색', icon: <FontAwesomeIcon icon={faFileAlt} /> },
                    { title: '컨테이너 검색', icon: <FontAwesomeIcon icon={faBox} /> },
                    { title: '컴포넌트 검색', icon: <FontAwesomeIcon icon={faBallot} /> },
                    { title: '템플릿 검색', icon: <FontAwesomeIcon icon={faNewspaper} /> },
                    { title: '광고 검색', icon: <FontAwesomeIcon icon={faAd} /> },
                    { title: '템플릿 히스토리', icon: <FontAwesomeIcon icon={faHistory} /> },
                ]}
            />

            {/* <Card border="light" style={{ height: '836px' }}>
                <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                        <div>사이트 정보</div>
                        <FontAwesomeIcon icon={faChevronDoubleLeft} fixedWidth />
                    </Card.Title>
                    <ButtonGroup className="mb-2 ">
                        <Button>W3C</Button>
                        <Button>미리보기</Button>
                        <Button>즉시반영</Button>
                        <Button>전송</Button>
                        <Button>삭제</Button>
                    </ButtonGroup>
                    <div style={{ height: '645px' }} className="border-gray mt-4">
                        node
                    </div>
                </Card.Body>
            </Card> */}
        </div>
    );
};

export default Page;
