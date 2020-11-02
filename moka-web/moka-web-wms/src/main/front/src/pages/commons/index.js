import { initialState as componentInitialState } from '@store/component';
import { initialState as templateInitialState } from '@store/template';
import { initialState as datasetInitialState } from '@store/dataset';
import { initialState as containerInitialState } from '@store/container';

// 검색조건
export const { searchTypeList: defaultComponentSearchType } = componentInitialState;
export const { searchTypeList: defaultTemplateSearchType } = templateInitialState;
export const { searchTypeList: defaultDatasetSearchType } = datasetInitialState;
export const { searchTypeList: defaultContainerSearchType } = containerInitialState;

// 공통 모달
export { default as TemplateListModal } from './TemplateListModal';
export { default as DatasetListModal } from './DatasetListModal';
export { default as SkinListModal, defaultSkinSearchType } from './SkinListModal';

// 관련 아이템 (하위 => 상위)
export const relationAgGridHeight = 649;
export const relationDSAgGridHeight = 602;
export { default as RelationInPageList } from './RelationInPageList';
export { default as RelationInSKinList } from './RelationInSkinList';
export { default as RelationInContainerList } from './RelationInContainerList';
export { default as RelationInComponentList } from './RelationInComponentList';

// 관련 아이템 (상위 => 하위)
export const relationUNAgGridHeight = 608;
export { default as RelationTemplateList } from './RelationTemplateList';
export { default as RelationComponentList } from './RelationComponentList';
