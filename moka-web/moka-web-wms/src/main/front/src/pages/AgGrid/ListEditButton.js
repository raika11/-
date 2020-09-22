import React, { useState } from 'react';
import { faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                charPress: char
            });
            setEditing(true);
        }
    };

    const handleStopEditing = () => {
        api && api.stopEditing();
        setEditing(false);
    };

    return (
        <FontAwesomeIcon
            className="align-middle mr-2"
            icon={editing ? faCheck : faPen}
            fixedWidth
            onClick={editing ? handleStopEditing : handleStartEditing}
        />
    );
};

export default ListEditButton;
