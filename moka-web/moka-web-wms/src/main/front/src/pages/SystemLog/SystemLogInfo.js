import React from 'react';
import { MokaCard } from '@components';
import { Table } from 'react-bootstrap';

const SystemLogInfo = () => {
    return (
        <MokaCard title="로그 정보" titleClassName="mb-0" className="flex-fill">
            <div className="pr-5 pl-5 pb-5 h-100">
                <Table className="w-100 h-100 table-bordered">
                    <tbody>
                        <tr>
                            <th>작업로그 ID</th>
                            <td>82037</td>
                            <th>성공 여부</th>
                            <td>성공</td>
                        </tr>
                        <tr>
                            <th>작업자 ID</th>
                            <td>ssc</td>
                            <th>액션명</th>
                            <td>SELECT</td>
                        </tr>
                        <tr>
                            <th>작업자 IP</th>
                            <td>203.249.148.200</td>
                            <th>메뉴명</th>
                            <td>페이지 관리</td>
                        </tr>
                        <tr>
                            <th>실행시간 (ms)</th>
                            <td>10</td>
                            <th>작업일시</th>
                            <td>2021-01-13 12:41:01</td>
                        </tr>
                        <tr>
                            <th>작업자 IP</th>
                            <td colSpan={3}>preview/page</td>
                        </tr>
                        <tr>
                            <th colSpan={4}>실행 파라미터</th>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                pageBody=sub&pageOrd=2&parent.pageSeq=13&description=설명&pageSeq=34&domain.domainName=중앙모바일&domain.domainUrl=stg-mnews.joongang.co.kr&pageName=정당&urlParam=reporter&pageType=text/html&pageDisplayName=표출&moveYn=N&parent.pageName=정치&usedYn=Y&domain.servicePlatform=P&parent.pageUrl=/politics&fileYn=Y&kwd=민주당,&pageServiceName=sub&pageUrl=/politics/sub&domain.domainId=1000
                                pageBody=sub&pageOrd=2&parent.pageSeq=13&description=설명&pageSeq=34&domain.domainName=중앙모바일&domain.domainUrl=stg-mnews.joongang.co.kr&pageName=정당&urlParam=reporter&pageType=text/html&pageDisplayName=표출&moveYn=N&parent.pageName=정치&usedYn=Y&domain.servicePlatform=P&parent.pageUrl=/politics&fileYn=Y&kwd=민주당,&pageServiceName=sub&pageUrl=/politics/sub&domain.domainId=1000
                            </td>
                        </tr>
                        <tr>
                            <th colSpan={4}>오류 메세지</th>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                pageBody=sub&pageOrd=2&parent.pageSeq=13&description=설명&pageSeq=34&domain.domainName=중앙모바일&domain.domainUrl=stg-mnews.joongang.co.kr&pageName=정당&urlParam=reporter&pageType=text/html&pageDisplayName=표출&moveYn=N&parent.pageName=정치&usedYn=Y&domain.servicePlatform=P&parent.pageUrl=/politics&fileYn=Y&kwd=민주당,&pageServiceName=sub&pageUrl=/politics/sub&domain.domainId=1000
                                pageBody=sub&pageOrd=2&parent.pageSeq=13&description=설명&pageSeq=34&domain.domainName=중앙모바일&domain.domainUrl=stg-mnews.joongang.co.kr&pageName=정당&urlParam=reporter&pageType=text/html&pageDisplayName=표출&moveYn=N&parent.pageName=정치&usedYn=Y&domain.servicePlatform=P&parent.pageUrl=/politics&fileYn=Y&kwd=민주당,&pageServiceName=sub&pageUrl=/politics/sub&domain.domainId=1000
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </MokaCard>
    );
};

export default SystemLogInfo;
