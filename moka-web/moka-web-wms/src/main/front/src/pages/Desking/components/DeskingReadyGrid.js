import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deskingDragStop } from '@store/desking';
import { addDeskingWorkDropzone } from '@utils/deskingUtil';
import toast from '@utils/toastUtil';

/**
 * 다른 컴포넌트워크에 데스킹을 드롭할 수 있도록 드롭존을 생성한다
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
