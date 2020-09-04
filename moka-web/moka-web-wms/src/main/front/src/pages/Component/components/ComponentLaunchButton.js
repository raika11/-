import React from 'react';
import { useSelector } from 'react-redux';
// import { changeEdit } from '~/stores/template/templateStore';
import { WmsIconButton } from '~/components/WmsButtons';

const ComponentLaunchButton = (props) => {
    const { row } = props;
    // const dispatch = useDispatch();
    const { history } = useSelector(({ templateHistoryStore }) => ({
        history: templateHistoryStore.list
    }));

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const hist = history.find((h) => h.seq === row.seq);
        if (hist) {
            // dispatch(
            //     changeEdit({
            //         key: 'templateBody',
            //         value: hist.templateBody
            //     })
            // );
        }
    };

    return <WmsIconButton icon="post_add" onClick={onClick} />;
};

export default ComponentLaunchButton;
