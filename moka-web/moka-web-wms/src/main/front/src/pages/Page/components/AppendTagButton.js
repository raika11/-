import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import { appendTag } from '~/stores/page/pageStore';
import { WmsIconButton } from '~/components';

const AppendTagButton = ({ itemType, row }) => {
    const dispatch = useDispatch();

    const handleAppendTag = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            let tag = null;
            if (itemType === 'ct') {
                tag = `${new Date().getTime()}<mte:${itemType} id="${row.containerSeq}" name="${
                    row.containerName
                }"/>\n`;
            } else if (itemType === 'cp') {
                tag = `${new Date().getTime()}<mte:${itemType} id="${row.componentSeq}" name="${
                    row.componentName
                }"/>\n`;
            } else if (itemType === 'tp') {
                tag = `${new Date().getTime()}<mte:${itemType} id="${row.templateSeq}" name="${
                    row.templateName
                }"/>\n`;
            } else if (itemType === 'ad') {
                tag = `${new Date().getTime()}<mte:${itemType} id="${row.adSeq}" name="${
                    row.adName
                }"/>\n`;
            }
            dispatch(appendTag(tag));
        },
        [dispatch, itemType, row]
    );

    return (
        <WmsIconButton onClick={handleAppendTag}>
            <NoteAddOutlinedIcon />
        </WmsIconButton>
    );
};

export default AppendTagButton;
