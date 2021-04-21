import React, { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaIcon, MokaInput, MokaInputLabel } from '@components';
import ServiceCodeSelector from '@pages/Issue/components/Desking/ServiceCodeSelector';
import { messageBox } from '@utils/toastUtil';
import Button from 'react-bootstrap/Button';
import { initialState } from '@store/issue';
import produce from 'immer';
import RecommendIssueListModal from '@pages/Issue/modal/RecommendIssueListModal';
import commonUtil from '@utils/commonUtil';
import Badge from 'react-bootstrap/Badge';
import moment from 'moment';

const IssueCommonEdit = ({ data, onChange, onDuplicateCheck, isDuplicatedTitle, setIsDuplicatedTitle }) => {
    const [edit, setEdit] = useState(initialState.pkg);
    const [showRecommendIssueListModal, setShowRecommendIssueListModal] = useState(false);
    const [recommendPackages, setRecommendPackages] = useState([]);
    const [recommendPkgSeq, setRecommendPkgSeq] = useState('');
    const [useRecommendIssuePackage, setUseRecommendIssuePackage] = useState(false);

    const handleChangeValue = ({ name, value, togetherHandlers }) => {
        const changeData = produce(edit, (draft) => {
            draft[name] = value;
            if (togetherHandlers instanceof Array) {
                togetherHandlers.forEach((handler) => {
                    draft[handler.name] = handler.value;
                });
            }
        });

        setEdit(changeData);
        if (setIsDuplicatedTitle instanceof Function) {
            if (name === 'pkgTitle') {
                setIsDuplicatedTitle(true);
            }
        }
        if (onChange instanceof Function) {
            onChange(changeData);
        }
    };

    const handleChangeArrayObjectValue = ({ target, subTarget, name, value, togetherHandlers }) => {
        const data = produce(edit, (draft) => {
            draft[target][subTarget][name] = value;

            if (togetherHandlers instanceof Array) {
                togetherHandlers.forEach((handler) => {
                    draft[target][subTarget][handler.name] = handler.value;
                });
            }
        });
        setEdit(data);
        if (onChange instanceof Function) {
            onChange(data);
        }
    };

    const handleClickRecommendPackageAdd = useCallback(
        (pkgSeq) => {
            setRecommendPkgSeq(pkgSeq);
        },
        [recommendPackages],
    );

    useEffect(() => {
        setEdit(data);
        if (!commonUtil.isEmpty(data.recommPkg) && data.recommPkg !== '') {
            setRecommendPackages(data.recommPkg.split(','));
            setUseRecommendIssuePackage(true);
        } else {
            setRecommendPackages([]);
            setUseRecommendIssuePackage(false);
        }
    }, [data]);

    useEffect(() => {
        if (recommendPkgSeq !== '') {
            const pkgSeqs = [...recommendPackages, `${recommendPkgSeq}`];
            setRecommendPackages(pkgSeqs);
            handleChangeValue({ name: 'recommPkg', value: pkgSeqs.join(',') });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recommendPkgSeq]);

    return (
        <>
            <Form.Row className="mb-2 align-items-center">
                <Col xs={3} className="p-0">
                    <MokaInputLabel
                        as="switch"
                        id="package-expoYn-checkbox"
                        label="노출 여부"
                        name="usedYn"
                        value={edit.usedYn}
                        inputProps={{ custom: true, checked: edit.usedYn !== 'N' }}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            let usedYn = value;
                            if (value === 'N') {
                                usedYn = 'Y';
                            } else {
                                usedYn = 'N';
                            }

                            handleChangeValue({ name, value: usedYn, togetherHandlers: [{ name: 'reservDt', value: null }] });
                        }}
                        required
                    />
                </Col>
                <Col xs={9} className="p-0 d-flex align-items-center">
                    <div style={{ width: 80 }} className="pr-3">
                        <MokaInput
                            as="radio"
                            id="package-imedi-radio"
                            name="usedYn"
                            value="Y"
                            inputProps={{ label: '즉시', custom: true, checked: edit.usedYn === 'Y' }}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue({ name, value, togetherHandlers: [{ name: 'reservDt', value: null }] });
                            }}
                        />
                    </div>
                    <div style={{ width: 80 }} className="pr-1">
                        <MokaInput
                            as="radio"
                            id="package-reserved-radio"
                            name="usedYn"
                            value="R"
                            inputProps={{ label: '예약', custom: true, checked: edit.usedYn === 'R' }}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                handleChangeValue({ name, value, togetherHandlers: [{ name: 'reservDt', value: moment() }] });
                            }}
                        />
                    </div>
                    {edit.usedYn === 'R' && (
                        <>
                            <div style={{ width: 230 }} className="pr-1">
                                <MokaInput
                                    as="dateTimePicker"
                                    name="reservDt"
                                    value={edit.reservDt}
                                    inputProps={{ closeOnSelect: false }}
                                    onChange={(date) => {
                                        handleChangeValue({ name: 'reservDt', value: date });
                                    }}
                                />
                            </div>
                        </>
                    )}
                </Col>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <Col xs={3} className="p-0">
                    <MokaInputLabel as="none" label="유형 선택" required />
                </Col>
                <Col xs={9} className="p-0 d-flex align-items-center">
                    <div style={{ width: 80 }} className="pr-3">
                        <MokaInput
                            as="radio"
                            name="pkgDiv"
                            id="package-topic-radio"
                            value="T"
                            inputProps={{ label: '토픽', custom: true, checked: edit.pkgDiv === 'T' }}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        />
                    </div>
                    <div style={{ width: 80 }} className="pr-3">
                        <MokaInput
                            as="radio"
                            name="pkgDiv"
                            id="package-issue-radio"
                            value="I"
                            inputProps={{ label: '이슈', custom: true, checked: edit.pkgDiv === 'I' }}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        />
                    </div>
                    <div style={{ width: 70 }}>
                        <MokaInput
                            as="radio"
                            name="pkgDiv"
                            id="package-series-radio"
                            value="S"
                            inputProps={{ label: '시리즈', custom: true, checked: edit.pkgDiv === 'S' }}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        />
                    </div>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <Col xs={3} className="p-0 d-flex">
                    <MokaInputLabel as="none" label="시즌/회차 표시" />
                    <div>
                        <div style={{ height: 31 }} className="mb-2 d-flex align-items-center">
                            <MokaInputLabel as="none" label="시즌" />
                        </div>
                        <div style={{ height: 31 }} className="d-flex align-items-center">
                            <MokaInputLabel as="none" label="회차" />
                        </div>
                    </div>
                </Col>
                <Col xs={9} className="p-0">
                    <div className="mb-2 d-flex align-items-center">
                        <div className="pr-3 d-flex align-items-center">
                            <MokaInput
                                as="checkbox"
                                className="pr-1"
                                name="checked"
                                id="package-season1-checkbox"
                                inputProps={{ label: '시즌1', custom: true, checked: edit.seasons[0].checked }}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    handleChangeArrayObjectValue({
                                        target: 'seasons',
                                        subTarget: 0,
                                        name,
                                        value: checked,
                                        togetherHandlers: [{ name: 'value', value: '' }],
                                    });
                                }}
                            />
                            <div style={{ width: 60 }}>
                                <MokaInput
                                    name="value"
                                    value={edit.seasons[0].value}
                                    disabled={!edit.seasons[0].checked}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        handleChangeArrayObjectValue({ target: 'seasons', subTarget: 0, name, value });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="pr-3 d-flex align-items-center">
                            <MokaInput
                                as="checkbox"
                                name="checked"
                                className="pr-1"
                                id="package-season2-checkbox"
                                inputProps={{ label: '시즌2', custom: true, checked: edit.seasons[1].checked }}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    handleChangeArrayObjectValue({
                                        target: 'seasons',
                                        subTarget: 1,
                                        name,
                                        value: checked,
                                        togetherHandlers: [{ name: 'value', value: '' }],
                                    });
                                }}
                            />
                            <div style={{ width: 60 }}>
                                <MokaInput
                                    name="value"
                                    value={edit.seasons[1].value}
                                    disabled={!edit.seasons[1].checked}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        handleChangeArrayObjectValue({ target: 'seasons', subTarget: 1, name, value });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <MokaInput
                                as="checkbox"
                                name="checked"
                                className="pr-1"
                                id="package-season3-checkbox"
                                inputProps={{ label: '시즌3', custom: true, checked: edit.seasons[2].checked }}
                                onChange={(e) => {
                                    const { name, checked } = e.target;
                                    handleChangeArrayObjectValue({
                                        target: 'seasons',
                                        subTarget: 2,
                                        name,
                                        value: checked,
                                        togetherHandlers: [{ name: 'value', value: '' }],
                                    });
                                }}
                            />
                            <div style={{ width: 60 }}>
                                <MokaInput
                                    name="value"
                                    value={edit.seasons[2].value}
                                    disabled={!edit.seasons[2].checked}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        handleChangeArrayObjectValue({ target: 'seasons', subTarget: 2, name, value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div style={{ width: 100 }} className="pr-3">
                            <MokaInput
                                as="checkbox"
                                id="package-epiDiv-checkbox"
                                name="episView"
                                value="1"
                                inputProps={{ label: '회차 표시', custom: true, checked: edit.episView !== '0' }}
                                onChange={(e) => {
                                    const { name, value, checked } = e.target;
                                    let episView = value;
                                    if (!checked) {
                                        episView = '0';
                                    }

                                    handleChangeValue({ name, value: episView });
                                }}
                            />
                        </div>
                        <div style={{ width: 150 }}>
                            <MokaInput
                                as="select"
                                name="episView"
                                className="ft-12"
                                value={edit.episView}
                                disabled={edit.episView === '0'}
                                onChange={(e) => {
                                    handleChangeValue(e.target);
                                }}
                            >
                                <option value="1">1회 → 2회 → ..</option>
                                <option value="P">프롤로그 → 1회 → ..</option>
                            </MokaInput>
                        </div>
                    </div>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <Col xs={3} className="p-0">
                    <MokaInputLabel as="none" label="카테고리 선택(N개)" required />
                </Col>
                <Col xs={9} className="p-0">
                    {/*<Button variant="outline-neutral">카테고리 선택</Button>*/}
                    <ServiceCodeSelector
                        value={edit.catList}
                        onChange={(data) => {
                            if (data.split(',').length > 3) {
                                messageBox.alert('카테고리는 3개를 초과할 수 없습니다.');
                            } else {
                                handleChangeValue({ name: 'catList', value: data });
                            }
                        }}
                        showCodeLabel={true}
                        showAllSelector={false}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <Col xs={3} className="p-0">
                    <MokaInputLabel
                        as="switch"
                        id="package-subsYn-switch"
                        name="scbYn"
                        value="Y"
                        label="구독 가능 여부"
                        inputProps={{ custom: true, checked: edit.scbYn === 'Y' }}
                        onChange={(e) => {
                            const { name, value, checked } = e.target;
                            let scbYn = value;
                            if (!checked) {
                                scbYn = 'N';
                            }
                            handleChangeValue({ name, value: scbYn });
                        }}
                        required
                    />
                </Col>
                <Col xs={9} className="p-0">
                    <p className="mb-0">※ 구독 상품으로 등록되면, 구독 상품명이 자동으로 노출됩니다.</p>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <Col xs={3} className="p-0">
                    <MokaInputLabel as="none" label="패키지명" required />
                    <p className="mb-0 color-primary ft-12">※ 중복 등록 불가/수정 불가</p>
                </Col>
                <Col xs={9} className="p-0 d-flex">
                    <MokaInput
                        name="pkgTitle"
                        className="mr-2"
                        value={edit.pkgTitle}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                    />
                    <Button variant="outline-neutral" style={{ width: 100, height: 31 }} onClick={onDuplicateCheck} disabled={!isDuplicatedTitle}>
                        중복 확인
                    </Button>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2 align-items-center">
                <Col xs={3} className="p-0">
                    <MokaInputLabel as="none" label="패키지 설명" />
                </Col>
                <Col xs={9} className="p-0">
                    <MokaInput
                        name="pkgDesc"
                        value={edit.pkgDesc}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                    />
                    <p className="mb-0">※ 이슈에 대한 간단한 설명과 키워드를 입력해주세요.</p>
                </Col>
            </Form.Row>

            <Form.Row className="mb-2">
                <Col xs={3} className="p-0">
                    <MokaInputLabel
                        as="switch"
                        id="package-recomPkgYn-switch"
                        name="recomPkgYn"
                        label="추천 패키지(N개)"
                        inputProps={{ custom: true, checked: useRecommendIssuePackage }}
                        onChange={() => {
                            setUseRecommendIssuePackage(!useRecommendIssuePackage);
                            if (!useRecommendIssuePackage === false) {
                                handleChangeValue({ name: 'recommPkg', value: '' });
                            }
                        }}
                    />
                </Col>
                <Col xs={9} className="p-0 d-flex">
                    {/*<MokaInput className="mr-2" inputProps={{ readOnly: true }} value={edit.recommPkg} />*/}
                    <div className="flex-fill mr-2">
                        <div className="input-border pl-1 pr-1 pt-1 h-100">
                            {recommendPackages.map((s) => (
                                <Badge key={s} className="mr-1 mb-1 pt-1 user-select-text" variant="searching">
                                    {s}
                                    <MokaIcon
                                        iconName="fas-times"
                                        className="ml-1 cursor-pointer"
                                        onClick={() => {
                                            const removePackages = recommendPackages.filter((pkgSeq) => pkgSeq !== s).join(',');
                                            handleChangeValue({ name: 'recommPkg', value: removePackages });
                                        }}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <Button
                        variant="outline-neutral"
                        onClick={() => {
                            setShowRecommendIssueListModal(true);
                        }}
                    >
                        추천 이슈 선택
                    </Button>
                    <RecommendIssueListModal
                        show={showRecommendIssueListModal}
                        onHide={() => {
                            setShowRecommendIssueListModal(false);
                        }}
                        onAdd={handleClickRecommendPackageAdd}
                    />
                </Col>
            </Form.Row>
        </>
    );
};

export default IssueCommonEdit;
