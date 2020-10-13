import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import produce from 'immer';
import { Helmet } from 'react-helmet';
import InputMask from 'react-input-mask';
import { toastr } from 'react-redux-toastr';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import {
    MokaPrependLinkInput,
    MokaSearchInput,
    MokaDateTimePicker,
    MokaIconTabs,
    MokaCard,
    MokaAlertWithButtons,
    MokaAutocomplete,
    MokaAlert,
    MokaIcon,
    MokaImageInput,
    MokaDraggableModal,
    MokaCodeListModal,
} from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { changeTheme } from '@store/layout/layoutAction';
import { options } from './data';

const Dashboard = () => {
    // state
    const [expansionState, setExpansionState] = useState([true, false, true]);
    const [checked, setChecked] = useState(true);
    const [multiSelectValue, setMultiSelectValue] = useState([]);

    // modal test
    const [showD, setShowD] = useState(false);
    const [showLMS, setShowLMS] = useState(false);

    const dispatch = useDispatch();

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
            <Helmet>
                <title>예제 페이지</title>
                <meta name="description" content="예제 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="d-flex">
                <MokaCard
                    className="mr-10 flex-shrink-0"
                    title="왼쪽 영역"
                    titleClassName="mb-0"
                    bodyClassName="overflow-y-auto"
                    expansion={expansionState[0]}
                    onExpansion={handleListExpansion}
                    foldable
                    buttons={[
                        {
                            variant: 'white',
                            icon: <MokaIcon iconName="fal-coffee" />,
                            onClick: () => {
                                toastr.success('토스트', '성공하였습니다');
                            },
                        },
                    ]}
                >
                    {/* MokaAlert 예제 */}
                    <Form.Label>1) Alert</Form.Label>
                    <MokaAlertWithButtons
                        title="title"
                        variant="light"
                        buttons={[
                            {
                                variant: 'primary',
                                text: '버튼1',
                            },
                            {
                                variant: 'warning',
                                text: '버튼2',
                            },
                        ]}
                    >
                        테스트
                    </MokaAlertWithButtons>

                    <MokaAlert outline>테스트</MokaAlert>

                    <MokaAlert variant="primary">
                        <MokaAlert.Heading>Alert Heading 영역</MokaAlert.Heading>
                        텍스트 영역
                        <MokaAlert.Link href="#">링크</MokaAlert.Link>입니다.
                    </MokaAlert>
                    <MokaAlert variant="primary" outline dismissible>
                        <MokaAlert.Heading>Alert Heading 영역</MokaAlert.Heading>
                        outline, dismissible 상태
                        <MokaAlert.Link href="#">링크</MokaAlert.Link>입니다.
                    </MokaAlert>

                    {/* 자동완성 예제 */}
                    <Form.Group>
                        <Form.Label>2) 자동완성(react-select lib 사용)</Form.Label>
                        <MokaAutocomplete
                            options={options}
                            closeMenuOnSelect={false}
                            isMulti
                            searchIcon={true}
                            value={multiSelectValue}
                            onChange={(value, event) => {
                                setMultiSelectValue(value);
                            }}
                        />
                    </Form.Group>
                </MokaCard>

                <MokaCard
                    className="mr-10 flex-fill"
                    bodyClassName="overflow-y-auto"
                    titleClassName="mb-0"
                    title="가운데 영역"
                    height={CARD_DEFAULT_HEIGHT}
                    expansion={expansionState[1]}
                    onExpansion={handleEditorExpansion}
                >
                    {/* Form 예제 */}
                    <Form>
                        {/* text input */}
                        <Form.Group>
                            <Form.Label>1) 기본 텍스트 인풋</Form.Label>
                            <Form.Control placeholder="입력창입니다" />
                        </Form.Group>

                        {/* inline text input */}
                        <Form.Group as={Row}>
                            <Col xs={2} className="p-0 pr-2">
                                <Form.Label>* 인라인1</Form.Label>
                            </Col>
                            <Col xs={10} className="p-0">
                                <Form.Control placeholder="입력창입니다" />
                            </Col>
                        </Form.Group>

                        <Form.Row className="mb-3">
                            <Form.Label column xs={2} className="p-0 pr-2">
                                * 인라인2
                            </Form.Label>
                            <Col xs={10} className="p-0">
                                <Form.Control placeholder="입력창입니다" />
                            </Col>
                        </Form.Row>

                        {/* textarea */}
                        <Form.Group>
                            <Form.Label>2) Textarea</Form.Label>
                            <Form.Control as="textarea" />
                        </Form.Group>

                        {/* select */}
                        <Form.Group>
                            <Form.Label>3) Select</Form.Label>
                            <Form.Control as="select" className="mb-1">
                                <option value="">기본 셀렉트</option>
                                <option>옵션1</option>
                                <option>옵션2</option>
                            </Form.Control>
                            <Form.Control as="select" custom className="mb-1">
                                <option value="">커스텀 셀렉트</option>
                                <option>옵션1</option>
                                <option>옵션2</option>
                            </Form.Control>
                            <MokaAutocomplete options={options} />
                        </Form.Group>

                        {/* checkbox */}
                        <Form.Group>
                            <Form.Label>4) Checkbox</Form.Label>
                            <Form.Check label="default checkbox" type="checkbox" name="checkbox-test" />
                            <Form.Check label="default checkbox2" type="checkbox" name="checkbox-test" checked={checked} onChange={() => setChecked(!checked)} />
                            <Form.Check custom id="c-c-t" checked={checked} onChange={() => setChecked(!checked)} label="커스텀(id 필수)" />
                        </Form.Group>

                        {/* radiobutton */}
                        <Form.Group>
                            <Form.Label>5) Radiobutton</Form.Label>
                            <Form.Check type="radio" label="default radio" name="radio" />
                            <Form.Check type="radio" label="default radio2" name="radio" />
                            <Form.Check custom type="radio" name="radio" id="c-r" label="커스텀(id 필수)" />
                        </Form.Group>

                        {/* Switch */}
                        <Form.Group>
                            <Form.Label>6) Switch (기본이 custom)</Form.Label>
                            <Form.Check type="switch" label="default check" id="custom-switch" />
                            <Form.Check type="switch" label="default check" id="d-custom-switch" disabled />
                        </Form.Group>

                        {/* File */}
                        <Form.Group>
                            <Form.Label>7) 파일</Form.Label>
                            <Form.File id="custom-file" label="Custom file input" custom />
                        </Form.Group>

                        {/* Input Mask */}
                        <Form.Group>
                            <Form.Label>8) InputMask</Form.Label>
                            <InputMask mask="(999) 9999-9999">{(inputProps) => <Form.Control {...inputProps} />}</InputMask>
                        </Form.Group>

                        {/* 달력 */}
                        <Form.Group>
                            <Form.Label>9) Datetime picker</Form.Label>
                            <MokaDateTimePicker className="mb-3" placeholder="날짜를 선택해주세요" />
                            <MokaDateTimePicker className="mb-3" dateFormat={null} />
                            <MokaDateTimePicker className="mb-3" timeFormat={null} />
                        </Form.Group>

                        {/* 앞에 뭐 들어가는 input */}
                        <Form.Group>
                            <Form.Label>10) Input Group</Form.Label>
                            <MokaPrependLinkInput
                                className="mb-3"
                                to="/404"
                                linkText="ID : 3"
                                inputProps={[
                                    {
                                        placeholder: '템플릿위치그룹',
                                        disabled: true,
                                        className: 'bg-white',
                                    },
                                    { placeholder: '템플릿명' },
                                ]}
                            />
                            <MokaSearchInput variant="warning" onSearch={() => toastr.success('테스트', '성공')} />
                        </Form.Group>
                    </Form>
                </MokaCard>

                {/* 탭 예제 */}
                <MokaIconTabs
                    expansion={expansionState[2]}
                    onExpansion={handleTabExpansion}
                    height={CARD_DEFAULT_HEIGHT}
                    tabWidth={412}
                    tabs={[
                        <MokaCard titleClassName="h-100 mb-0" title="Modal 예제">
                            <div className="mb-3">
                                <Button className="mr-2" onClick={() => setShowD(true)}>
                                    드래그 모달
                                </Button>
                                <MokaDraggableModal show={showD} onHide={() => setShowD(false)} title="드래그가능한 모달">
                                    <div>
                                        <h1>드래그 가능한 모달</h1>
                                        <Button
                                            onClick={() => {
                                                toastr.confirm('적용하시겠습니까?', {
                                                    onOk: () => {
                                                        setShowD(false);
                                                    },
                                                    onCancle: () => {},
                                                    attention: false,
                                                });
                                            }}
                                        >
                                            적용
                                        </Button>
                                    </div>
                                </MokaDraggableModal>

                                {/* toastr test */}
                                <Button
                                    className="mr-2"
                                    onClick={() => {
                                        // toastr.confirm('확인창', {
                                        //     onOk: () => console.log('OK: clicked'),
                                        //     onCancle: () => console.log('CANCLE: clicked')
                                        // });
                                        toastr.success('ddd', 'ddd');
                                    }}
                                >
                                    토스트 테스트
                                </Button>

                                {/* 대중소 모달 */}
                                <Button className="mr-2" onClick={() => setShowLMS(true)}>
                                    대중소 모달
                                </Button>
                                <MokaCodeListModal
                                    show={showLMS}
                                    onHide={() => setShowLMS(false)}
                                    onOk={(codeData) => {
                                        toastr.success('선택한 코드', codeData.codeId);
                                    }}
                                    title="분류 검색"
                                />

                                {/* 테마변경 */}
                                <Button className="mr-2" onClick={() => dispatch(changeTheme('classic'))}>
                                    테마1
                                </Button>
                                {/* <Button
                                    className="mr-2"
                                    onClick={() => dispatch(changeTheme('corporate'))}
                                >
                                    테마2
                                </Button>
                                <Button className="mr-2" onClick={() => dispatch(changeTheme('modern'))}>
                                    테마3
                                </Button> */}
                            </div>
                        </MokaCard>,
                        <MokaCard titleClassName="h-100 mb-0" title="이미지drop">
                            <Form.Group>
                                <Form.Label>이미지drop 테스트</Form.Label>
                                <div>
                                    <MokaImageInput />
                                </div>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>+ 다른 드롭존</Form.Label>
                                <div>
                                    <MokaImageInput />
                                </div>
                            </Form.Group>
                        </MokaCard>,
                        <MokaCard titleClassName="h-100 mb-0" title="탭컨텐츠3">
                            TEST
                        </MokaCard>,
                    ]}
                    tabNavWidth={48}
                    tabNavs={[
                        { title: 'Modal 예제', text: 'Info' },
                        { title: '이미지drop', icon: <MokaIcon iconName="fal-coffee" /> },
                        { title: '버튼3', icon: <MokaIcon iconName="fal-coffee" /> },
                    ]}
                />
            </div>
        </Container>
    );
};

export default Dashboard;
