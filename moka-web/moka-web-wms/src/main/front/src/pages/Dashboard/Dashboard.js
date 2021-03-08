import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import produce from 'immer';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import toast, { messageBox } from '@/utils/toastUtil';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import {
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
import ThemeEx from './ThemeEx';
import InputEx from './InputEx';

const Dashboard = () => {
    const { register, handleSubmit, errors, control } = useForm();
    const [expansionState, setExpansionState] = useState([true, false, true]);
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
                        <div>
                            {/* 테마 예제 */}
                            <ThemeEx />
                        </div>,
                        <div>
                            {/* Input 예제 */}
                            <InputEx />
                        </div>,
                    ]}
                    tabNavs={['테마 색상', 'Input 예제']}
                />

                {/* 탭 예제 */}
                <MokaIconTabs
                    expansion={expansionState[2]}
                    onExpansion={handleTabExpansion}
                    height={CARD_DEFAULT_HEIGHT}
                    tabWidth={412}
                    tabs={[
                        <MokaCard titleClassName="h-100" title="Modal 예제">
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
                        <MokaCard titleClassName="h-100" title="이미지drop">
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
                        <MokaCard titleClassName="h-100" title="리스트그룹">
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
