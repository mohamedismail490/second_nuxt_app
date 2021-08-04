<template>
  <div class="container col-md-6 mt-5">
    <h2>Create New Topic</h2>
    <br>
    <form @submit.prevent="createTopic">
      <div class="form-group">
        <label><b>Title</b></label>
        <input v-model="form.title" type="text" class="form-control" placeholder="Enter Topic Title" autofocus>
        <small v-if="errors.title" class="form-text text-danger">{{ errors.title[0] }}</small>
      </div>
      <div class="form-group">
        <label><b>Body</b></label>
        <textarea v-model="form.body" rows="7" class="form-control" placeholder="Enter Topic Body"></textarea>
        <small v-if="errors.body" class="form-text text-danger">{{ errors.body[0] }}</small>
      </div>
      <button type="submit" class="btn btn-outline-primary">Create</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  middleware: ['auth'],
  data(){
    return {
      form: {
        title: '',
        body: ''
      }
    }
  },
  head: {
    title: 'Create New Topic'
  },
  methods: {
    async createTopic() {
      await this.$axios.$post("/topics", this.form)
        .then(res => {
          if (res.status) {
            this.$router.push('/topics');
            // eslint-disable-next-line no-undef
            Notify('success', res.message);
          } else {
            // eslint-disable-next-line no-undef
            Notify('error', res.message);
          }
        })
        .catch(err => {
          if ((typeof(err.response) !== 'undefined') && (typeof(err.response.data.errors) === 'undefined')){
            // eslint-disable-next-line no-undef
            Notify('error');
          }else if (typeof(err.response) === 'undefined'){
            return this.$nuxt.error({statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
          }
        })
    }
  }
}
</script>
