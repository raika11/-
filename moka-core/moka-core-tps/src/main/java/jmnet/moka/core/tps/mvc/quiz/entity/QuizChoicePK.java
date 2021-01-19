package jmnet.moka.core.tps.mvc.quiz.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 퀴즈문항 보기목록
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class QuizChoicePK implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 문항일련번호
     */
    @Column(name = "QUESTION_SEQ", nullable = false)
    private Long questionSeq;

    /**
     * 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    @Builder.Default
    private Integer ordNo = 1;


}
