import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeTemplateBody } from '~/stores/template/templateStore';
import { WmsIconButton } from '~/components/WmsButtons';
import LaunchDialog from '../dialog/LaunchDialog';

/**
 * 템플릿 히스토리 > 불러오기
 */
const TemplateLaunchButton = (props) => {
    const { row } = props;
    const dispatch = useDispatch();
    const { history } = useSelector(({ templateHistoryStore }) => ({
        history: templateHistoryStore.list
    }));
    const [open, setOpen] = React.useState(false);

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    };

    const okCallback = () => {
        const hist = history.find((h) => h.seq === row.seq);
        if (hist) {
            dispatch(changeTemplateBody(hist.templateBody));
        }
    };

    return (
        <>
            <WmsIconButton icon="post_add" onClick={onClick} />
            <LaunchDialog open={open} onClose={() => setOpen(false)} okCallback={okCallback} />
        </>
    );
};

export default TemplateLaunchButton;
