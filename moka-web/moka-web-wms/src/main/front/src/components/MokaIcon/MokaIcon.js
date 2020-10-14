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
} from '@moka/fontawesome-pro-light-svg-icons';

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
library.add(faNewspaper);
library.add(faAd);
library.add(faHistory);
library.add(faFilePlus);
library.add(faExternalLink);

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
