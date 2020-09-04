package jmnet.moka.core.tms.merge.content;

import java.util.HashMap;
import java.util.Map;

public class Content extends HashMap<String, Object> {
    private static final long serialVersionUID = 71391200543092699L;

    public static Content toContent(Map<String,Object> map) {
        Content content = new Content();
        content.putAll(map);
        return content;
    }
}
