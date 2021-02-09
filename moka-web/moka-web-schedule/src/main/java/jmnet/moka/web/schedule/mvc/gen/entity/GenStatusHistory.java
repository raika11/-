package jmnet.moka.web.schedule.mvc.gen.entity;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.entity
 * ClassName : JobStatusHistory
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 12:00
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class GenStatusHistory {

    /**
     * 이력 일련번호
     */
    private Long seqNo;

    /**
     * 작업 번호
     */
    private Long jobSeq;

    /**
     * 0 실행전, 1 완료, 9 실행중, 2~8 에러 번호
     */
    private String status;

    /**
     * 시작 일시
     */
    private Date startDt;

    /**
     * 종료 일시
     */
    private Date endDt;
}
