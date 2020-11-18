import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deskingDragStop } from '@store/desking';
import toast from '@utils/toastUtil';

const DeskingReadyGrid = (props) => {
    const { componentAgGridInstances, agGridIndex, component, isComponent = false, updateGridCount } = props;
    const dispatch = useDispatch();
    const components = useSelector((store) => store.desking.list);

    useEffect(() => {
        components.forEach((comp, index) => {
            if (!isComponent || component.seq !== comp.seq) {
                const compGrid = document.querySelector(`#agGrid-${comp.seq}`);
                const targetIndex = index;

                const dropZone = {
                    getContainer: () => {
                        return compGrid;
                        //  .ag-body-viewport dom을 return한다
                        // return grid.gridOptionsWrapper.layoutElements[2];
                    },
                    onDragStop: (p) => {
                        if (componentAgGridInstances[targetIndex].api) {
                            const option = {
                                source: p,
                                target: componentAgGridInstances[targetIndex],
                                srcComponent: component,
                                tgtComponent: comp,
                                callback: ({ header }) => {
                                    if (!header.success) {
                                        toast.warn(header.message);
                                    }
                                },
                            };
                            dispatch(deskingDragStop(option));
                        }
                    },
                };

                if (!componentAgGridInstances[agGridIndex].api) {
                    console.warn('AgGrid GridOptions Not Existing');
                    return;
                }

                // 동일한 드롭존이 존재할 수 있으므로 삭제 후 다시 추가한다
                componentAgGridInstances[agGridIndex].api.removeRowDropZone(dropZone);
                componentAgGridInstances[agGridIndex].api.addRowDropZone(dropZone);
            }
        });
        // updateGridCount는 기사목록테이블에서 컴포넌트가 바뀔때마다, dropzone을 추가하기위해 추가함.
    }, [agGridIndex, component, componentAgGridInstances, components, dispatch, isComponent, updateGridCount]);

    return null;
};

export default DeskingReadyGrid;
