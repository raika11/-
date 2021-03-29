package jmnet.moka.core.dps.api.model;

import jmnet.moka.core.dps.api.handler.ScriptRequestHandler;

public class ScriptRequest extends AbstractRequest {
    private String scriptContent;


    public ScriptRequest(String type, boolean async, String resultName, String scriptContent) {
        super(type, async, resultName);
        this.scriptContent = scriptContent;
    }

    public String getScriptContent() {
        return this.scriptContent;
    }

    @Override
    public Class<?> getHandlerClass() {
        return ScriptRequestHandler.class;
    }

}
