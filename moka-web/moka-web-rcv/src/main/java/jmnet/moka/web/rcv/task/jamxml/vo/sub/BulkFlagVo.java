package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlValue;
import lombok.Data;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : BulkFlagVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 2:00
 */
@Data
@XmlRootElement(name = "bulk_flag")
@XmlAccessorType(XmlAccessType.FIELD)
public class BulkFlagVo implements Serializable {
    private static final long serialVersionUID = -3376587583130872392L;

    @XmlAttribute(name = "bulk_site")
    private String bulkSite;

    @XmlAttribute(name = "del_site")
    private String delSite;

    @XmlValue
    private String value;
}
