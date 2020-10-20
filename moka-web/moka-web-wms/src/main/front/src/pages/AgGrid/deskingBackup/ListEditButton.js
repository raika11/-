import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCheck } from '@moka/fontawesome-pro-solid-svg-icons';

const ListEditButton = (props) => {
    const { api, rowIndex, colKey, char } = props;
    const [editing, setEditing] = useState(false);

    const handleStartEditing = () => {
        if (api) {
            api.setFocusedCell(rowIndex, colKey, null);
            api.startEditingCell({
                rowIndex,
                colKey,
                // rowPinned: pinned,
                // keyPress: key,
                charPress: char,
            });
            setEditing(true);
        }
    };

    const handleStopEditing = () => {
        api && api.stopEditing();
        setEditing(false);
    };

    return <FontAwesomeIcon className="align-middle mr-2" icon={editing ? faCheck : faPen} fixedWidth onClick={editing ? handleStopEditing : handleStartEditing} />;
};

export default ListEditButton;
