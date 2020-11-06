package jmnet.moka.web.rcv.task.jamxml.vo.sub;

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
 * ClassName : WorkerInfoVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 2:47
 */
@Data
@XmlRootElement(name = "worker_info")
@XmlAccessorType(XmlAccessType.FIELD)
public class WorkerInfoVo implements Serializable {
    private static final long serialVersionUID = 2134490930309820881L;

    @XmlElement(name = "worker_id")
    private String workerId;

    @XmlElement(name = "updatetime")
    private String updateTime;
}
