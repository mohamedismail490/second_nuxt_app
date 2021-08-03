<template>
  <div class="container">
    <div class="bg-light mt-5 mb-5" style="padding: 20px;">
      <h3 class="display-4">{{topic.title}}</h3>
      <hr>
      <div v-if="authenticated">
        <div v-if="user.id === topic.user.id">
          <nuxt-link :to="{name:'topics-edit-id',params: {id: topic.id}}" style="text-decoration: none;">
            <button class="btn btn-outline-primary fa fa-edit fa-2x pull-right" style="border: none;"></button>
          </nuxt-link>
        </div>
      </div>
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
      // eslint-disable-next-line node/handle-callback-err
      .catch(err => {
        return error({ statusCode: 404, message: 'The Topic you are Looking for is Not Found!' })
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
