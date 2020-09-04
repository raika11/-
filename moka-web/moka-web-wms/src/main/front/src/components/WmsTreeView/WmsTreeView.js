import React, { useCallback, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import WmsTreeViewStyle from '~/assets/jss/components/WmsTreeViewStyle';
import { WmsLoader } from '~/components';
import { MinusSquare, PlusSquare, CloseSquare } from './squareIcon';

/** WmsTreeView Style */
const useStyles = makeStyles(WmsTreeViewStyle);

/**
 * WmsTreeView
 *
 * 주의사항 *
 * 아이콘 버튼으로 확장 토글하기 위해서
 * material tree view의 props onNodeToggle를 사용하지 않는다
 *
 * @param {object} props Props
 * @param {Array<object>} props.data 데이터 배열
 * @param {boolean} props.loading 로딩여부
 * @param {Array<string>} props.expanded 확장된 노드
 * @param {Array<string>} props.selected 선택된 노드
 * @param {Array<string>} props.defaultExpanded 기본 확장노드(불변)
 * @param {Array<string>} props.defaultSelected 기본 선택노드(불변)
 * @param {function} props.onClick 노드 클릭 시 실행
 * @param {function} props.onToggle 확장버튼 클릭 시(토글 시) 실행
 * @param {function} props.onInsert 플러스 클릭 시 실행
 * @param {function} props.onDelete 삭제 클릭 시 실행
 */
const WmsTreeView = (props) => {
    const {
        data,
        loading,
        expanded,
        selected,
        defaultExpanded,
        defaultSelected,
        onToggle,
        onClick,
        onInsert,
        onDelete
    } = props;

    const classes = useStyles();

    /** 노드 클릭 함수 */
    const handleSelect = useCallback(
        (e, nodeIds) => {
            e.stopPropagation();
            e.preventDefault();
            onClick(nodeIds);
        },
        [onClick]
    );

    /** 플러스 클릭 함수 */
    const handleInsert = useCallback(
        (e, item) => {
            e.stopPropagation();
            e.preventDefault();
            onInsert(item);
        },
        [onInsert]
    );

    /** 삭제 클릭 함수 */
    const handleDelete = useCallback(
        (e, item) => {
            e.stopPropagation();
            e.preventDefault();
            if (typeof onDelete === 'function') {
                onDelete(item);
            }
        },
        [onDelete]
    );

    /** 확장 버튼 클릭 함수 */
    const handleExpand = useCallback(
        (e, item, isExpanded) => {
            e.preventDefault();
            e.stopPropagation();
            if (item.nodes) {
                if (typeof onToggle === 'function') {
                    onToggle(item, isExpanded);
                }
            }
        },
        [onToggle]
    );

    /** 라벨 생성 함수 */
    const renderLabel = useCallback(
        (item) => {
            const isExpandedItem = expanded.includes(String(item.pageSeq));
            return (
                <div className={classes.labelRoot}>
                    {/* 확장/축소 아이콘 */}
                    <IconButton
                        className={classes.iconButton}
                        onClick={(e) => handleExpand(e, item, isExpandedItem)}
                    >
                        {item.nodes && isExpandedItem ? (
                            <MinusSquare />
                        ) : item.nodes ? (
                            <PlusSquare />
                        ) : (
                            <MinusSquare />
                        )}
                    </IconButton>
                    {/* 트리 아이템명 */}
                    <Typography
                        className={clsx(classes.labelText, {
                            [classes.labelTextHighlighted]: item.match
                        })}
                    >
                        {item.pageName}
                    </Typography>
                    {/* 우측 박스(필요에 의해 추가) */}
                    {onInsert && onDelete && (
                        <Box
                            className="extraBox"
                            display="flex"
                            visibility={item.btnShow ? 'visible' : 'hidden'}
                        >
                            <IconButton
                                aria-label="write"
                                classes={{ root: classes.labelIcon }}
                                onClick={(e) => handleInsert(e, item)}
                            >
                                <Icon>add_circle</Icon>
                            </IconButton>
                            <IconButton
                                aria-label="delete"
                                classes={{ root: classes.labelIcon }}
                                onClick={(e) => handleDelete(e, item)}
                            >
                                <Icon>remove_circle</Icon>
                            </IconButton>
                        </Box>
                    )}
                </div>
            );
        },
        [classes, expanded, handleExpand, handleInsert, onInsert, handleDelete, onDelete]
    );

    /** 트리아이템 생성 함수 */
    const renderTreeItem = useCallback(
        (item) => {
            const depth = item.pageUrl.split('/').filter((t) => t !== '').length;
            return (
                <TreeItem
                    key={item.pageSeq}
                    nodeId={String(item.pageSeq)}
                    label={renderLabel(item)}
                    style={{
                        '--tree-item-depth': `${depth * 16 + 3}px`,
                        '--tree-item-useYn': `${item.useYn === 'Y' ? 'black' : '#7F7F7F'}`,
                        '--tree-item-dash': `${depth * 16 + 14}px`
                    }}
                    classes={{
                        root: clsx(classes.root, {
                            [classes.dash]: item.nodes
                        }),
                        content: classes.content,
                        label: classes.label,
                        selected: classes.selected,
                        expanded: classes.expanded,
                        group: classes.group,
                        iconContainer: classes.iconContainer
                    }}
                    className="nodeBox"
                >
                    {item.nodes && item.nodes.length > 0 ? item.nodes.map(renderTreeItem) : null}
                </TreeItem>
            );
        },
        [renderLabel, classes]
    );

    return (
        <TreeView
            defaultExpanded={defaultExpanded}
            defaultSelected={defaultSelected}
            expanded={expanded}
            selected={selected}
            onNodeSelect={handleSelect}
            className={classes.treeview}
        >
            {loading && <WmsLoader loading={loading} overrideClassName={classes.loader} />}
            {data && renderTreeItem(data)}
        </TreeView>
    );
};

export default WmsTreeView;
