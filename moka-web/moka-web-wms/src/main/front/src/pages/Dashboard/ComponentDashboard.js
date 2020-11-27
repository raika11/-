import React, { useCallback, useEffect, useState } from 'react';

import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';

import { MokaCard, Moka, MokaIcon } from '@components';
import { Col } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';

const ComponentDashboard = () => {
    const [values, setValues] = useState({ 'moka-input': '', 'moka-checkbox': 'Y', 'moka-select': '', 'moka-radio': 'Y', 'moka-radio2': 'Y' });
    const [treeMenu, setTreeMenu] = useState([]);
    const [selectes, setSelectes] = useState([]);
    const [modifies, setModifies] = useState([]);

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const { menu } = useSelector(
        (store) => ({
            menu: store.auth.menu.children,
        }),
        shallowEqual,
    );

    const handleClickModifyCheckBox = useCallback(
        (classList, type, menuId) => {
            if (!classList.contains('rc-tree-checkbox-checked')) {
                classList.add('rc-tree-checkbox-checked');
                if (type === 'select') {
                    setSelectes([...selectes, menuId]);
                } else if (type === 'modify') {
                    setModifies([...modifies, menuId]);
                }
            } else {
                classList.remove('rc-tree-checkbox-checked');
                if (type === 'select') {
                    setSelectes(selectes.filter((id) => id != menuId));
                } else if (type === 'modify') {
                    setModifies(modifies.filter((id) => id != menuId));
                }
            }
        },
        [modifies, selectes],
    );

    const customLabel = useCallback(
        (title, menuId) => {
            return (
                <div className="cus-label">
                    <span>{title}</span>
                    <span
                        className="rc-tree-checkbox"
                        id={`modify-${menuId}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            const {
                                target: { classList },
                            } = e;
                            handleClickModifyCheckBox(classList, 'modify', menuId);
                        }}
                    />
                </div>
            );
        },
        [handleClickModifyCheckBox],
    );

    useEffect(() => {
        //console.log('selects', selects);
        console.log('modifies', modifies);
    }, [selectes, modifies]);

    const menuConverter = useCallback(
        (menus) => {
            const treeMenus = [];
            if (menus && menus.length > 0) {
                menus.map((menu) => {
                    const menuTitle = customLabel(menu.menuDisplayNm, menu.menuId);
                    let treeMenu = { key: menu.menuId, title: menuTitle, selectable: false };
                    if (menu.children) {
                        const treeChildrens = [];
                        menu.children.map((children) => {
                            const childrenTitle = customLabel(children.menuDisplayNm, children.menuId);
                            treeChildrens.push({ key: children.menuId, title: childrenTitle, selectable: false });
                        });
                        treeMenu.children = treeChildrens;
                    }

                    treeMenus.push(treeMenu);
                });
                console.log(treeMenus);
                setTreeMenu(treeMenus);
            }
        },
        [customLabel],
    );

    const handleCheck = (info) => {
        console.log(info);
        //handleClickSelect({ target: { id: 'modify' } });
    };

    useEffect(() => {
        menuConverter(menu);
    }, [menu, menuConverter]);

    return (
        <Container className="p-0" fluid>
            <Helmet>
                <title>예제 페이지</title>
                <meta name="description" content="예제 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="d-flex">
                <MokaCard>
                    <Moka.Input type="date" name="date" onChange={handleChangeValue}></Moka.Input>
                    <Moka.Input name="moka-input" value={values['moka-input']} onChange={handleChangeValue} />
                    <Moka.CheckBox name="moka-checkbox" label="moka-checkbox" value={values['moka-checkbox']} onChange={handleChangeValue} />
                    <Moka.Radio name="moka-radio" label="moka-radio" value={values['moka-radio']} onChange={handleChangeValue} />
                    <Moka.Select name="moka-select" value={values['moka-select']} onChange={handleChangeValue}>
                        <option value="moka1">moka1</option>
                        <option value="moka2">moka2</option>
                        <option value="moka3">moka3</option>
                    </Moka.Select>
                    <Moka.Label label="타이틀" labelWidth={80}>
                        <Col xs={5}>
                            <Moka.Radio
                                id="moka-radio-group1"
                                name="moka-radio2"
                                label="moka-checkbox"
                                value="Y"
                                checked={values['moka-radio2'] === 'Y'}
                                onChange={handleChangeValue}
                                custom
                            />
                        </Col>
                        <Col xs={5}>
                            <Moka.Radio
                                id="moka-radio-group2"
                                name="moka-radio2"
                                label="moka-checkbox"
                                value="N"
                                checked={values['moka-radio2'] === 'N'}
                                onChange={handleChangeValue}
                                custom
                            />
                        </Col>
                    </Moka.Label>
                </MokaCard>
                <MokaCard>
                    <Moka.Tree treeData={treeMenu} onCheck={handleCheck} />
                </MokaCard>
            </div>
            <MokaIcon iconName="fal-check-circle" />
        </Container>
    );
};

export default ComponentDashboard;
