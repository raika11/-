import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import Typography from '@material-ui/core/Typography';
import { WmsDialogAlert } from '~/components';
import { deletePage, getPageTree } from '~/stores/page/pageStore';

const DeleteDialog = ({ item, open, onClose }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { pageTree } = useSelector(({ pageStore }) => ({ pageTree: pageStore.pageTree }));
    const [message, setMessage] = useState('');

    // 노드 찾기(재귀함수)
    // 리턴: {findSeq: page.pageSeq,node: null,path: [String(pageTree.pageSeq)]};
    const findNode = useCallback((findInfo, rootNode) => {
        if (rootNode.pageSeq === findInfo.findSeq) {
            return produce(findInfo, (draft) => draft);
        }

        if (rootNode.nodes && rootNode.nodes.length > 0) {
            for (let i = 0; i < rootNode.nodes.length; i++) {
                const newInfo = produce(findInfo, (draft) => {
                    draft.node = rootNode.nodes[i];
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

    useEffect(() => {
        let findInfo = {
            findSeq: item.pageSeq,
            node: null
        };
        let fnode = findNode(findInfo, pageTree);

        let msg;
        if (fnode.node.nodes && fnode.node.nodes.length > 0) {
            msg = `하위 페이지도 삭제됩니다. ${item.pageName}(${item.pageUrl})을(를) 삭제하시겠습니까?`;
        } else {
            msg = `${item.pageName}(${item.pageUrl})을(를) 삭제하시겠습니까?`;
        }
        setMessage(msg);
    }, [pageTree, item, findNode]);

    const handleOk = () => {
        if (item.pageSeq) {
            const option = {
                pageSeq: item.pageSeq,
                callback: (result) => {
                    if (result) {
                        dispatch(getPageTree());
                        history.push('/page');
                    }
                }
            };
            dispatch(deletePage(option));
        }
    };

    return (
        <WmsDialogAlert
            title="페이지 삭제"
            open={open}
            type="delete"
            onClose={onClose}
            okCallback={handleOk}
        >
            <Typography component="p" variant="body1">
                {message}
            </Typography>
        </WmsDialogAlert>
    );
};

export default DeleteDialog;
