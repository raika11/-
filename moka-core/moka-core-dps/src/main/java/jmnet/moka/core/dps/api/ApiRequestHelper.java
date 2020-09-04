package jmnet.moka.core.dps.api;

import static java.util.Collections.singleton;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.http.HttpMethod;
import com.fasterxml.classmate.TypeResolver;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.dps.api.model.Api;
import jmnet.moka.core.dps.api.model.ApiConfig;
import jmnet.moka.core.dps.api.model.DefaultApiConfig;
import jmnet.moka.core.dps.api.model.Parameter;
import springfox.documentation.builders.OperationBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiDescription;
import springfox.documentation.service.Operation;
import springfox.documentation.service.ResponseMessage;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.ApiListingScannerPlugin;
import springfox.documentation.spi.service.contexts.DocumentationContext;
import springfox.documentation.spring.web.readers.operation.CachingOperationNameGenerator;

public class ApiRequestHelper implements ApiListingScannerPlugin {
    public static final Logger logger = LoggerFactory.getLogger(ApiRequestHelper.class);
    private static final String SYS_API = "sys_api";
    private static final List<Api> EMPTY_API_LIST = new ArrayList<Api>();
    private Map<String, List<ApiConfig>> apiConfigMappingMap;
    private Map<String, DefaultApiConfig> defaultApiConfigMappingMap;
	private String configBasePath;
    private String configSysBasePath;
	private String apiXmlFileName;
    private String defaultConfigXml;
    //    private DefaultApiConfig defaultApiConfig;

    @Autowired
    public ApiRequestHelper(String configBasePath, String configSysBasePath, String apiXmlFileName,
            String defaultConfigXml)
            throws Exception {
		this.configBasePath = configBasePath;
        this.configSysBasePath = configSysBasePath;
		this.apiXmlFileName = apiXmlFileName;
        this.defaultConfigXml = defaultConfigXml;
		this.apiConfigMappingMap = new HashMap<String, List<ApiConfig>>(16);
        this.defaultApiConfigMappingMap = new HashMap<String, DefaultApiConfig>(16);
        // 시스템 기본 api 설정 로드
        if (configSysBasePath != null && configSysBasePath.trim().length() > 0) {
            loadFromBasePath(this.configSysBasePath);
        }
        // dps별 api 설정 로드
        loadFromBasePath(this.configBasePath);
    }

    private void loadFromBasePath(String basePath) throws Exception {
        ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
        Resource[] resources = patternResolver.getResources(basePath + "/**/" + apiXmlFileName);
        Set<String> pathSet = new HashSet<String>(8);
        for ( Resource resource : resources) {
            String resourcePath = resource.getURL().getPath();
            String[] splits = resourcePath.split("/");
            if (splits.length > 2) {
                String path = splits[splits.length - 2];
                pathSet.add(path);
            }
        }
        for (String apiPath : pathSet) {
            load(apiPath);
        }

	}
	
    public void load(String apiPath) throws Exception {
        ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
        Resource[] resources = null;

        DefaultApiConfig defaultApiConfig = null;
        if (apiPath.equals(SYS_API)) {
            defaultApiConfig = new DefaultApiConfig(apiPath,
                    String.join("/", configSysBasePath, apiPath, defaultConfigXml));
            resources = patternResolver
                    .getResources(String.join("/", configSysBasePath, apiPath, apiXmlFileName));
        } else {
            defaultApiConfig = new DefaultApiConfig(apiPath,
                    String.join("/", configBasePath, apiPath, defaultConfigXml));
            resources = patternResolver
                    .getResources(String.join("/", configBasePath, apiPath, apiXmlFileName));
        }
        this.defaultApiConfigMappingMap.put(apiPath, defaultApiConfig);

        ArrayList<ApiConfig> apiConfigList = new ArrayList<ApiConfig>(8);
        for (Resource resource : resources) {
            logger.debug("Api Resource: {}", resource.getURL());
            ApiParser apiParser = new ApiParser(resource, defaultApiConfig);
            ApiConfig apiConfig = new ApiConfig(apiPath, resource.getFilename());
            Map<String, Api> apiMap = apiParser.getApiMap(apiConfig);
            apiConfig.setApiMap(apiMap);
            apiConfigList.add(apiConfig);
        }
        if (apiConfigList.size() > 0) {
            this.apiConfigMappingMap.put(apiPath, apiConfigList);
        }
    }

    public DefaultApiConfig getDefaultApiConfig(String apiPath) {
        return this.defaultApiConfigMappingMap.get(apiPath);
    }

    public List<String> getApiPathList() {
        ArrayList<String> pathList = new ArrayList<String>();
        if (this.apiConfigMappingMap != null) {
            for (String apiPath : this.apiConfigMappingMap.keySet()) {
                if (apiPath.equals(SYS_API) == false) {
                    pathList.add(apiPath);
                }
            }
        }
        return pathList;
    }

