import React, { useState, useEffect, Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import style from '~/assets/jss/pages/Template/TemplateStyle';
import { WmsCard } from '~/components';
import ResourceRelationBar from './ResourceRelationBar';

const ResourceRelationHist = React.lazy(() => import('./ResourceRelationHist'));

/**
 * Relation Style
 */
const useStyle = makeStyles(style);
const contentsBarInfo = [{ id: 'hist', name: '히스토리' }];

const Loading = () => <></>;

const ResourceRelationContainer = (props) => {
    const { toggleState, changeAllToggleState } = props;
    const classes = useStyle();
    const [toggle, setToggle] = useState(true);
    const [title] = useState('히스토리');
    const [resourceToggleState, setResourceToggleState] = useState([true]);

    useEffect(() => {
        if (toggleState) {
            const nextState = toggleState[2];
            setToggle(nextState);
            if (nextState) {
                if (resourceToggleState.indexOf(true) < 0) {
                    setResourceToggleState([true]);
                }
            }
        }
    }, [toggleState, resourceToggleState]);

    const [expansion, setExpansion] = useState(false);
    const handleExpansion = () => {
        if (expansion === false) {
            changeAllToggleState([true, true, false]);
            setExpansion(true);
        } else {
            changeAllToggleState([true, true, true]);
            setExpansion(false);
        }
    };

    /**
     * bar component 클릭 콜백
     * @param {string}} id  컴포넌트 ID값
     */
    const showComponent = (id) => {
        // const idx = contentsBarInfo.findIndex((c) => c.id === id);
        handleExpansion();
    };

    return (
        <>
            {toggleState && toggle && (
                <WmsCard title={title} overrideRootClassName={classes.left} width="412">
                    <div className={classes.componentDiv}>
                        <Suspense fallback={<Loading />}>
                            {resourceToggleState[0] && <ResourceRelationHist />}
                        </Suspense>
                    </div>
                </WmsCard>
            )}
            <WmsCard width="50" overrideClassName={classes.contentsbar}>
                <ResourceRelationBar
                    showComponent={showComponent}
                    contentsBarInfo={contentsBarInfo}
                    resourceToggleState={resourceToggleState}
                />
            </WmsCard>
        </>
    );
};

export default ResourceRelationContainer;
