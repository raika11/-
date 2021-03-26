package jmnet.moka.core.dps.api.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.dps.api.handler.PurgeRequestHandler;

public class PurgeRequest extends AbstractRequest {

    private String apiPath;
    private String apiId;
    private List<String> keyList;;

    public PurgeRequest(String type, String apiPath, String apiId, String keys, boolean async) {
        super(type, async, "PURGE");
		this.apiPath = apiPath;
        this.apiId = apiId;
        if (McpString.isNotEmpty(keys)) {
            String[] keysplit = keys.trim().split("\\s+");
            this.keyList = Arrays.asList(keysplit);
        } else {
            this.keyList = new ArrayList<String>(0);
        }
	}

    public String getApiPath() {
        return this.apiPath;
    }

    public String getApiId() {
        return this.apiId;
    }

    public List<String> getKeyList() {
        return this.keyList;
    }
	
	@Override
	public Class<?> getHandlerClass() {
        return PurgeRequestHandler.class;
	}

}
