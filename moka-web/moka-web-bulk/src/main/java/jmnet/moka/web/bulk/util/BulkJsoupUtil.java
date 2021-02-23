package jmnet.moka.web.bulk.util;

import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.util
 * ClassName : BulkJsoupUtil
 * Created : 2021-02-08 008 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-08 008 오후 4:37
 */
public class BulkJsoupUtil {
    public static void remove(Element element, boolean all ) {
        boolean removeComplete;
        do {
            removeComplete = true;
            for (Node nodePhoto : element.childNodes()) {
                if ( all || nodePhoto.getClass() != Element.class) {
                    nodePhoto.remove();
                    removeComplete = false;
                    break;
                }
            }
        } while (!removeComplete);
    }

    public static void removeNotElement(Element element) {
        remove( element, false );
    }
}
