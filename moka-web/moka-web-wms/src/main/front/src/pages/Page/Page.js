import React, { useState, Suspense } from 'react';
import produce from 'immer';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import { MokaCardEditor, MokaCardToggleTabs, MokaFoldableCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@moka/fontawesome-pro-solid-svg-icons';
import { faFileAlt } from '@moka/fontawesome-pro-solid-svg-icons';
import { faBox } from '@moka/fontawesome-pro-solid-svg-icons';
import { faBallot } from '@moka/fontawesome-pro-solid-svg-icons';
import { faNewspaper } from '@moka/fontawesome-pro-solid-svg-icons';
import { faAd } from '@moka/fontawesome-pro-solid-svg-icons';
import { faHistory } from '@moka/fontawesome-pro-solid-svg-icons';

const PageEdit = React.lazy(() => import('./PageEdit'));
const PageInfo = React.lazy(() => import('./PageInfo'));
const PageSearch = React.lazy(() => import('./PageSearch'));
const ContentSkinSearch = React.lazy(() => import('./ContentSkinSearch'));
const ContainerSearch = React.lazy(() => import('./ContainerSearch'));
const ComponentSearch = React.lazy(() => import('./ComponentSearch'));
const TemplateSearch = React.lazy(() => import('./TemplateSearch'));
const AdSearch = React.lazy(() => import('./AdSearch'));
const TemplateHistory = React.lazy(() => import('./TemplateHistory'));
const Page = () => {
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
        <div className="d-flex">
            {/* 리스트 */}
            <MokaFoldableCard className="mr-10" title="페이지관리" height={CARD_DEFAULT_HEIGHT} expansion={expansionState[0]} onExpansion={handleListExpansion}>
                <Suspense>
                    <PageEdit />
                </Suspense>
            </MokaFoldableCard>

            {/* 에디터 */}
            <MokaCardEditor className="mr-10 flex-fill" title="에디터 영역" height={CARD_DEFAULT_HEIGHT} expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

            <MokaCardToggleTabs
                expansion={expansionState[2]}
                onExpansion={handleTabExpansion}
                height={CARD_DEFAULT_HEIGHT}
                tabWidth={412}
                tabs={[
                    <Suspense>
                        <PageInfo />
                    </Suspense>,
                    <Suspense>
                        <PageSearch />
                    </Suspense>,
                    <Suspense>
                        <ContentSkinSearch />
                    </Suspense>,
                    <Suspense>
                        <ContainerSearch />
                    </Suspense>,
                    <Suspense>
                        <ComponentSearch />
                    </Suspense>,
                    <Suspense>
                        <TemplateSearch />
                    </Suspense>,
                    <Suspense>
                        <AdSearch />
                    </Suspense>,
                    <Suspense>
                        <TemplateHistory />
                    </Suspense>,
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
