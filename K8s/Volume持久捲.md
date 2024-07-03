# Volume 持久卷
https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumes-typed-hostpath  
Volume用於集群內的Pod存放資源, 與Docker的Volume類似

## Volume PV(PersistentVolume) 與 PVC(PersistentVolumeClaims)關係:
PV定義資源容量大小(設定資源上限), PVC為Pod使用容量(設定Pod的資源使用量)  
1. 一個PV可以給多個PVC使用
2. 掛載PVC時, 若有異常, 則PVC State=Pending
3. 移除PVC時, 若已被Pod掛載, 則PVC State=terminating, 直到Pod被移除, 之後PV State=Release  
4. PV與PVC的AccessModes要一致!
5. Pod Volume使用PVC與hostPath差別: PVC動態鏈靈活性高, hostPath通常用於臨時測試

## PersistentVolume State:  
>**Available**: 未被任何PVC使用, 可以被PVC設定  
>**Bound**: 已經與PVC綁訂  
>**Released**: PVC已被移除, 但未被Cluster收回  
>**Failed**: 自動回收失敗

## 配置項: 
建置流程: PersistentVolume->PersistentVolumeClaim->Pod引用  
關係流程: PV建立儲存資源上限與存放目的地, PVC設定使用大小, Pod調用PVC自動索引到PV資源

```YAML
#-----------------1. PersistentVolume-----------------
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-log
spec:
  accessModes:  # PV與PVC要一致
    - ReadWriteMany
  capacity:
    storage: 100Mi
  hostPath: # 一般會綁GCP雲硬碟等雲服務, 不會放本地
    path: "/pv/log"
    
#-----------------2. PersistentVolumeClaim-----------------
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim-log-1
spec:
  accessModes: # PV與PVC要一致
    - ReadWriteMany 
  resources:
    requests:
      storage: 50Mi

#-----------------3. Pod使用PersistentVolumeClaim(可動態調整)-----------------
apiVersion: v1
kind: Pod
metadata:
  name: webapp
spec:
  volumes:
    - name: log-volum
      persistentVolumeClaim:
        claimName: claim-log-1
  containers:
    - image: kodekloud/event-simulator
      name: event-simulator
      env:
        - name: LOG_HANDLERS
          value: file
      volumeMounts:
      - name: log-volum
        mountPath: /log

#-----------------3. Pod使用hostPath(靜態、臨時用、缺乏靈活性#-----------------
apiVersion: v1
kind: Pod
metadata:
  name: webapp
spec:
  volumes:
    - name: log-volum
      hostPath: /var/log/webapp
  containers:
    - image: kodekloud/event-simulator
      name: event-simulator
      env:
        - name: LOG_HANDLERS
          value: file
      volumeMounts:
      - name: log-volum
        mountPath: /log

```
