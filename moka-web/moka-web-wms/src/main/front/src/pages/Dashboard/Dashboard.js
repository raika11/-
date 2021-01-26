import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import produce from 'immer';
import { Helmet } from 'react-helmet';
import InputMask from 'react-input-mask';
import { useForm } from 'react-hook-form';
import toast, { messageBox } from '@/utils/toastUtil';

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
    AgGripIcon,
    MokaImageInput,
    MokaModal,
    MokaCardTabs,
    NewIcon,
} from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { SourceSelector } from '@pages/commons';
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

    // 매체 state
    const [sourceList, setSourceList] = useState(null);

    // modal test
    const [showD, setShowD] = useState(false);
    const [, setShowLMS] = useState(false);
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
                            icon: <MokaIcon iconName="fas-info-circle" />,
                            onClick: () => {
                                toast.success('성공하였습니다');
                            },
                        },
                    ]}
                >
                    {/* 매체 selector */}
                    <Form.Label>매체 select</Form.Label>
                    <SourceSelector className="mb-2" value={sourceList} sourceType="BULK" onChange={(value) => setSourceList(value)} />

                    {/* MokaAlert 예제 */}
                    <Form.Label>1) Alert</Form.Label>
                    <MokaAlertWithButtons
                        title="title"
                        variant="light"
                        buttons={[
                            {
                                variant: 'searching',
                                text: '버튼1',
                            },
                            {
                                variant: 'info',
                                text: '버튼2',
                            },
                        ]}
                    >
                        테스트
                    </MokaAlertWithButtons>

                    <MokaAlert outline>테스트</MokaAlert>

                    <MokaAlert variant="info">
                        <MokaAlert.Heading>Alert Heading 영역</MokaAlert.Heading>
                        텍스트 영역
                        <MokaAlert.Link href="#">링크</MokaAlert.Link>입니다.
                    </MokaAlert>
                    <MokaAlert variant="info" outline dismissible>
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

                    {/* 페이스북, 트위터 아이콘 */}
                    <MokaIcon iconName="fab-twitter" size="lg" />
                    <MokaIcon iconName="fab-facebook" size="lg" />
                    <NewIcon width={20} height={20} className="ml-1" />
                    <AgGripIcon />
                </MokaCard>

                <MokaCardTabs
                    className="mr-gutter"
                    fill
                    tabs={[
                        <Form className="py-3 px-card h-100 custom-scroll">
                            <Form.Row className="mb-1">
                                <Form.Label className="h4">1) Action Button</Form.Label>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="positive" size="lg" className="w-100">
                                        positive
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="positive"</p>
                                        <p className="mb-0">확인,등록,저장에 사용한다</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="negative" size="lg" className="w-100">
                                        negative
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="negative"</p>
                                        <p className="mb-0">삭제,취소,리셋에 사용한다</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="outline-neutral" size="lg" className="w-100">
                                        outline-neutral
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="outline-neutral"</p>
                                        <p className="mb-0">상단영역의 부가 버튼에 사용한다</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <hr className="divider" />

                            <Form.Row className="mb-1">
                                <Form.Label className="h4">2) Table Button</Form.Label>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="outline-table-btn" size="lg" className="w-100">
                                        outline-table-btn
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="outline-table-btn"</p>
                                        <p className="mb-0">테이블 안에서 사용하는 기본 버튼</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="outline-table-btn2" size="lg" className="w-100">
                                        outline-table-btn2
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="outline-table-btn2"</p>
                                        <p className="mb-0">테이블 안에서 사용하며 테이블 기본 버튼보다 진함</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <hr className="divider" />

                            <Form.Row className="mb-1">
                                <Form.Label className="h4">3) 그 외 Button</Form.Label>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="primary" size="lg" className="w-100">
                                        primary
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="primary"</p>
                                        <p className="mb-0">positive와 동일한 색상</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="secondary" size="lg" className="w-100">
                                        secondary
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="secondary"</p>
                                        <p className="mb-0">outline-neutral과 동일한 색상</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="success" size="lg" className="w-100">
                                        success
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="success"</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="info" size="lg" className="w-100">
                                        info
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="info"</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="searching" size="lg" className="w-100">
                                        searching
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="searching"</p>
                                        <p className="mb-0">검색버튼에 사용한다</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="danger" size="lg" className="w-100">
                                        danger
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="danger"</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="warning" size="lg" className="w-100">
                                        warning
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="warning"</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="gray150" size="lg" className="w-100">
                                        gray150
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="gray150"</p>
                                        <p className="mb-0">템플릿 리스트타입 선택 버튼에만 쓰임</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <hr className="divider" />

                            <Form.Row className="mb-1">
                                <Form.Label className="h4">4) 소셜 Button</Form.Label>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="outline-fb" size="lg" className="w-100">
                                        Facebook
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="outline-fb"</p>
                                        <p className="mb-0">페이스북 버튼</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3 align-items-center">
                                <Col className="p-0 pr-3" xs={4}>
                                    <Button variant="outline-tw" size="lg" className="w-100">
                                        Twitter
                                    </Button>
                                </Col>
                                <Col className="p-0" xs={8}>
                                    <div className="d-flex flex-column">
                                        <p className="mb-0 mr-2 h5">variant="outline-tw"</p>
                                        <p className="mb-0">트위터 버튼</p>
                                    </div>
                                </Col>
                            </Form.Row>

                            <hr className="divider" />

                            <Form.Row className="mb-1">
                                <Form.Label className="h4">5) 폰트 색상</Form.Label>
                            </Form.Row>

                            {['primary', 'secondary', 'success', 'info', 'searching', 'danger', 'warning'].map((color) => (
                                <Form.Row key={color} className="mb-3 align-items-center">
                                    <p className={`mb-0 mr-2 h5`}>.color-{color}</p>
                                    <p className={`mb-0 color-${color}`}>텍스트에 테마 컬러 적용</p>
                                </Form.Row>
                            ))}

                            <hr className="divider" />

                            {['gray-100', 'gray-200', 'gray-300', 'gray-400', 'gray-500', 'gray-600', 'gray-700', 'gray-800', 'gray-900'].map((color) => (
                                <Form.Row key={color} className="mb-3 align-items-center">
                                    <p className={`mb-0 mr-2 h5`}>.color-{color}</p>
                                    <p className={`mb-0 color-${color}`}>body 텍스트 컬러</p>
                                </Form.Row>
                            ))}
                        </Form>,
                        <Form className="py-3 px-card h-100 custom-scroll">
                            {/* Form 예제 */}
                            {/* text input */}
                            <Form.Group className="mb-2">
                                <Form.Label>1) 기본 텍스트 인풋</Form.Label>
                                <Form.Control placeholder="입력창입니다" />
                            </Form.Group>

                            {/* inline text input */}
                            <Form.Group as={Row} className="mb-2">
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
                            <Form.Group className="mb-2">
                                <Form.Label>2) Textarea</Form.Label>
                                <Form.Control as="textarea" />
                            </Form.Group>

                            {/* select */}
                            <Form.Group className="mb-2">
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
                            <Form.Group className="mb-2">
                                <Form.Label>4) Checkbox</Form.Label>
                                <Form.Check label="default checkbox" type="checkbox" name="checkbox-test" />
                                <Form.Check label="default checkbox2" type="checkbox" name="checkbox-test" checked={checked} onChange={() => setChecked(!checked)} />
                                <Form.Check custom id="c-c-t" checked={checked} onChange={() => setChecked(!checked)} label="커스텀(id 필수)" />
                            </Form.Group>

                            {/* radiobutton */}
                            <Form.Group className="mb-2">
                                <Form.Label>5) Radiobutton</Form.Label>
                                <Form.Check type="radio" label="default radio" name="radio" />
                                <Form.Check type="radio" label="default radio2" name="radio" />
                                <Form.Check custom type="radio" name="radio" id="c-r" label="커스텀(id 필수)" />
                            </Form.Group>

                            {/* Switch */}
                            <Form.Group className="mb-2">
                                <Form.Label>6) Switch (기본이 custom)</Form.Label>
                                <Form.Check type="switch" label="default check" id="custom-switch" />
                                <Form.Check type="switch" label="default check" id="d-custom-switch" disabled />
                            </Form.Group>

                            {/* File */}
                            <Form.Group className="mb-2">
                                <Form.Label>7) 파일</Form.Label>
                                <Form.File id="custom-file" label="Custom file input" custom />
                            </Form.Group>

                            {/* Input Mask */}
                            <Form.Group className="mb-2">
                                <Form.Label>8) InputMask</Form.Label>
                                <InputMask mask="(999) 9999-9999">{(inputProps) => <Form.Control {...inputProps} />}</InputMask>
                            </Form.Group>

                            {/* 달력 */}
                            <Form.Group className="mb-2">
                                <Form.Label>9) Datetime picker</Form.Label>
                                <MokaDateTimePicker className="mb-3" placeholder="날짜를 선택해주세요" />
                                <MokaDateTimePicker className="mb-3" dateFormat={false} />
                                <MokaDateTimePicker className="mb-3" timeFormat={false} />
                            </Form.Group>

                            {/* 앞에 뭐 들어가는 input */}
                            <Form.Group className="mb-2">
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
                                {/* <MokaSearchInput variant="warning" onSearch={() => toast.success('성공')} /> */}
                            </Form.Group>
                        </Form>,
                        <div className="py-3 px-card h-100 custom-scroll">
                            {/* 점보트론 */}
                            <Form.Label>11) Jumbotron</Form.Label>
                            <Jumbotron>
                                <h1>TEST</h1>
                                <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                                <p>
                                    <Button variant="searching">Learn more</Button>
                                </p>
                            </Jumbotron>
                        </div>,
                        <div className="py-3 px-card h-100 custom-scroll">
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
                    tabNavs={['테마 색상', 'input 예제', '점보트론', '캐러셀']}
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
                                    <Button type="submit" variant="outline-neutral">
                                        submit
                                    </Button>
                                    <div className="my-2">{JSON.stringify(hookData)}</div>
                                </Form>

                                <Button variant="outline-neutral" className="mr-2" onClick={() => setShowD(true)}>
                                    드래그 모달
                                </Button>
                                <MokaModal variant="outline-neutral" draggable show={showD} onHide={() => setShowD(false)} title="드래그가능한 모달">
                                    <h1>드래그 가능한 모달</h1>
                                    <Button
                                        onClick={() => {
                                            messageBox.confirm('적용하시겠습니까?', () => {
                                                setShowD(false);
                                            });
                                        }}
                                    >
                                        적용
                                    </Button>
                                </MokaModal>

                                {/* toastr test */}
                                <Button
                                    variant="outline-neutral"
                                    className="mr-2"
                                    onClick={() => {
                                        toast.success('성공하였습니다.');
                                    }}
                                >
                                    toast - success
                                </Button>
                                <Button
                                    variant="outline-neutral"
                                    className="mr-2"
                                    onClick={() => {
                                        toast.complete('완료되었습니다.');
                                    }}
                                >
                                    toast - complete
                                </Button>
                                <Button
                                    variant="outline-neutral"
                                    className="mr-2"
                                    onClick={() => {
                                        toast.fail('등록에 실패하였습니다.');
                                    }}
                                >
                                    toast - fail
                                </Button>
                                <Button
                                    variant="outline-neutral"
                                    className="mr-2"
                                    onClick={() => {
                                        toast.error('네트워크 오류가 발생하였습니다.');
                                    }}
                                >
                                    toast - error
                                </Button>
                                <Button
                                    variant="outline-neutral"
                                    className="mr-2"
                                    onClick={() => {
                                        toast.warning('값이 비어있습니다.');
                                    }}
                                >
                                    toast - warning
                                </Button>
                                <Button
                                    variant="outline-neutral"
                                    className="mr-2"
                                    onClick={() => {
                                        toast.info('잠금해제 요청이 있습니다.');
                                    }}
                                >
                                    toast - info
                                </Button>
                                <Button
                                    variant="outline-neutral"
                                    className="mr-2"
                                    onClick={() => {
                                        messageBox.alert(
                                            'BackOffice에 등록된 휴대번호로 본인인증 문자가 발송됩니다.\n수신한 인증번호 입력 후 인증버튼을을 누르면 잠금이 해제됩니다.',
                                            () => {
                                                alert('OK: clicked');
                                            },
                                        );
                                    }}
                                >
                                    alert
                                </Button>
                                <Button
                                    variant="outline-neutral"
                                    className="mr-2"
                                    onClick={() => {
                                        messageBox.confirm(
                                            '확인버튼을 누르시면 이동합니다.\n이동하시겠습니까?',
                                            () => {
                                                alert('OK: clicked');
                                            },
                                            () => {
                                                alert('CANCLE: clicked');
                                            },
                                        );
                                    }}
                                >
                                    confirm
                                </Button>

                                {/* 대중소 모달 */}
                                <Button variant="outline-neutral" className="mr-2" onClick={() => setShowLMS(true)}>
                                    대중소 모달
                                </Button>

                                {/* <MokaCodeListModal
                                    show={showLMS}
                                    onHide={() => setShowLMS(false)}
                                    onOk={(codeData) => {
                                        toast.success(codeData.codeId);
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
                        { title: '리스트', icon: <MokaIcon iconName="fas-info-circle" /> },
                    ]}
                />
            </div>
        </Container>
    );
};

export default Dashboard;
