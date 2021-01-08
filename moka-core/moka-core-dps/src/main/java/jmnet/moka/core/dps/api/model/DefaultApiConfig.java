package jmnet.moka.core.dps.api.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.dps.api.ApiParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;

public class DefaultApiConfig  {
    private static final Logger logger = LoggerFactory.getLogger(DefaultApiConfig.class);
    private Map<String, Parameter> defaultParameterMap = new LinkedHashMap<String, Parameter>(16);
    private List<Parameter> defaultValueParameterList = new ArrayList<Parameter>(16);
    private HashMap<String, List<Parameter>> parameterGroupMap =
            new LinkedHashMap<String, List<Parameter>>();
    private HashMap<String, List<String>> parameterNameGroupMap =
            new LinkedHashMap<String, List<String>>();
    private Map<String, IpGroup> ipGroupMap;
    private Map<String, Acl> aclMap;
    private Set<String> aclApiSet; // acl이 걸린 api인지 확인을 위한 맵
    private Set<String> refererSet;
    private String apiPath;
	
    public DefaultApiConfig(String apiPath, String defaultConfigXml) throws IOException {
        this.apiPath = apiPath;
        ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
        Resource[] resources = patternResolver.getResources(defaultConfigXml);
        for (Resource resource : resources) {
            if (resource.exists()) {
                try {
                    logger.debug("DefaultApiConfig Resource: {}", resource.getURL());
                    ApiParser apiParser = new ApiParser(resource);
                    addParameterList(apiParser);
                    addParameterGroup(apiParser);
                    this.ipGroupMap = apiParser.getIpGroupMap();
                    this.aclMap = apiParser.getAclMap(this.ipGroupMap);
                    this.aclApiSet = updateAclApiSet();
                    this.refererSet = apiParser.getRefererSet();
                } catch (Exception e) {
                    logger.error("DefaultApiConfig Load Fail:{} {}", resource.getFilename(),
                            e.getMessage());
                }
            } else {
                this.ipGroupMap = new HashMap<String, IpGroup>(0);
                this.aclMap = new HashMap<String, Acl>(0);
                this.aclApiSet = new HashSet<String>(0);
                this.refererSet = new HashSet<>(0);
                logger.error("DefaultApiConfig Not Found:{}", resource.getFilename());
            }
        }
    }

    private Set<String> updateAclApiSet() {
        HashSet<String> newAclApiSet = new HashSet<String>(128);
        for (Acl acl : this.aclMap.values()) {
            for (String api : acl.getApiList()) {
                newAclApiSet.add(api);
            }
        }
        return newAclApiSet;
    }

    private void addParameterList(ApiParser apiParser) throws XPathExpressionException {
        List<Parameter> parameterList = apiParser.getParameterList();
        for (Parameter parameter : parameterList) {
            defaultValueParameterList.add(parameter);
            defaultParameterMap.put(parameter.getName(), parameter);
        }
	}
	
    private void addParameterGroup(ApiParser apiParser) throws XPathExpressionException {
        Map<String, List<String>> map = apiParser.getParameterGroupMap();
        for (Entry<String, List<String>> entry : map.entrySet()) {
            String groupName = entry.getKey();
            List<String> parameterNameList = entry.getValue();
            this.parameterNameGroupMap.put(groupName, parameterNameList);
            List<Parameter> parameterList = new ArrayList<Parameter>(4);
            for (String parameterName : parameterNameList) {
                if (this.defaultParameterMap.containsKey(parameterName)) {
                    parameterList.add(this.defaultParameterMap.get(parameterName));
                }
            }
            this.parameterGroupMap.put(groupName, parameterList);
        }
	}
	
    public boolean isAllow(String apiId, String ip) {
        if (this.aclApiSet.contains(apiId) == false) {
            return true;
        } else {
            for (Acl acl : this.aclMap.values()) {
                if (acl.contains(apiId)) {
                    return acl.isAllow(apiId, ip);
                }
            }
            logger.warn("ACL unexpected false: {} {} {}", this.apiPath, apiId, ip);
            return false;
        }
    }

    public Set<String> getRefererSet() { return this.refererSet; }

    public List<Parameter> getDefaultValueParameterList() {
        return this.defaultValueParameterList;
    }

    public List<String> getParameterNameListByParameterGroup(String parameterGroupName) {
        return this.parameterNameGroupMap.get(parameterGroupName);
	}
	
    public List<Parameter> getParameterListByParameterGroup(String parameterGroupName) {
        return this.parameterGroupMap.get(parameterGroupName);
	}

    public Parameter getDefaultParameter(String parameterName) {
        return this.defaultParameterMap.get(parameterName);
    }

    public List<Parameter> getDefaultParameterList(List<String> parameterNameList) {
        List<Parameter> defaultParameterList = new ArrayList<Parameter>(8);
        for (String parameterName : parameterNameList) {
            if (parameterName.startsWith("#")) {
                List<Parameter> paramInGroup = this.getParameterListByParameterGroup(parameterName);
                if (paramInGroup != null) {
                    defaultParameterList.addAll(paramInGroup);
                }
            } else {
                Parameter parameter = this.defaultParameterMap.get(parameterName);
                if (parameter != null) {
                    defaultParameterList.add(parameter);
                }
            }
        }
        return defaultParameterList;
    }

}
