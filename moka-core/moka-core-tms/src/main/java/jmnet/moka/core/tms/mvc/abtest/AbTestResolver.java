package jmnet.moka.core.tms.mvc.abtest;

import java.util.Map;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tms.mvc.abtest
 * ClassName : AbTestResolver
 * Created : 2021-04-14 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-04-14 오후 6:50
 */
public interface AbTestResolver {

    default String getTestKey(String domainId, String componentId) {
        return domainId + ":" + componentId;
    }

    AbTest getAbTest(String domainId, String componentId);

    void addAbTest(AbTest abTest);

    Map getTestMap();

    void removeAbTest(String domainId, String testId);
}