    private Api getApi(List<ApiConfig> apiConfigList, String apiId) {
		if ( apiConfigList != null ) {
			for ( ApiConfig apiConfig : apiConfigList) {
                Api api = apiConfig.getApi(apiId);
				if ( api != null ) {
					return api;
				}
			}
		}
		return null;
	}

//	public Api getApi(HttpServletRequest request) {
//		ApiResolver apiResolver = new ApiResolver(request);
//		return getApi(this.apiConfigMappingMap.get(apiResolver.getPath()), apiResolver.getId());
//	}
	
    public Api getApi(String apiPath, String apiId) {
        return getApi(this.apiConfigMappingMap.get(apiPath), apiId);
	}
	
    public boolean apiRequestExists(ApiResolver apiResolver) {
		return  getApi(this.apiConfigMappingMap.get(apiResolver.getPath()), apiResolver.getId()) == null? false:true;
	}

    public boolean apiRequestExists(String apiPath, String apiId) {
        return getApi(this.apiConfigMappingMap.get(apiPath), apiId) == null ? false : true;
	}

    public boolean apiPathExists(String apiPath) {
        return this.apiConfigMappingMap.get(apiPath) == null ? false : true;
    }
		
    public Object getApiList(String apiPath) {
        if (apiPath == null) {
			return this.apiConfigMappingMap;			
        } else if (this.apiConfigMappingMap.containsKey(apiPath)) {
            return this.apiConfigMappingMap.get(apiPath);
		} else {
			return "Path Not Found";
		}
	}

    public List<Api> getApiSearch(String apiPath, String searchType, String keyword) {
        if (apiPath == null) {
            return EMPTY_API_LIST;
        }
        if (this.apiConfigMappingMap.containsKey(apiPath)) {
            List<Api> apiList = new ArrayList<Api>(16);
            for (ApiConfig apiConfig : this.apiConfigMappingMap.get(apiPath)) {
                apiList.addAll(apiConfig.search(searchType, keyword));
            }
            return apiList;
        } else {
            return EMPTY_API_LIST;
        }
    }

    @Override
    public boolean supports(DocumentationType delimiter) {
        return DocumentationType.SWAGGER_2.equals(delimiter);
    }

    private Set<ResponseMessage> responseMessages() { //<8>
        return singleton(new ResponseMessageBuilder().code(200)
                .message("Successfully received response")
                .responseModel(new ModelRef("string")).build());
    }

    @Autowired
    private CachingOperationNameGenerator operationNames;


    @Override
    public List<ApiDescription> apply(DocumentationContext context) {
        ArrayList<ApiDescription> arrayList = new ArrayList<ApiDescription>();
        for (Entry<String, List<ApiConfig>> entry : this.apiConfigMappingMap.entrySet()) {
            String apiGroup = entry.getKey();
            Set<String> tagSet = new HashSet<String>();
            tagSet.add(apiGroup);
            List<ApiConfig> apiList = entry.getValue();
            for (ApiConfig apiConfig : apiList) {
                for (Entry<String, Api> apiEntry : apiConfig.getApiMap().entrySet()) {
                    Api api = apiEntry.getValue();
                    String apiPath = "/" + apiConfig.getPath() + "/" + api.getId();
                    arrayList.add(new ApiDescription("dataApi", apiPath,
                            api.getDescription(),
                            makeOperation(api), false));
                }
            }
        }

        return arrayList;
    }

    private List<Operation> makeOperation(Api api) {
        Set<String> tagSet = new HashSet<String>();
        tagSet.add(api.getApiConfig().getPath());

        List<Operation> apiOperationList = new ArrayList<Operation>(4);
        apiOperationList.add(new OperationBuilder(operationNames).authorizations(new ArrayList<>())
                .tags(tagSet)
                .summary(api.getDescription() + " [ " + api.getApiConfig().getXmlFile() + " ]")
                .codegenMethodNameStem(api.getId())
                .method(HttpMethod.GET).notes(api.getDescription()).parameters(getApiParameter(api))
                .responseMessages(responseMessages()).responseModel(new ModelRef("string"))
                .build());
        return apiOperationList;
    }

    private List<springfox.documentation.service.Parameter> getApiParameter(Api api) {
        List<springfox.documentation.service.Parameter> apiParamList =
                new ArrayList<springfox.documentation.service.Parameter>(4);
        for (Parameter dpsParam : api.getParameterMap().values()) {
            String description = dpsParam.getDesc()
                    + (McpString.isEmpty(dpsParam.getFilter()) ? ""
                            : " , Filter = " + dpsParam.getFilter())
                    + (McpString.isEmpty(dpsParam.getHints()) ? ""
                            : " , Hints = " + dpsParam.getHints());
            apiParamList.add(new ParameterBuilder()
                    .description(description)
                    .type(new TypeResolver().resolve(String.class)).name(dpsParam.getName())
                    .defaultValue(dpsParam.getDefaultValueStr())
                    .parameterType("query").parameterAccess("access").required(dpsParam.isRequire())
                    .modelRef(new ModelRef("string"))
                    .build());
        }
        return apiParamList;
    }
}
