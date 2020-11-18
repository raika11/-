import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deskingDragStop } from '@store/desking';
import toast from '@utils/toastUtil';

const DeskingReadyGrid = (props) => {
    const { componentAgGridInstances = [], agGridIndex, component } = props;
    const dispatch = useDispatch();
    const components = useSelector((store) => store.desking.list);

    useEffect(() => {
        if (componentAgGridInstances.length !== components.length) return;

        components.forEach((comp, targetIdx) => {
            if (component.seq === comp.seq) return;

            if (!componentAgGridInstances[agGridIndex]) {
                console.warn('AgGrid GridOptions Not Existing');
                return;
            }

            if (!componentAgGridInstances[targetIdx]) {
                console.warn('AgGrid GridOptions Not Existing');
                return;
            }

            const target = componentAgGridInstances[targetIdx];

            const dropZone = {
                getContainer: () => target.api.gridOptionsWrapper.layoutElements[2],
                onDragStop: (source) => {
                    const payload = {
                        source,
                        target,
                        srcComponent: component,
                        tgtComponent: comp,
                        callback: ({ header }) => {
                            if (!header.success) {
                                toast.warn(header.message);
                            }
                        },
                    };

                    dispatch(deskingDragStop(payload));
                },
            };

            // 동일한 드롭존이 존재할 수 있으므로 삭제 후 다시 추가한다
            componentAgGridInstances[agGridIndex].api.removeRowDropZone(dropZone);
            componentAgGridInstances[agGridIndex].api.addRowDropZone(dropZone);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentAgGridInstances, components]);

    return null;
};

export default DeskingReadyGrid;
