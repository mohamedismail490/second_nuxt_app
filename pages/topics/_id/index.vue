<template>
  <div class="container">
    <div class="bg-light mt-5 mb-5" style="padding: 20px;">
      <h3 class="display-4">{{topic.title}}</h3>
      <hr>
      <p class="text-muted" style="font-size: small;">{{topic.created_since}}&nbsp;<strong>By:</strong>&nbsp;{{topic.user.name}}</p>
      <div v-for="(post, key) in topic.posts" :key="key" class="ml-5 content">
        {{post.body}}
        <p class="text-muted" style="font-size: small;">{{post.created_since}}&nbsp;<strong>By:</strong>&nbsp;{{post.user.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  validate({params}) {
    return /^\d+$/.test(params.id);
  },
  async asyncData({$axios,params,error}) {
    return await $axios.$get(`/topics/${params.id}`)
      .then(({data}) => {
        return {topic: data}
      })
      .catch(err => {
        if (typeof (err.response.data.errors) === 'undefined') {
          // eslint-disable-next-line no-undef
          return error({ statusCode: 404, message: 'Post not found!' })
        }
      });
  },
  data() {
    return {
      topic: {}
    }
  },
  head() {
    return {
      title: this.topic.title
    }
  }
}
</script>
