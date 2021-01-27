package jmnet.moka.web.bulk.common.object;

import java.io.File;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import jmnet.moka.web.bulk.common.vo.BasicVo;
import jmnet.moka.web.bulk.task.bulkdump.env.BulkDumpEnv;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.input.object
 * ClassName : JaxbObjectManager
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오후 2:26
 */
@Slf4j
public class JaxbObjectManager {
    static final List<JaxbObjectUnmarshaller> listUnmarshallerlist = new ArrayList<>();

    static {
        try {
            listUnmarshallerlist.add( new JaxbObjectUnmarshallerImpl<>(BulkDumpEnv.class));
        } catch (JAXBException e) {
            log.error("JaxbObjectManager Exeption {}", e.getMessage());
            e.printStackTrace();
        }
    }

    public static BasicVo getBasicVoFromXml(File file, Type objectType)
            throws XMLStreamException, JAXBException {
        for( JaxbObjectUnmarshaller unmarshaller : listUnmarshallerlist )
            if( unmarshaller.getObjectType() == objectType )
                return unmarshaller.getBasicVoFromXml(file);

        log.error ( "JaxbObjectManager :: Not Defined object Type ");
        return null;
    }

    public static BasicVo getBasicVoFromString(String string, Type objectType)
            throws XMLStreamException, JAXBException {
        for( JaxbObjectUnmarshaller unmarshaller : listUnmarshallerlist )
            if( unmarshaller.getObjectType() == objectType )
                return unmarshaller.getBasicVoFromString( string );

        log.error ( "JaxbObjectManager :: Not Defined object Type ");
        return null;
    }
}
