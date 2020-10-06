<template>
  <div>
    <tips :tips="tips" type="warn" title="安全提示" />
    <tips :tips="tips" type="info" title="使用提示" />
  </div>
</template>

<script>
import Tips from '@/components/Tips'

export default {
  name: 'ServiceCredential',
  components: { Tips },
  data() {
    return {
      tips: ['功能开发中, 敬请期待']
    }
  }
}
</script>
