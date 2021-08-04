<template>
  <div class="container col-md-6 mt-5">
    <h2>Edit Topic</h2>
    <br>
    <form @submit.prevent="updateTopic">
      <div class="form-group">
        <label><b>Title</b></label>
        <input v-model="topic.title" type="text" class="form-control" placeholder="Enter Topic Title" autofocus>
        <small v-if="errors.title" class="form-text text-danger">{{ errors.title[0] }}</small>
      </div>
      <button type="submit" class="btn btn-outline-info">Update</button>
      <nuxt-link to="/topics" class="btn btn-outline-secondary ">Back to Topics</nuxt-link>
    </form>
  </div>
</template>

<script>
export default {
  name: "Edit",
  middleware: ['auth'],
  validate({params}) {
    return /^\d+$/.test(params.id);
  },
  async asyncData({$axios,params,error}) {
    return await $axios.$get(`/topics/edit/${params.id}`)
      .then(({data}) => {
        return {topic: data}
      })
      .catch(err => {
        if (typeof(err.response) === 'undefined'){
          return error({ statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
        }
        return error({ statusCode: 404, message: 'The Topic you are Looking for is Not Found!' })
      });
  },
  data(){
    return {
      topic: {
        title: ''
      }
    }
  },
  head: {
    title: 'Edit Topic'
  },
  methods: {
    async updateTopic() {
      await this.$axios.$patch(`/topics/${this.$route.params.id}`, {
        title: this.topic.title
      })
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
