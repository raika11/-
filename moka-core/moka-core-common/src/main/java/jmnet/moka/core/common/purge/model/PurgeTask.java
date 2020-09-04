package jmnet.moka.core.common.purge.model;

import java.util.ArrayList;
import java.util.List;

public abstract class PurgeTask {
    private List<String> varnishHostList;
    private int varnishPort;
    private List<String> httpHostList;
    private int httpPort;
    private List<PurgeUrl> purgeUrlList;

    public PurgeTask() {
        this.varnishHostList = new ArrayList<String>();
        this.httpHostList = new ArrayList<String>();
        this.purgeUrlList = new ArrayList<PurgeUrl>();
    }

    public void addVarnishHost(String host) {
        this.varnishHostList.add(host);
    }

    public List<String> getVarnishHostList() {
        return this.varnishHostList;
    }

    public void setVarnishPort(int port) {
        this.varnishPort = port;
    }

    public int getVarnishPort() {
        return this.varnishPort;
    }

    public void addHttpHost(String host) {
        this.httpHostList.add(host);
    }

    public List<String> getHttpHostList() {
        return this.httpHostList;
    }

    public void setHttpPort(int port) {
        this.httpPort = port;
    }

    public int getHttpPort() {
        return this.httpPort;
    }

    public void addPurgeUrl(String domain, String url) {
        this.purgeUrlList.add(new PurgeUrl(domain, url));
    }

    public void addPurgeUrl(String domain, String url, boolean isRegExpr) {
        this.purgeUrlList.add(new PurgeUrl(domain, url, isRegExpr));
    }

    public List<PurgeUrl> getPurgeUrlList() {
        return this.purgeUrlList;
    }

    public abstract List<PurgeResult> purge();
}
