package jmnet.moka.core.tms.mvc;

import java.util.HashMap;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.utils.McpString;

public class HttpParamMap extends HashMap<String, String> {
    private static final long serialVersionUID = 1564903336157022712L;

    private HttpParamFactory factory;

    public HttpParamMap() {

    }

    public HttpParamMap(HttpParamFactory factory, int size) {
        super(size);
        this.factory = factory;
    }

    public String getMergeUrl(TemplateRoot templateRoot, TemplateElement element,
            MergeContext context) {
        if (this.factory == null)
            return null;
        return this.factory.getMergeUrl(templateRoot, element, context, this);
    }

    public int getInt(String key) {
        String value = this.get(key);
        try {
            if (McpString.isNotEmpty(value)) {
                return Integer.parseInt(value);
            }
        } catch (NumberFormatException e) {
            return Integer.MIN_VALUE;
        }
        return Integer.MIN_VALUE;
    }
}
