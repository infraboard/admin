<template>
  <div>
    <tips :tips="seTips" type="warn" title="安全提示" />
    <tips :tips="opTips" type="info" title="使用提示" />
  </div>
</template>

<script>
import Tips from '@/components/Tips'

export default {
  name: 'ServiceCredential',
  components: { Tips },
  data() {
    return {
      seTips: [
        '服务凭证是服务间调用的唯一凭证, 默认永不过期, 为了保障系统安全，请妥善保存和定期更换凭证',
        '服务凭证默认具有所有空间的访客权限'
      ],
      opTips: [
        '服务凭证代表服务的身份和所拥有的权限,切勿泄露',
        '服务凭证主要用于服务注册和服务间调用',
        '该服务的操作日志将保存在事件中心'
      ]
    }
  }
}
</script>
