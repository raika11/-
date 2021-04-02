/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module.comment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Description: 댓글 차단정보
 *
 * @author ssc
 * @since 2021-04-02
 */
@Getter
@Setter
@Builder
public class Banned {

    public static final String BANNED_TAG_TYPE_IP = "I";
    public static final String BANNED_TAG_TYPE_USER = "U";
    public static final String BANNED_TAG_TYPE_WORD = "W";

    // 등록 성공실패여부
    @Builder.Default
    private boolean banned = true;

    // 차단 태그타입 : I아이피 / U사용자 / W단어
    private String type;

    // 차단된 태그값
    private String value;
    

}
