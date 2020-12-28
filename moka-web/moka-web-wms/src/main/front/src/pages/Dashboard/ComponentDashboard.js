import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap';
/*import 'react-summernote/dist/react-summernote.css';*/
import ReactSummernote from 'react-summernote';
import 'react-summernote/lang/summernote-ko-KR';

import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';

import { MokaCard, Moka, MokaIcon } from '@components';

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

    const onChange = (content) => {
        console.log('onChange', content);
    };

    return (
        <Container className="p-0" fluid>
            <Helmet>
                <title>예제 페이지</title>
                <meta name="description" content="예제 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="d-flex moka-summernote">
                <ReactSummernote
                    value="Default value"
                    options={{
                        lang: 'ko-KR',
                        height: 350,
                        dialogsInBody: true,
                        /*toolbar: [
                            ['style', ['style']],
                            ['font', ['bold', 'underline', 'clear']],
                            ['fontname', ['fontname']],
                            ['para', ['ul', 'ol', 'paragraph']],
                            ['table', ['table']],
                            ['insert', ['link', 'picture', 'video']],
                            ['view', ['fullscreen', 'codeview']],
                        ],*/
                    }}
                    onChange={onChange}
                />
            </div>
        </Container>
    );
};

export default ComponentDashboard;
