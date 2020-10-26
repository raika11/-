import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faCoffee } from '@moka/fontawesome-pro-light-svg-icons';
import {
    faAngleDoubleLeft,
    faSearch,
    faExpandArrows,
    faCompressArrowsAlt,
    faArrowToRight,
    faRepeat,
    faFile,
    faFileAlt,
    faBox,
    faBallot,
    faNewspaper,
    faAd,
    faHistory,
    faFilePlus,
    faExternalLink,
    faEllipsisV,
    faPlus as falPlus,
    faMinus as falMinus,
    faThList,
    faFileImport,
    faFileSearch,
    faCopy,
    faCloudUpload,
    faMinusSquare,
    faMinus,
    faSignOutAlt,
    faCalendarAlt as falCalendarAlt,
    faMinusCircle as falMinusCircle,
    faClock as falClock,
} from '@moka/fontawesome-pro-light-svg-icons';
import { faAngleLeft, faAngleRight } from '@moka/fontawesome-pro-solid-svg-icons';
import { faImage as fadImage } from '@moka/fontawesome-pro-duotone-svg-icons';

// 아이콘 등록
library.add(faCoffee);
library.add(faAngleDoubleLeft);
library.add(faSearch);
library.add(faExpandArrows);
library.add(faCompressArrowsAlt);
library.add(faArrowToRight);
library.add(faRepeat);
library.add(faFile);
library.add(faFileAlt);
library.add(faBox);
library.add(faBallot);
library.add(faRepeat);
library.add(faNewspaper);
library.add(faAd);
library.add(faHistory);
library.add(faFilePlus);
library.add(faExternalLink);
library.add(faEllipsisV);
library.add(faAngleLeft);
library.add(faAngleRight);
library.add(falPlus);
library.add(falMinus);
library.add(faThList);
library.add(faFileImport);
library.add(faFileSearch);
library.add(faCopy);
library.add(faCloudUpload);
library.add(faMinusSquare);
library.add(faMinus);
library.add(faSignOutAlt);
library.add(fadImage);
library.add(falCalendarAlt);
library.add(falMinusCircle);
library.add(falClock);

const propTypes = {
    /**
     * iconName
     * string으로 들어오는 경우 fal-coffee => ['fal','coffee'] 로 변환함
     */
    iconName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};
const defaultProps = {};

/**
 * fontawesome 아이콘 라이브러리
 */
const MokaIcon = (props) => {
    const { iconName, ...rest } = props;

    if (typeof iconName === 'string') {
        const prefix = iconName.slice(0, 4);
        const rIconName = iconName.slice(4, iconName.length);
        let iconArray = ['fal', iconName];

        if (prefix === 'fal-') {
            iconArray = ['fal', rIconName];
        } else if (prefix === 'fas-') {
            iconArray = ['fas', rIconName];
        } else if (prefix === 'far-') {
            iconArray = ['far', rIconName];
        } else if (prefix === 'fab-') {
            iconArray = ['fab', rIconName];
        } else if (prefix === 'fad-') {
            iconArray = ['fad', rIconName];
        }

        return <FontAwesomeIcon icon={iconArray} {...rest} />;
    } else if (Array.isArray(iconName)) {
        return <FontAwesomeIcon icon={iconName} {...rest} />;
    }

    return null;
};

MokaIcon.propTypes = propTypes;
MokaIcon.defaultProps = defaultProps;

export default MokaIcon;
