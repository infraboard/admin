<template>
  <div class="app-container">
    <tips :tips="tips" />
  </div>
</template>

<script>
import Tips from '@/components/Tips'

export default {
  name: 'PasswordReset',
  components: { Tips },
  data() {
    return {
      tips: ['你当前密码已经过期, 为了保障资产安全, 请重置密码']
    }
  }
}
</script>
