package jmnet.moka.core.tps.mvc.quiz.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 퀴즈문항 보기목록
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_QUIZ_CHOICE")
public class QuizChoice implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 문항일련번호
     */
    @EmbeddedId
    private QuizChoicePK id;

    /**
     * 보기제목
     */
    @Column(name = "TITLE", nullable = false)
    private String title;

    /**
     * 정답여부
     */
    @Column(name = "ANSW_YN")
    @Builder.Default
    private String answYn = MokaConstants.NO;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "QUESTION_SEQ", referencedColumnName = "QUESTION_SEQ", nullable = false, insertable = false, updatable = false)
    private Question question;

}
