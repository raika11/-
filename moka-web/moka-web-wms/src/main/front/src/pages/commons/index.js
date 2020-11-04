import { initialState as pageInitialState } from '@store/page';
import { initialState as componentInitialState } from '@store/component';
import { initialState as templateInitialState } from '@store/template';
import { initialState as datasetInitialState } from '@store/dataset';
import { initialState as containerInitialState } from '@store/container';
import { initialState as historyInitialState } from '@store/history';

// 검색조건
export const { searchTypeList: defaultPageSearchType } = pageInitialState;
export const { searchTypeList: defaultComponentSearchType } = componentInitialState;
export const { searchTypeList: defaultTemplateSearchType } = templateInitialState;
export const { searchTypeList: defaultDatasetSearchType } = datasetInitialState;
export const { searchTypeList: defaultContainerSearchType } = containerInitialState;
export const { searchTypeList: defaultHistorySearchType } = historyInitialState;

// 공통 모달
export { default as PageListModal } from './PageListModal';
export { default as TemplateListModal } from './TemplateListModal';
export { default as DatasetListModal } from './DatasetListModal';
export { default as SkinListModal, defaultSkinSearchType } from './SkinListModal';
export { default as DefaultInputModal } from './DefaultInputModal';

// 관련 아이템 (하위 => 상위)
export const relationAgGridHeight = 649;
export const relationDSAgGridHeight = 602;
export { default as RelationInPageList } from './RelationInPageList';
export { default as RelationInSKinList } from './RelationInSkinList';
export { default as RelationInContainerList } from './RelationInContainerList';
export { default as RelationInComponentList } from './RelationInComponentList';

// Lookup 아이템 (상위 => 하위)
export const LookupAgGridHeight = 608;
export { default as LookupTemplateList } from './LookupTemplateList';
export { default as LookupComponentList } from './LookupComponentList';
export { default as LookupContainerList } from './LookupContainerList';
export { default as LookupPageList } from './LookupPageList';

// 우측 히스토리 리스트
export { default as HistoryList } from './HistoryList';
