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
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.rcv.task.jamxml.vo.sub
 * ClassName : AdditionInfoVo
 * Created : 2021-03-03 003 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-03-03 003 오후 3:49
 */

@Getter
@Setter
@XmlRootElement(name = "addtion-info")
@XmlAccessorType(XmlAccessType.FIELD)
public class AdditionInfoVo implements Serializable {
    private static final long serialVersionUID = 5243578965912059871L;

    @XmlElement(name = "art_char_cnt")
    private Integer artCharCnt;

    @XmlElement(name = "work_part")
    private WorkPartVo workPart;

    @XmlElement(name = "art_priority")
    private String artPriority;
}
