<template>
  <div class="container col-md-6 mt-5">
    <h2>Edit Post</h2>
    <br>
    <form @submit.prevent="updatePost">
      <div class="form-group">
        <label><b>Body</b></label>
        <textarea v-model="post.body" rows="7" class="form-control" placeholder="Enter Post Body"></textarea>
        <small v-if="errors.body" class="form-text text-danger">{{ errors.body[0] }}</small>
      </div>
      <button type="submit" class="btn btn-outline-info">Update</button>
      <nuxt-link :to="{name: 'topics-id', params: {id: post.topic_id}}" class="btn btn-outline-secondary ">Back to Topic</nuxt-link>
    </form>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  validate({params}) {
    if (/^\d+$/.test(params.id)){
      return /^\d+$/.test(params.post);
    }
    return /^\d+$/.test(params.id);
  },
  async asyncData({$axios,params,error}) {
    return await $axios.$get(`/topics/${params.id}/posts/edit/${params.post}`)
      .then(({data}) => {
        return {post: data}
      })
      .catch(err => {
        if (typeof(err.response) === 'undefined'){
          return error({statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
        }
        return error({ statusCode: 404, message: 'The Post you are Looking for is Not Found!' })
      });
  },
  data(){
    return {
      post: {
        body: ''
      }
    }
  },
  head: {
    title: 'Edit Post'
  },
  methods: {
    async updatePost() {
      await this.$axios.$patch(`/topics/${this.$route.params.id}/posts/${this.$route.params.post}`, {
        body: this.post.body
      })
        .then(res => {
          if (res.status) {
            this.$router.push({name: 'topics-id', params: {id: this.$route.params.id}});
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
