import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import produce from 'immer';
import { Helmet } from 'react-helmet';
import InputMask from 'react-input-mask';
import { toastr } from 'react-redux-toastr';
import { useForm } from 'react-hook-form';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import Carousel from 'react-bootstrap/Carousel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import {
    MokaPrependLinkInput,
    MokaDateTimePicker,
    MokaIconTabs,
    MokaCard,
    MokaAlertWithButtons,
    MokaAutocomplete,
    MokaUncontrolledInput,
    MokaAlert,
    MokaIcon,
    MokaImageInput,
    MokaModal,
    MokaCardTabs,
} from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
// import { changeTheme } from '@store/layout/layoutAction';
import { options } from './data';
import bg from '@assets/images/bg.jpeg';

const Dashboard = () => {
    const { register, handleSubmit, errors, control } = useForm();
    // state
    const [expansionState, setExpansionState] = useState([true, false, true]);
    const [checked, setChecked] = useState(true);
    const [multiSelectValue, setMultiSelectValue] = useState([]);
    const [serror, setSerror] = useState(false);
    const [hookData, setHookData] = useState({});

    // modal test
    const [showD, setShowD] = useState(false);
    const [showLMS, setShowLMS] = useState(false);
    // const dispatch = useDispatch();

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

    React.useEffect(() => {
        setSerror(errors['autocomplete-test'] ? true : false);
    }, [errors]);

    return (
        <Container className="p-0" fluid>
            <Helmet>
                <title>예제 페이지</title>
                <meta name="description" content="예제 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="d-flex">
                <MokaCard
                    className="mr-gutter flex-shrink-0"
                    title="왼쪽 영역"
                    titleClassName="mb-0"
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

                <MokaCardTabs
                    className="mr-gutter"
                    tabs={[
                        <Form className="p-3">
                            {/* Form 예제 */}
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
                                {/* <MokaAutocomplete options={options} /> */}
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
                                <MokaDateTimePicker className="mb-3" dateFormat={false} />
                                <MokaDateTimePicker className="mb-3" timeFormat={false} />
                            </Form.Group>

                            {/* 앞에 뭐 들어가는 input */}
                            <Form.Group>
                                <Form.Label>10) Input Group</Form.Label>
                                <MokaPrependLinkInput
                                    className="mb-3"
                                    to="/404"
                                    linkText="ID : 3"
                                    inputList={[
                                        {
                                            placeholder: '템플릿위치그룹',
                                            disabled: true,
                                            className: 'bg-white',
                                        },
                                        { placeholder: '템플릿명', disabled: true },
                                    ]}
                                />
                                {/* <MokaSearchInput variant="warning" onSearch={() => toastr.success('테스트', '성공')} /> */}
                            </Form.Group>
                        </Form>,
                        <div className="p-3">
                            {/* 점보트론 */}
                            <Form.Label>11) Jumbotron</Form.Label>
                            <Jumbotron>
                                <h1>TEST</h1>
                                <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                                <p>
                                    <Button variant="primary">Learn more</Button>
                                </p>
                            </Jumbotron>
                        </div>,
                        <div className="p-3">
                            {/* 캐러셀 */}
                            <Form.Label>12) Carousel</Form.Label>
                            <Carousel>
                                <Carousel.Item>
                                    <img className="d-block w-100" src={bg} alt="t" />
                                    <Carousel.Caption>
                                        <h3>First slide label</h3>
                                        <p>서브 텍스트</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img className="d-block w-100" src={bg} alt="t" />
                                    <Carousel.Caption>
                                        <h3>Second slide label</h3>
                                        <p>서브 텍스트</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel>
                        </div>,
                    ]}
                    tabNavs={['input 예제', '점보트론', '캐러셀']}
                />

                {/* 탭 예제 */}
                <MokaIconTabs
                    expansion={expansionState[2]}
                    onExpansion={handleTabExpansion}
                    height={CARD_DEFAULT_HEIGHT}
                    tabWidth={412}
                    tabs={[
                        <MokaCard titleClassName="h-100 mb-0" title="Modal 예제">
                            <div className="mb-3">
                                <Form onSubmit={handleSubmit((data) => setHookData(data))} className="mb-3">
                                    <Form.Control name="test-text" ref={register} />
                                    <Form.Label className="text-danger">* react-hook-form 사용한 autocomplete</Form.Label>
                                    <MokaUncontrolledInput
                                        name="autocomplete-test"
                                        defaultValue={null}
                                        as="autocomplete"
                                        inputProps={{ options: options }}
                                        onChange={() => {
                                            setSerror(false);
                                        }}
                                        isInvalid={serror}
                                        rules={{ required: true }}
                                        control={control}
                                        className="mb-2"
                                    />
                                    <Button type="submit">submit</Button>
                                    <div className="my-2">{JSON.stringify(hookData)}</div>
                                </Form>

                                <Button className="mr-2" onClick={() => setShowD(true)}>
                                    드래그 모달
                                </Button>
                                <MokaModal draggable show={showD} onHide={() => setShowD(false)} title="드래그가능한 모달">
                                    <h1>드래그 가능한 모달</h1>
                                    <Button
                                        onClick={() => {
                                            toastr.confirm('적용하시겠습니까?', {
                                                onOk: () => {
                                                    setShowD(false);
                                                },
                                                onCancel: () => {},
                                                attention: false,
                                            });
                                        }}
                                    >
                                        적용
                                    </Button>
                                </MokaModal>

                                {/* toastr test */}
                                <Button
                                    className="mr-2"
                                    onClick={() => {
                                        toastr.confirm('확인창', {
                                            onOk: () => alert('OK: clicked'),
                                            onCancel: () => alert('CANCLE: clicked'),
                                        });
                                    }}
                                >
                                    토스트 테스트
                                </Button>

                                {/* 대중소 모달 */}
                                <Button className="mr-2" onClick={() => setShowLMS(true)}>
                                    대중소 모달
                                </Button>
                                {/* <MokaCodeListModal
                                    show={showLMS}
                                    onHide={() => setShowLMS(false)}
                                    onOk={(codeData) => {
                                        toastr.success('선택한 코드', codeData.codeId);
                                    }}
                                    title="분류 검색(화면 틀어지는건 나중에 처리)"
                                /> */}

                                {/* 테마변경 */}
                                {/* <Button className="mr-2" onClick={() => dispatch(changeTheme('classic'))}>
                                    테마1
                                </Button> */}
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
                        <MokaCard titleClassName="h-100 mb-0" title="리스트그룹">
                            <Form.Group>
                                <Form.Label>ListGroup</Form.Label>
                                <ListGroup as="ul">
                                    <ListGroup.Item as="li" active>
                                        액티브 아이템
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li">아이템</ListGroup.Item>
                                    <ListGroup.Item as="li" variant="info">
                                        아이템
                                    </ListGroup.Item>
                                    <ListGroup.Item as="li" disabled>
                                        사용불가 아이템
                                    </ListGroup.Item>
                                </ListGroup>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>버튼그룹 예제</Form.Label>
                                <ButtonToolbar className="mb-4">
                                    <ButtonGroup className="mr-2">
                                        <Button>그룹버튼1</Button>
                                        <Button>그룹버튼2</Button>
                                        <Button>그룹버튼3</Button>
                                    </ButtonGroup>
                                    <ButtonGroup className="mr-2">
                                        <Button variant="success">다른 그룹버튼1</Button>
                                        <Button variant="success">다른 그룹버튼2</Button>
                                        <Button variant="success">다른 그룹버튼3</Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Form.Group>
                        </MokaCard>,
                    ]}
                    tabNavWidth={48}
                    tabNavs={[
                        { title: 'Modal 예제', text: 'Modal' },
                        { title: '이미지drop', text: 'Drop' },
                        { title: '리스트', icon: <MokaIcon iconName="fal-coffee" /> },
                    ]}
                />
            </div>
        </Container>
    );
};

export default Dashboard;
