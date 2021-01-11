package jmnet.moka.web.bulk.common.taskinput;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.util.XMLUtil;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.input
 * ClassName : TaskInput
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:10
 */
public abstract class TaskInput {
    public abstract void load(Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException;

    public abstract TaskInputData getTaskInputData();
}
