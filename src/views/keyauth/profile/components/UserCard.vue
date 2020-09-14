<template>
  <div class="app-container">
    <tips :tips="tips" />
  </div>
</template>

<script>
import Tips from '@/components/Tips'

export default {
  name: 'DashboardEditor',
  components: { Tips },
  data() {
    return {
      tips: ['功能开发中, 敬请期待']
    }
  }
}
</script>
