<template>
  <div class="d-flex flex-column">
    <div class="bg flex-fill">
      <div class="flex-center position-ref full-height">
        <div class="content mb-5">
          <div class="title text-light">
            Laravel API Development - JWT
            <br>
            Vue/Nuxt JS Web App 2
          </div>
          <hr style="background-color: unset !important;">
          <nuxt-link to="/dashboard" class="btn btn-outline-primary btn-lg mr-2">Create a Topic</nuxt-link>
          <nuxt-link to="/topics" class="btn btn-outline-warning btn-lg">Browse Topics</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
  html, body {
    background-color: #fff;
    color: #636b6f;
    font-family: 'Nunito', sans-serif;
    font-weight: 200;
    height: 100vh;
    margin: 0;
  }
  .full-height {
    height: 100vh;
  }
  .flex-center {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .content {
    text-align: center;
  }
  .title {
    font-size: 70px;
  }

</style>
