import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deskingDragStop } from '@store/desking';
import { addDeskingWorkDropzone } from '@utils/deskingUtil';
import toast from '@utils/toastUtil';

/**
 * 데스킹워크 간의 드롭존 생성
 */
const DeskingReadyGrid = (props) => {
    const { componentAgGridInstances = [], agGridIndex: sourceIdx, component } = props;
    const dispatch = useDispatch();
    const components = useSelector((store) => store.desking.list);

    useEffect(() => {
        if (componentAgGridInstances.length !== components.length) return;

        components.forEach((comp, targetIdx) => {
            if (component.seq === comp.seq) return;

            if (!componentAgGridInstances[sourceIdx]) {
                return;
            }

            if (!componentAgGridInstances[targetIdx]) {
                return;
            }

            const target = componentAgGridInstances[targetIdx];
            addDeskingWorkDropzone(
                (source) => {
                    const payload = {
                        source,
                        target,
                        srcComponent: component,
                        tgtComponent: comp,
                        callback: ({ header }) => {
                            if (!header.success) {
                                toast.fail(header.message);
                            } else {
                                componentAgGridInstances[sourceIdx].api.deselectAll();
                            }
                        },
                    };

                    dispatch(deskingDragStop(payload));
                },
                componentAgGridInstances[sourceIdx],
                target,
                targetIdx,
            );
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentAgGridInstances, sourceIdx, components]);

    return null;
};

export default DeskingReadyGrid;
