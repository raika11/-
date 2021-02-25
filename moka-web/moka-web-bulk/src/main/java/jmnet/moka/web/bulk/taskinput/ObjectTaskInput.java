package jmnet.moka.web.bulk.taskinput;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.bulk.common.taskinput.TaskInput;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.util.XMLUtil;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.taskinput
 * ClassName : ObjectTaskInput
 * Created : 2021-02-24 024 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-24 024 오후 1:19
 */
public abstract class ObjectTaskInput extends TaskInput {
    @Override
    public void load(Node node, XMLUtil xu){
    }
}
