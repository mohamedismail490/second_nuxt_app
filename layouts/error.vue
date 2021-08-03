<template>
  <div>
    <br>
    <h1 class="text-center">{{ statusCode }}</h1>
    <h2 class="text-center">{{ message }}</h2>
    <nuxt-link to="/" class="nav-link text-center">Go to homepage</nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0'
        }
      ]
    }
  },
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message || 'Error'
    }
  }
}
</script>
