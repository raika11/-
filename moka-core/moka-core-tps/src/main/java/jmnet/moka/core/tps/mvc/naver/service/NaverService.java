/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.service;

import java.io.IOException;
import jmnet.moka.core.common.exception.NoDataException;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-10
 */
public interface NaverService {

    /**
     * 네이버스탠드 전송(html,xml전송)
     *
     * @param areaSeq 편집영역순번
     */
    boolean publishNaverStand(Long areaSeq)
            throws Exception;

    /**
     * 네이버 채널 전송(json전송)
     *
     * @param areaSeq 편집영역순번
     */
    boolean publishNaverChannel(Long areaSeq)
            throws IOException, NoDataException;
}
