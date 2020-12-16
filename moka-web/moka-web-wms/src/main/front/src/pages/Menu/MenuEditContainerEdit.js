import React, { useEffect, useState } from 'react';
import { MokaInputLabel, MokaCard } from '@components';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { clearMenu, getMenu, saveMenu, changeMenu, duplicateCheckId, changeSearchOption, changeInvalidList, GET_MENU, SAVE_MENU } from '@store/menu';
import toast from '@/utils/toastUtil';

const labelWidth = 101;
const MenuEditContainerEdit = (props) => {
    const dispatch = useDispatch();
    const { handleClickDelete, menuSeq, depth, parentMenuId } = props;
    const [usedYn, setUsedYn] = useState('Y');
    const [menuId, setMenuId] = useState('');
    const [menuNm, setMenuNm] = useState('');
    const [menuDisplayNm, setMenuDisplayNm] = useState('');
    const [iconNm, setIconNm] = useState('');
    const [menuUrl, setMenuUrl] = useState('');
    const [menuOrder, setMenuOrder] = useState('');
    const [regId, setRegId] = useState('');
    const [regDt, setRegDt] = useState('');
    const [modId, setModId] = useState('');
    const [modDt, setModDt] = useState('');

    const [menuIdError, setMenuIdError] = useState(false);
    const [menuNmError, setMenuNmError] = useState(false);
    const [menuDisplayNmError, setMenuDisplayNmError] = useState(false);
    const [iconNmError, setIconNmError] = useState(false);
    const [menuUrlError, setMenuUrlError] = useState(false);

    const { menu, loading, invalidList } = useSelector(
        (store) => ({
            menu: store.menu.menu,
            loading: store.loading[GET_MENU] || store.loading[SAVE_MENU],
            invalidList: store.menu.invalidList,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (menuSeq) {
            dispatch(getMenu(menuSeq));
        } else {
            dispatch(clearMenu());
        }
    }, [dispatch, menuSeq]);

    useEffect(() => {
        // 메뉴 데이터 셋팅
        setMenuId(menu.menuId || '');
        setUsedYn(menu.usedYn || 'Y');
        setMenuNm(menu.menuNm || '');
        setMenuDisplayNm(menu.menuDisplayNm || '');
        setIconNm(menu.iconNm || '');
        setMenuUrl(menu.menuUrl || '');
        setMenuOrder(menu.menuOrder || '');
        setRegId(menu.regId || '');
        setRegDt(menu.regDt || '');
        setModId(menu.modId || '');
        setModDt(menu.modDt || '');
    }, [menu]);

    /**
     * 저장 이벤트
     * @param event 이벤트 객체
     */
    const handleClickSave = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const menuItem = {
            menuSeq,
            parentMenuId,
            menuId,
            menuNm,
            menuDisplayNm,
            depth,
            usedYn,
            menuOrder,
            menuUrl,
            iconNm,
        };

        if (validate(menuItem)) {
            if (menuSeq) {
                updateMenu(menuItem);
            } else {
                insertMenu(menuItem);
            }
        }
    };

    /**
     * 메뉴 등록
     * @param {object} menuItem 메뉴정보
     */
    const insertMenu = (menuItem) => {
        dispatch(
            duplicateCheckId({
                menuId,
                callback: (response) => {
                    console.log(response);
                    const { body } = response;
                    if (!body) {
                        dispatch(
                            saveMenu({
                                type: 'insert',
                                actions: [
                                    changeMenu({
                                        ...menu,
                                        ...menuItem,
                                    }),
                                    changeSearchOption({
                                        menuId: menuId,
                                        depth: depth,
                                        parentMenuId: parentMenuId,
                                        useTotal: false,
                                    }),
                                ],
                                callback: (response) => {
                                    if (response.header.success) {
                                        toast.success(response.header.message);
                                        dispatch(clearMenu());
                                    } else {
                                        const { body } = response;
                                        dispatch(changeInvalidList(body.list));
                                        toast.error(response.header.message);
                                    }
                                },
                            }),
                        );
                    } else {
                        setMenuIdError(true);
                        toast.error('중복된 메뉴ID가 존재합니다.');
                    }
                },
            }),
        );
    };

    /**
     * 메뉴 수정
     * @param {object} tmp 도메인
     */
    const updateMenu = (menuItem) => {
        dispatch(
            saveMenu({
                type: 'update',
                actions: [
                    changeMenu({
                        ...menu,
                        ...menuItem,
                    }),
                    changeSearchOption({
                        depth: depth,
                        parentMenuId: parentMenuId,
                        useTotal: false,
                    }),
                ],
                callback: (response) => {
                    if (response.header.success) {
                        toast.success(response.header.message);
                    } else {
                        const { body } = response;
                        dispatch(changeInvalidList(body.list));
                        toast.error(response.header.message);
                    }
                },
            }),
        );
    };

    /**
     * 각 항목별 값 변경
     * @param target javascript event.target
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;
        switch (name) {
            case 'menuId':
                setMenuId(value);
                break;
            case 'menuNm':
                setMenuNm(value);
                break;
            case 'menuDisplayNm':
                setMenuDisplayNm(value);
                break;
            case 'menuUrl':
                setMenuUrl(value);
                break;
            case 'iconNm':
                setIconNm(value);
                break;
            case 'usedYn':
                setUsedYn(checked ? 'Y' : 'N');
                break;
            default:
                break;
        }
    };

    /**
     * 유효성 검사를 한다.
     * @param menu 메뉴 정보를 가진 객체
     * @returns {boolean} 유효성 검사 결과
     */
    const validate = (menuItem) => {
        let isInvalid = false;
        let errList = [];

        // 메뉴ID 체크
        if (!/[0-9]{2,8}$/.test(menuItem.menuId)) {
            errList.push({
                field: 'menuId',
                reason: '메뉴ID를 2~8자리 숫자로 입력하세요.',
            });
            isInvalid = isInvalid | true;
        }

        // 메뉴명 체크
        if (!(!/[\s\t\n]+/.test(menuItem.iconNm) && /[0-9a-zA-Z]{1,50}$/.test(menuItem.menuNm))) {
            errList.push({
                field: 'menuNm',
                reason: '메뉴ID는 숫자 영문만 가능하며, 1~50자리로 입력하세요.',
            });
            isInvalid = isInvalid | true;
        }
        // 메뉴노출명 체크
        if (!(!/[\t\n]+/.test(menuItem.menuDisplayNm) && /(.){1,50}$/.test(menuItem.menuDisplayNm))) {
            errList.push({
                field: 'menuDisplayNm',
                reason: '메뉴 노출명을 1~50자리로 입력하세요',
            });
            isInvalid = isInvalid | true;
        }
        // 메뉴ICON 체크
        if (!(!/[\s\t\n]+/.test(menuItem.iconNm) && /(.){0,200}$/.test(menuItem.iconNm))) {
            errList.push({
                field: 'iconNm',
                reason: '메뉴Icon은 공백이 허용되지 않습니다.',
            });
            isInvalid = isInvalid | true;
        }
        // 메뉴페이지 URL 체크
        if (!(!/[\s\t\n]+/.test(menu.menuUrl) && /(.){0,512}$/.test(menuItem.menuUrl))) {
            errList.push({
                field: 'menuUrl',
                reason: '메뉴페이지URL은 공백이 허용되지 않습니다.',
            });
            isInvalid = isInvalid | true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    useEffect(() => {
        let errorMessage = '';
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'menuId') {
                    setMenuIdError(true);
                }
                if (i.field === 'menuNm') {
                    setMenuNmError(true);
                }
                if (i.field === 'menuDisplayNm') {
                    setMenuDisplayNmError(true);
                }
                if (i.field === 'iconNm') {
                    setIconNmError(true);
                }
                if (i.field === 'menuUrl') {
                    setMenuUrlError(true);
                }
                errorMessage += '<p>' + i.reason + '</p>';
            });
            toast.error(errorMessage);
        } else {
            setMenuIdError(false);
            setMenuNmError(false);
            setMenuDisplayNmError(false);
            setIconNmError(false);
            setMenuUrlError(false);
        }
    }, [invalidList]);

    return (
        <MokaCard className="w-100" titleClassName="mb-0 pb-0" title="메뉴정보">
            {loading && <div className="opacity-box"></div>}
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            className="mb-0"
                            label="사용여부"
                            labelWidth={labelWidth}
                            as="switch"
                            placeholder="사용여부를 입력하세요"
                            id="usedYn"
                            name="usedYn"
                            inputProps={{ checked: usedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                {menuSeq ? (
                    <Form.Row className="mb-2">
                        <Col xs={12} className="p-0">
                            <Form.Label className="px-0 mb-0 position-relative mr-3 form-label" style={{ width: labelWidth, minWidth: labelWidth }}>
                                메뉴ID
                            </Form.Label>
                            <Form.Label className="form-label">{menuId}</Form.Label>
                        </Col>
                    </Form.Row>
                ) : (
                    <Form.Row className="mb-2">
                        <Col xs={12} className="p-0">
                            <MokaInputLabel
                                className="mb-0"
                                label="메뉴ID"
                                labelWidth={labelWidth}
                                name="menuId"
                                value={menuId}
                                isInvalid={menuIdError}
                                onChange={handleChangeValue}
                                placeholder="메뉴ID를 2~8자리 숫자로 입력하세요."
                                inputProps={{ autoComplete: 'off' }}
                            />
                        </Col>
                    </Form.Row>
                )}
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            className="mb-0"
                            label="메뉴명"
                            labelWidth={labelWidth}
                            name="menuNm"
                            value={menuNm}
                            isInvalid={menuNmError}
                            onChange={handleChangeValue}
                            placeholder="메뉴명를 입력하세요."
                            inputProps={{ autoComplete: 'off' }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            className="mb-0"
                            label="메뉴노출명"
                            labelWidth={labelWidth}
                            name="menuDisplayNm"
                            value={menuDisplayNm}
                            isInvalid={menuDisplayNmError}
                            onChange={handleChangeValue}
                            placeholder="메뉴 노출명을 입력하세요."
                            inputProps={{ autoComplete: 'off' }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            className="mb-0"
                            label="메뉴ICON"
                            labelWidth={labelWidth}
                            name="iconNm"
                            value={iconNm}
                            isInvalid={iconNmError}
                            onChange={handleChangeValue}
                            placeholder="메뉴 ICON을 입력하세요."
                            inputProps={{ autoComplete: 'off' }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            className="mb-0"
                            label="메뉴페이지 URL"
                            labelWidth={labelWidth}
                            name="menuUrl"
                            value={menuUrl}
                            isInvalid={menuUrlError}
                            onChange={handleChangeValue}
                            placeholder="메뉴페이지 URL을 입력하세요."
                            inputProps={{ autoComplete: 'off' }}
                        />
                    </Col>
                </Form.Row>
                {menuSeq ? (
                    <>
                        <Form.Row className="mb-2">
                            <Col xs={12} className="p-0">
                                <Form.Label className="px-0 mb-0 position-relative mr-3  form-label" style={{ width: labelWidth, minWidth: labelWidth }}>
                                    등록자
                                </Form.Label>
                                <Form.Label className="form-label">{regId}</Form.Label>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12} className="p-0">
                                <Form.Label className="px-0 mb-0 position-relative mr-3  form-label" style={{ width: labelWidth, minWidth: labelWidth }}>
                                    등록일시
                                </Form.Label>
                                <Form.Label className="form-label">{regDt}</Form.Label>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12} className="p-0">
                                <Form.Label className="px-0 mb-0 position-relative mr-3  form-label" style={{ width: labelWidth, minWidth: labelWidth }}>
                                    수정자
                                </Form.Label>
                                <Form.Label className="form-label">{modId}</Form.Label>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12} className="p-0">
                                <Form.Label className="px-0 mb-0 position-relative mr-3  form-label" style={{ width: labelWidth, minWidth: labelWidth }}>
                                    수정일시
                                </Form.Label>
                                <Form.Label className="form-label">{modDt}</Form.Label>
                            </Col>
                        </Form.Row>
                    </>
                ) : (
                    ''
                )}
                <Form.Group className="d-flex pt-20 justify-content-center">
                    <Button type="submit" className="float-left mr-10 pr-20 pl-20" variant="positive" onClick={handleClickSave}>
                        저장
                    </Button>
                    {menuSeq ? (
                        <Button className="float-left mr-0 pr-20 pl-20" variant="negative" onClick={handleClickDelete}>
                            삭제
                        </Button>
                    ) : (
                        ''
                    )}
                </Form.Group>
            </Form>
        </MokaCard>
    );
};

export default MenuEditContainerEdit;
