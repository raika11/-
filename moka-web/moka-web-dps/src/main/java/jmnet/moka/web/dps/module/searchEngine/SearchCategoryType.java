/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module.searchEngine;

import lombok.Getter;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-13
 */
@Getter
public enum SearchCategoryType {
    UNIFIED_SEARCH(0, "ALL"),                                       // 통합 검색
    NEWS(1, "NEWS"),                                                //뉴스 - 중앙일보, 중앙선데이, 전체뉴스
    JOONGANG_NEWS(2, "issue,ja_sunday,news_ja,news_group"),         //뉴스 - 중앙일보
    JOONGANG_SUNDAY_NEWS(3, "issue,ja_sunday,news_group"),          //뉴스 - 중앙선데이
    TOTAL_NEWS(4, "issue,ja_sunday,news,news_group"),               //뉴스 - 전체뉴스
    RELATION_NEWS(5, "news,issue"),                                 //뉴스 - 관련뉴스
    IMAGE(6, "IMAGE"),                                              //이미지
    VIDEO(7, "VOD"),                                                //동영상
    JOINS(8, "PDF"),                                                //조인스
    PEOPLE(9, "person"),                                            //인물
    JPLUS(10, "jplus"),                                             //J플러스
    BLOG(11, "blog"),                                               //블로그
    ISSUE(12, "issue"),                                             //이슈 - 모바일
    REPORTER(13, "reporter"),                                       //기자 - 모바일
    ISSUE_NEWS(14, "news"),                                         //이슈페이지 - 기사 리스트
    ONLY_JOONGANG_NEWS(15, "news_ja"),                              // 중앙일보 기사만
    UNIFIED_SEARCH_MOBILE(16, "issue,janews_sunday,direct_link,news_image,news_vod,joins_pdf,person,blog,jplus,reporter"),//통합 검색(모바일)
    JOONGANG_NEWS_SUNDAY_NEWS(17, "janews_sunday");                  //뉴스 - 중앙일보, 중앙선데이

    private int code;
    private String value;

    SearchCategoryType(int code, String value) {
        this.code = code;
        this.value = value;
    }
}
