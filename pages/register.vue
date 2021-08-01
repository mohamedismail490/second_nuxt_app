<template>
  <div class="container col-md-6 mt-5">
    <h2>Register</h2>
    <br>
    <form @submit.prevent="userRegister">
      <div class="form-group">
        <label>Full Name</label>
        <input v-model.trim="form.name" type="text" class="form-control" placeholder="Enter Your Full Name">
        <small v-if="errors.name" class="form-text text-danger">{{ errors.name[0] }}</small>
      </div>
      <div class="form-group">
        <label>Email address</label>
        <input v-model.trim="form.email" type="email" class="form-control" placeholder="Enter Your Email Address">
        <small v-if="errors.email" class="form-text text-danger">{{ errors.email[0] }}</small>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model.trim="form.password" type="password" class="form-control" placeholder="Enter Your Password">
        <small v-if="errors.password" class="form-text text-danger">{{ errors.password[0] }}</small>
      </div>
      <div class="form-group">
        <label>Confirm Password</label>
        <input v-model.trim="form.password_confirmation" type="password" class="form-control" placeholder="Confirm Your Password">
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
    <br>
    <p>Already Have an Account? <nuxt-link to="/login" style="text-decoration: none;">Login</nuxt-link></p>
  </div>
</template>

<script>
export default {
  name: "Register",
  middleware: ['guest'],
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  head: {
    title: 'Register'
  },
  methods: {
    async userRegister() {
      await this.$axios.$post('auth/register', this.form)
        .then(() => {
          this.$auth.loginWith("local", {
            data: {
              email: this.form.email,
              password: this.form.password
            }
          })
            .then(() => {
              // eslint-disable-next-line no-undef
              Toast.fire({
                icon: 'success',
                title: 'Logged In Successfully!'
              });
              this.$router.push({
                path: this.$route.query.redirect || '/profile'
              });
            })
        })
        .catch(err => {
          if (typeof(err.response.data.errors) === 'undefined'){
            // eslint-disable-next-line no-undef
            Toast.fire({
              icon: 'warning',
              title: err.response.data.error
            });
          }
        })
    }
  }
}
</script>
