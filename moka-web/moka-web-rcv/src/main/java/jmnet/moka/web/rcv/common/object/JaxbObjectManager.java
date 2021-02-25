package jmnet.moka.web.rcv.common.object;

import java.io.File;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.task.joinsland.vo.JoinsLandArticleVo;
import jmnet.moka.web.rcv.task.pubxml.vo.PubNewsMLVo;
import jmnet.moka.web.rcv.task.cpxml.vo.CpArticleListVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.task.weathershko.vo.WeatherShkoVo;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.input.object
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
            listUnmarshallerlist.add( new JaxbObjectUnmarshallerImpl<>(JamArticleVo.class) );
            listUnmarshallerlist.add( new JaxbObjectUnmarshallerImpl<>(CpArticleListVo.class) );
            listUnmarshallerlist.add( new JaxbObjectUnmarshallerImpl<>(PubNewsMLVo.class) );
            listUnmarshallerlist.add( new JaxbObjectUnmarshallerImpl<>(WeatherShkoVo.class) );
            listUnmarshallerlist.add( new JaxbObjectUnmarshallerImpl<>(JoinsLandArticleVo.class) );
        } catch (JAXBException ignore) {
        }
    }

    public static BasicVo getBasicVoFromXml(File file, Type objectType)
            throws XMLStreamException {
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
