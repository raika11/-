package jmnet.moka.core.common.template;

import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParsedItemDTO {
    private int order;
    private int level;
    private int line;
    private String name;
    private String id;
    private String nodeName;
    private Map<String, String> attributeMap;
}
