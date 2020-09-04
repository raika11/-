import React from 'react';
// import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { deleteContainer } from '~/stores/template/templateStore';
import { WmsIconButton } from '~/components/WmsButtons';

const ResourceDeleteButton = (props) => {
    // const { row } = props;
    // let history = useHistory();
    const dispatch = useDispatch();

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch();
        // deleteContainer({
        //     containerSeq: row.containerSeq,
        //     callback: () => {
        //         history.push('/container');
        //     }
        // })
    };

    return <WmsIconButton icon="remove_circle" onClick={onClick} />;
};

export default ResourceDeleteButton;
