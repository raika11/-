import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WmsIconButton } from '~/components/WmsButtons';
import { WmsLaunchDialog } from '~/components/WmsDialog';
import { changeField } from '~/stores/page/pageStore';

const PageLaunchButton = (props) => {
    const { row, bHistory = true } = props;
    const dispatch = useDispatch();
    const { history, list } = useSelector(({ pageHistoryStore, pageRelationPGStore }) => ({
        history: pageHistoryStore.list,
        list: pageRelationPGStore.list
    }));
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
                        key: 'pageBody',
                        value: hist.body
                    })
                );
            }
        } else {
            const page = list.find((h) => h.pageSeq === row.pageSeq);
            if (page) {
                dispatch(
                    changeField({
                        key: 'pageBody',
                        value: page.pageBody
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

export default PageLaunchButton;
