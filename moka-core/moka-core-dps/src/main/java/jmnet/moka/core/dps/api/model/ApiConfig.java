package jmnet.moka.core.dps.api.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ApiConfig  {
    private static final List<Api> EMPTY_API_LIST = new ArrayList<Api>();
	@JsonIgnore
	private String path;
	
	private String xmlFile;
	
	@JsonProperty("apiList")
	private Map<String, Api> apiMap;
	
	public ApiConfig(String path, String xmlName) throws Exception {
		this.path = path;
		this.xmlFile = xmlName;
	}

	public void setApiMap(Map<String, Api> apiMap) throws Exception {
		this.apiMap = apiMap;
	}
	
	public String getPath() {
		return this.path;
	}
	
	public boolean hasApi(String id) {
		return apiMap.containsKey(id); 
	}

	public Api getApi(String id) {
		return apiMap.get(id);
	}
	
    public List<Api> search(String searchType, String keyword) {
        if (this.apiMap == null || this.apiMap.size() == 0)
            return EMPTY_API_LIST;
        List<Api> apiList = new ArrayList<Api>(16);
        for (Api api : this.apiMap.values()) {
            if (searchType == null) {
                apiList.add(api);
            } else if (searchType.equals("id")) {
                if (api.getId().equals(keyword)) {
                    apiList.add(api);
                }
            } else if (searchType.equals("idLike")) {
                if (api.getId().contains(keyword)) {
                    apiList.add(api);
                }
            } else if (searchType.equals("description")) {
                if (api.getDescription().contains(keyword)) {
                    apiList.add(api);
                }
            } else if (searchType.equals("all")) {
            	if (api.getId().contains(keyword) || api.getDescription().contains(keyword)) {
                    apiList.add(api);
                }
            } else {
                // 올바르지 않는 검색이며 무시한다.
            }
        }
        return apiList;
    }

	public Map<String, Api> getApiMap() {
		return this.apiMap;
	}
	
	public String getXmlFile() {
		return this.xmlFile;
	}

}
