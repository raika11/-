package jmnet.moka.core.dps.api.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.utils.McpString;

public class Acl {
    public static final Logger logger = LoggerFactory.getLogger(Acl.class);
	private String name;
    private Set<String> apiSet;
    private List<String> apiList;
    private List<String> ipGroupNameList;
    Map<String, IpGroup> ipGroupMap;
	
    public Acl(String name, String ipGroupStr, String apiStr, Map<String, IpGroup> ipGroupMap) {
		this.name = name;
        this.ipGroupMap = ipGroupMap;
        if (McpString.isNotEmpty(ipGroupStr)) {
            String[] ipGroupSplit = ipGroupStr.trim().split(",");
            this.ipGroupNameList = Arrays.asList(ipGroupSplit);
        } else {
            this.ipGroupNameList = new ArrayList<String>(0);
        }
        if (McpString.isNotEmpty(apiStr)) {
            String[] apiSplit = apiStr.trim().split("\\s+");
            this.apiList = Arrays.asList(apiSplit);
            this.apiSet = this.apiList.stream().collect(Collectors.toSet());
        } else {
            this.apiList = new ArrayList<String>(0);
            this.apiSet = new HashSet<String>(0);
        }
	}
	
	public String getName() {
		return this.name;
	}
	
    public boolean contains(String api) {
        return this.apiSet.contains(api);
    }

    public List<String> getApiList() {
        return this.apiList;
	}

    public List<String> getIpGroupNameList() {
        return this.ipGroupNameList;
    }
	
    public boolean isAllow(String apiId, String ip) {
        if (this.apiSet.contains(apiId)) {
            for (String ipGroupName : this.ipGroupNameList) {
                IpGroup ipGroup = this.ipGroupMap.get(ipGroupName);
                if (ipGroup == null) {
                    logger.warn("ipGroup Not Found: {}", ipGroupName);
                } else if (ipGroup.isAllow(ip)) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }
}
