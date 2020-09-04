package jmnet.moka.core.dps.api.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpString;

public class IpGroup {
	private String name;
    private List<String> allowIpList;
	
    public IpGroup(String name, String ipListStr) {
		this.name = name;
        if (McpString.isNotEmpty(ipListStr)) {
            String[] ipSplit = ipListStr.trim().split("\\s+");
            // ip 비교를 startsWith방식으로 처리하기 위해 *부터 버림
            this.allowIpList = Arrays.stream(ipSplit)
                    .map(ip -> ip.contains("*") ? ip.substring(0, ip.indexOf('*')) : ip)
                    .collect(Collectors.toList());
        } else {
            this.allowIpList = new ArrayList<String>(0);
        }
	}
	
	public String getName() {
		return this.name;
	}
	
    public List<String> getAllowIpList() {
        return this.allowIpList;
	}
	
    public boolean isAllow(String ip) {
        for (String allowIp : this.allowIpList) {
            if (ip.startsWith(allowIp)) {
                return true;
            }
        }
        return false;
	}
}
