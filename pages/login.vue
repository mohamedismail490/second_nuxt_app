<template>
  <div class="container col-md-6 mt-5">
    <h2>Login</h2>
    <br>
    <form @submit.prevent="userLogin">
      <div class="form-group">
        <label>Email address</label>
        <input v-model.trim="form.email" type="email" class="form-control" placeholder="Enter Email">
        <small v-if="errors.email" class="form-text text-danger">{{ errors.email[0] }}</small>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model.trim="form.password" type="password" class="form-control" placeholder="Enter Password">
        <small v-if="errors.password" class="form-text text-danger">{{ errors.password[0] }}</small>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <br>
    <p>Don't Have an Account? <nuxt-link to="/register" style="text-decoration: none;">Register</nuxt-link></p>
  </div>
</template>

<script>
export default {
  name: "Login",
  middleware: ['guest'],
  data(){
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  head: {
    title: 'Login'
  },
  methods: {
    async userLogin() {
      if (this.authenticated) {
        // eslint-disable-next-line no-undef
        Toast.fire({
          icon: 'error',
          title: 'Already Logged in !!!'
        });
      }else {
        await this.$auth.loginWith("local", {
          data: this.form
        })
          .then(() => {
            // eslint-disable-next-line no-undef
            Toast.fire({
              icon: 'success',
              title: 'Logged In Successfully!'
            });
            this.$router.push({
              path: this.backRoute || '/dashboard'
            });
          })
          // eslint-disable-next-line node/handle-callback-err
          .catch((err) => {
            if ((typeof(err.response) !== 'undefined') && (typeof(err.response.data.errors) === 'undefined')){
              // eslint-disable-next-line no-undef
              Toast.fire({
                icon: 'warning',
                title: err.response.data.error
              });
            }else if (typeof(err.response) === 'undefined'){
              return this.$nuxt.error({statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
            }
          })
      }
    }
  }
}
</script>
