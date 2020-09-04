import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WmsIconButton } from '~/components/WmsButtons';
import { WmsLaunchDialog } from '~/components/WmsDialog';
import { changeField } from '~/stores/container/containerStore';

const ContainerLaunchButton = (props) => {
    const { row, bHistory = true } = props;
    const dispatch = useDispatch();
    const { history, list } = useSelector(
        ({ containerHistoryStore, containerRelationCTStore }) => ({
            history: containerHistoryStore.list,
            list: containerRelationCTStore.list
        })
    );
    const [open, setOpen] = React.useState(false);

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    };

    const okCallback = () => {
        if (bHistory) {
            const hist = history.find((h) => h.seq === row.seq);
            if (hist) {
                dispatch(
                    changeField({
                        key: 'containerBody',
                        value: hist.body
                    })
                );
            }
        } else {
            const container = list.find((h) => h.containerSeq === row.containerSeq);
            if (container) {
                dispatch(
                    changeField({
                        key: 'containerBody',
                        value: container.containerBody
                    })
                );
            }
        }
    };

    return (
        <>
            <WmsIconButton icon="post_add" onClick={onClick} />
            <WmsLaunchDialog open={open} onClose={() => setOpen(false)} okCallback={okCallback} />
        </>
    );
};

export default ContainerLaunchButton;
