import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import style from '~/assets/jss/components/WmsRoute/TreeMenuStyle';
import routes from '~/routes';

/**
 * TreeMenu Style
 */
const useStyles = makeStyles(style);

/**
 * 트리메뉴 생성
 * @param {object} props
 * @param {boolean} props.sidebarMini 미니 체크
 * @param {boolean} props.toggleOpen 토글 체크
 */
const TreeMenu = (props) => {
    const { sidebarMini, toggleOpen } = props;
    const history = useHistory();
    const classes = useStyles();
    const { menu } = useSelector((state) => state.authStore);
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);

    const findNode = useCallback((findInfo, rootNode) => {
        // 부모노드 찾기(재귀함수)
        const rootValue = String(rootNode[findInfo.findKey], '');
        if (findInfo.findValue === rootValue) {
            return produce(findInfo, (draft) => draft);
        }

        if (rootNode.nodes && rootNode.nodes.length > 0) {
            for (let i = 0; i < rootNode.nodes.length; i++) {
                const newInfo = produce(findInfo, (draft) => {
                    draft.node = rootNode.nodes[i];
                    draft.path.push(String(rootNode.nodes[i].seq));
                });
                const fnode = findNode(newInfo, rootNode.nodes[i]);
                if (fnode !== null && fnode.node !== null) {
                    return fnode;
                }
            }
            return null;
        }
        return null;
    }, []);

    const findMatchRoutes = useCallback((findUrl) => {
        const matchRoutes = routes.filter((r) => findUrl.startsWith(r.path));
        if (matchRoutes) {
            let almostRoute = matchRoutes.reduce((prev, current) =>
                prev.path.length > current.path.length ? prev : current
            );
            return almostRoute.path;
        }
        return findUrl;
    }, []);

    useEffect(() => {
        /**
         * 첫 로딩 시, 메뉴트리정보 셋팅.
         * 현재 url에서 일치하는 route.path를 검색
         */
        let findUrl = findMatchRoutes(window.location.pathname);

        // 메뉴트리에서 현재 메뉴의 부모노드들을 배열로 조회
        if (menu.nodes && menu.nodes.length > 0) {
            let findInfo = {
                findKey: 'menuPath',
                findValue: findUrl,
                node: null,
                path: []
            };
            let fnode = findNode(findInfo, menu);
            if (fnode) {
                setExpanded(fnode.path);
                setSelected([String(fnode.node.seq)]);
            }
        }
    }, [menu, findNode, findMatchRoutes]);

    /**
     * 노드 클릭 함수
     * @param {Event} e 이벤트
     * @param {string} value 값
     */
    const handleItemSelect = useCallback(
        (e, value) => {
            e.stopPropagation();
            e.preventDefault();

            if (menu.nodes && menu.nodes.length > 0) {
                let findInfo = {
                    findKey: 'seq',
                    findValue: value,
                    node: null,
                    path: []
                };
                let fnode = findNode(findInfo, menu);
                if (fnode) {
                    // 확장 노드 리스트 변경
                    if (expanded.includes(value)) {
                        // 확장되어있는 상태면 접음
                        setExpanded(expanded.filter((no) => no !== value));
                    } else {
                        // if (expanded.some((fn) => fnode.path.includes(fn))) {
                        //     setExpanded(
                        //         expanded.concat(fnode.path.filter((f) => !expanded.includes(f)))
                        //     );
                        // } else {
                        //     setExpanded(fnode.path);
                        // }
                        setExpanded(fnode.path);
                    }
                    // current 노드 변경
                    setSelected([String(fnode.node.seq)]);
                }
                if (fnode.node.menuPath && fnode.node.menuPath.length > 0) {
                    history.push(fnode.node.menuPath);
                }
            }
        },
        [findNode, history, menu, expanded]
    );

    /**
     * 트리 아이템의 라벨을 렌더링한다
     * @param {object} item 트리아이템
     */
    const renderLabel = useCallback(
        (item) => (
            <>
                <Icon className={classes.gnbIcon}>{item.iconName}</Icon>
                <p
                    className={clsx(classes.displayName, {
                        [classes.displayNameMini]: sidebarMini,
                        [classes.displayNameToggle]: toggleOpen
                    })}
                >
                    {item.menuDispName}
                </p>
            </>
        ),
        [classes, sidebarMini, toggleOpen]
    );

    /**
     * 트리 아이템을 렌더링한다
     * @param {object} item 트리아이템
     * @param {number} idx 순서
     */
    const renderTreeItem = useCallback(
        (item) => {
            let current = findMatchRoutes(window.location.pathname);
            return (
                <TreeItem
                    key={item.seq}
                    nodeId={String(item.seq)}
                    label={renderLabel(item)}
                    classes={{
                        root: classes.gnbList,
                        content: clsx(classes.gnbListContent, {
                            [classes.current]: current === item.menuPath
                        }),
                        iconContainer: classes.gnbListIconContainer,
                        label: classes.gnbLabel,
                        group: classes.gnbListGroup,
                        selected:
                            item.depth === 1
                                ? classes.selected
                                : item.depth === 2
                                ? classes.selected2
                                : classes.selected,
                        expanded: item.depth === 1 ? classes.expanded1 : classes.expanded2
                    }}
                >
                    {sidebarMini && !toggleOpen
                        ? null
                        : item.nodes && item.nodes.length > 0
                        ? item.nodes.map(renderTreeItem)
                        : null}
                </TreeItem>
            );
        },
        [renderLabel, findMatchRoutes, classes, sidebarMini, toggleOpen]
    );

    return (
        <TreeView
            className={classes.gnbTree}
            expanded={expanded}
            selected={selected}
            defaultExpanded={['']}
            defaultSelected={['']}
            defaultCollapseIcon={<Icon>keyboard_arrow_down</Icon>}
            defaultExpandIcon={<Icon>keyboard_arrow_left</Icon>}
            onNodeSelect={handleItemSelect}
        >
            {menu.nodes && menu.nodes.map(renderTreeItem)}
        </TreeView>
    );
};

export default TreeMenu;
