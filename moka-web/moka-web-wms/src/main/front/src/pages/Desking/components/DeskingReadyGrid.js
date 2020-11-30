import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deskingDragStop } from '@store/desking';
import { makeDeskingWorkDropzone } from '@utils/agGridUtil';
import toast from '@utils/toastUtil';

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

            let dropzone = makeDeskingWorkDropzone(
                (source) => {
                    const payload = {
                        source,
                        target,
                        srcComponent: component,
                        tgtComponent: comp,
                        callback: ({ header }) => {
                            if (!header.success) {
                                toast.warning(header.message);
                            } else {
                                componentAgGridInstances[sourceIdx].api.deselectAll();
                            }
                        },
                    };

                    dispatch(deskingDragStop(payload));
                },
                target,
                targetIdx,
            );

            if (dropzone) {
                // 동일한 드롭존이 존재할 수 있으므로 삭제 후 다시 추가한다
                componentAgGridInstances[sourceIdx].api.removeRowDropZone(dropzone);
                componentAgGridInstances[sourceIdx].api.addRowDropZone(dropzone);
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentAgGridInstances, sourceIdx, components]);

    return null;
};

export default DeskingReadyGrid;
