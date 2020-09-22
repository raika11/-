import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const propTypes = {
    /**
     * id
     */
    id: PropTypes.string,
    /**
     * tab object
     * { eventKey, title, content }
     */
    tab: PropTypes.arrayOf(PropTypes.any).isRequired
};

const MokaTabComponent = (props) => {
    const { id, tab, ...rest } = props;
    const [tabList, setTabList] = useState([]);

    useEffect(() => {
        /** tab list */
        setTabList(
            tab.map((t, idx) => (
                <Tab key={idx} eventKey={t.eventKey} title={t.title}>
                    <div className="pt-3">{t.content}</div>
                </Tab>
            ))
        );
    }, [tab]);

    return (
        <Tabs defaultActiveKey={tab[0].eventKey} transition={false} id={id} {...rest}>
            {tabList}
        </Tabs>
    );
};

MokaTabComponent.propTypes = propTypes;

export default MokaTabComponent;
