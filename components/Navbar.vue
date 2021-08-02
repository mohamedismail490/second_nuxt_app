<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
    <nuxt-link class="navbar-brand" to="/">Frontend</nuxt-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNav" class="collapse navbar-collapse">
      <ul class="navbar-nav">
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/">Home</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/topics">Topics</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/dashboard">Create</nuxt-link>
        </li>
      </ul>
      <ul v-if="authenticated" class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link">{{ user.name }}</a>
        </li>
        <li class="nav-item">
          <a class="nav-link btn" @click.prevent="userLogout">Logout</a>
        </li>
      </ul>
      <ul v-else class="navbar-nav ml-auto">
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/login">Login</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/register">Register</nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    methods: {
      userLogout() {
        this.$auth.logout();
        // eslint-disable-next-line no-undef
        Toast.fire({
          icon: 'success',
          title: 'Logged Out Successfully!'
        });
      }
    }
  }
</script>
