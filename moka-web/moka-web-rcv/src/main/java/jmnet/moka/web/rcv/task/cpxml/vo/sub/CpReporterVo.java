package jmnet.moka.web.rcv.task.cpxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Data;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : ReporterVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 2:14
 */
@Data
@XmlRootElement(name = "reporter")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpReporterVo implements Serializable {
    private static final long serialVersionUID = 2363464590483458560L;

    @XmlElement(name = "name")
    private String name;

    @XmlElement(name = "email")
    private String email;

    @XmlElement(name = "blog")
    private String blog;

    @XmlElement(name = "etc")
    private String etc;
}
