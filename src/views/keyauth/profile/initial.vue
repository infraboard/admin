<template>
  <div class="app-container">
    <user-initial />
  </div>
</template>

<script>
import { getProfile } from '@/api/keyauth/profile'
import UserInitial from './components/UserInitial'

export default {
  name: 'DashboardEditor',
  components: { UserInitial },
  data() {
    return {
      profile: {
        is_initialized: true
      }
    }
  },
  created() {
    this.getProfile()
  },
  methods: {
    async getProfile() {
      this.profile = await getProfile()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
