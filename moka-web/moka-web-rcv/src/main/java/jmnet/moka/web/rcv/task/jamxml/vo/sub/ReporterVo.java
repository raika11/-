package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

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

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "reporter")
@XmlAccessorType(XmlAccessType.FIELD)
public class ReporterVo implements Serializable {
    private static final long serialVersionUID = 5737911524713864824L;

    @XmlElement(name = "code")
    private String code;

    @XmlElement(name = "jam_rep_seq")
    private String jamRepSeq;

    @XmlElement(name = "jcms_rep_seq")
    private String jcmsRepSeq;

    @XmlElement(name = "name")
    private String name;

    @XmlElement(name = "email")
    private String email;

    @XmlElement(name = "blog")
    private String blog;
}
