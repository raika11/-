package jmnet.moka.core.common.template.helper;

public class TemplateMergerHelper {

    //    public static String preview(String mspRoot, String domainId, String pagePath,
    //            TemplateItemInfo itemInfo)
    //            throws IOException, TemplateParseException, TemplateMergeException {
    //        Map<String, String> domainInfoMap = ResourceMapper.getDefaultObjectMapper().convertValue(
    //                MspResourceMapper.getDomainInfoMap(mspRoot, domainId),
    //                new TypeReference<Map<String, String>>() {
    //                });
    //        Map<String, String> codeInfoMap = MspResourceMapper.getCodeInfoMap(mspRoot, domainId,
    //                new TypeReference<Map<String, String>>() {
    //                });
    //        Map<String, String> pageInfoMap = null;
    //        String itemType = itemInfo.getItemType();
    //        if (itemType.equals(MspConstants.ITEM_PAGE)) {
    //            pageInfoMap = ResourceMapper.getDefaultObjectMapper().convertValue(itemInfo,
    //                    new TypeReference<Map<String, String>>() {
    //                    });
    //        } else {
    //            pageInfoMap = MspResourceMapper.getPageInfoMap(mspRoot, domainId, pagePath,
    //                    new TypeReference<Map<String, String>>() {
    //                    });
    //        }
    //
    //        DataLoader dataLoader = getDataLoader(domainInfoMap);
    //        JsonTemplateLoader templateLoader = new JsonTemplateLoader(
    //                MspResourceMapper.getTemplateDomainRootPath(mspRoot, domainId), true);
    //        TemplateLoader<TemplateItemInfo> assistantTemplateLoader = new JsonTemplateLoader(
    //                MspResourceMapper.getTemplateDomainRootPath(mspRoot, MspConstants.DEFAULT_PATH));
    //        MspDefaultTemplateMerger merger =
    //                new MspPreviewTemplateMerger(templateLoader, dataLoader, assistantTemplateLoader);
    //
    //        String itemId = itemInfo.getItemId();
    //        if (itemType.equals(MspConstants.ITEM_PAGE)) {
    //            merger.setItemInfo(itemType, pagePath, itemInfo);
    //        }
    //
    //        String previewPagePath = pageInfoMap.get(MspConstants.PAGE_TEMPLATE_PATH);
    //        StringBuilder sb = new StringBuilder(1024);
    //        try {
    //            MergeContext context = new MergeContext();
    //            context.set(MspConstants.MERGE_CONTEXT_DOMAIN, domainInfoMap);
    //            context.set(MspConstants.MERGE_CONTEXT_CODE, codeInfoMap);
    //            context.set(MspConstants.MERGE_CONTEXT_PAGE, pageInfoMap);
    //            // Htttp 파라미터 설정
    //            context.set(Constants.PARAM, new HashMap<String, Object>());
    //
    //            context.getMergeOptions().setWrapItem(true);
    //            sb = merger.merge(MspConstants.ITEM_PAGE, previewPagePath, context);
    //
    //            return sb.toString();
    //        } catch (Exception e) {
    //            throw new TemplateMergeException("Template Merge Fail : " + e.getMessage(), e);
    //        }
    //    }


    //    private static DataLoader getDataLoader(Map<String, String> domainInfoMap) throws IOException {
    //        String apiHost = domainInfoMap.get(MspConstants.DOMAIN_API_HOST);
    //        String apiPath = domainInfoMap.get(MspConstants.DOMAIN_API_PATH);
    //        DefaultDataLoader defaultDataLoader = new DefaultDataLoader(apiHost, apiPath);
    //        return defaultDataLoader;
    //    }

}
