package jmnet.moka.core.common.util;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;

public class MokaResourceMapper {

	public static List<Map<String,Object>> getDomainInfoMapList(String mspRoot) throws IOException {
		File domainsJson = ResourceMapper.getFile(mspRoot+"/" + MokaConstants.DOMAINS_JSON);
        return ResourceMapper.readJson(domainsJson, ResourceMapper.TYPEREF_LIST_MAP);
	}

	public static Map<String,Object> getDomainInfoMap(String mspRoot, String domainId) throws IOException {
		List<Map<String,Object>> getDomainInfoMapList = getDomainInfoMapList(mspRoot);
		for (Map<String,Object> domainInfoMap : getDomainInfoMapList) {
            if (domainInfoMap.get(ItemConstants.DOMAIN_ID).equals(domainId)) {
				return domainInfoMap;
			}
		}
		return null;
	}

	public static <T> T getCodeInfoMap(String mspRoot, String domainId, TypeReference<T> returnType) throws IOException {
		File codesJson = new File(getTemplateDomainRootPath(mspRoot, domainId)+"/" + MokaConstants.DOMAIN_CODE_JSON);
		return ResourceMapper.readJson(codesJson, returnType);
	}
	
	public static <T> T getPageInfoMap(String mspRoot, String domainId, String path, TypeReference<T> returnType) throws IOException {
		File pageJson = new File(getPagePath(mspRoot, domainId, path));
		return ResourceMapper.readJson(pageJson, returnType);
	}
	
	public static <T> T getComponentInfoMap(String mspRoot, String domainId, String id, TypeReference<T> returnType) throws IOException {
		File pageJson = new File(getComponentPath(mspRoot, domainId, id));
		return ResourceMapper.readJson(pageJson, returnType);
	}
	
	public static <T> T getTemplateInfoMap(String mspRoot, String domainId, String id, TypeReference<T> returnType) throws IOException {
		File pageJson = new File(getTemplatePath(mspRoot, domainId, id));
		return ResourceMapper.readJson(pageJson, returnType);
	}
	
	public static <T> T getContainerInfoMap(String mspRoot, String domainId, String id, TypeReference<T> returnType) throws IOException {
		File pageJson =new File(getContainerPath(mspRoot, domainId, id));
		return ResourceMapper.readJson(pageJson, returnType);
	}

	public static String getTemplateRootPath(String mspRoot) throws IOException {
		return ResourceMapper.getAbsolutePath(String.join("/",mspRoot, MokaConstants.ROOT_TEMPLATE));
	}

	public static String getTemplateDomainRootPath(String mspRoot, String domainId) throws IOException {
		return String.join("/", getTemplateRootPath(mspRoot),domainId);
	}
	
	public static String getPagePath(String mspRoot, String domainId, String path) throws IOException {
		return String.join("/", getTemplateDomainRootPath(mspRoot, domainId), MokaConstants.ITEM_PAGE,path);
	}
	
	public static String getComponentPath(String mspRoot, String domainId, String id) throws IOException {
		return String.join("/", getTemplateDomainRootPath(mspRoot, domainId), MokaConstants.ITEM_COMPONENT, id);
	}
	
	public static String getTemplatePath(String mspRoot, String domainId, String id) throws IOException {
		return String.join("/", getTemplateDomainRootPath(mspRoot, domainId), MokaConstants.ITEM_TEMPLATE, id);
	}
	
	public static String getContainerPath(String mspRoot, String domainId, String id) throws IOException {
		return String.join("/", getTemplateDomainRootPath(mspRoot, domainId), MokaConstants.ITEM_CONTAINER, id);
	}
}
