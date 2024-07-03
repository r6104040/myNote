## 存活Liveness、就緒Readiness 探針
用於監控Pod本身的存活狀態, Pod啟動前, 會經過Readiness->Liveness

<font size=4>Readiness用途:</font>  
Pod重啟或啟動時, <mark>在啟動成功前, 避免被master分配負載, 造成使用者無效訪問 </mark>  
透過 Kubectl describe pod 查看Condition的Read Status=True, 代表Pod準備好接收流量



<font size=4>Liveness用途:</font>  
監控Pod存活, 掛掉就重開, 避免服務中斷, 重開流程readiness ->liveness   
程式寫太好, 造成內存洩漏、死鎖等Bug, 為必免服務中斷, 需要重啟Pod用  
DevOps會查看崩潰日誌訪談Application Developer

<font size=4>配置項:</font> 

```YAML
# 共用設定
initialDelaySeconds: 20 # 探針啟動前的等待時間, Default: 0秒
periodSeconds: 2 # 每2秒執行探測, Default: 10秒
timeoutSeconds: 20 # 探針失敗後, 下一次探測的秒數, Default: 1秒
failureThreshold: 50 # 容許連續失敗50次才算Fail, Default: 1次
successThreshold: 3 # 連續探測3次成功才算OK, Default: 1次
# HTTP探測
httpGet:
  path: /live
  port: 8080
# TCP探測
tcpSocket:
  port: 3306
# 本機文檔探測
exec:
  command:
    - cat
    - /app/is_ready
```


```YAML
apiVersion: v1
kind: Pod
metadata:
  name: busybox-pod
spec:
  containers:
  - name: busybox
    image: busybox:1.28
    readinessProbe: # 就緒探針
      httpGet:
        path: /live
        port: 8080
      initialDelaySeconds: 80
      periodSeconds: 1
      failureThreshold: 8
      tcpSocket:
        port: 3306
      exec:
        command:
          - cat
          - /app/is_ready
    livenessProbe: # 存活探針
      httpGet:
        path: /live
        port: 8080
      periodSeconds: 1
      initialDelaySeconds: 80
```
