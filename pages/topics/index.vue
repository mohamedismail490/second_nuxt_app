<template>
  <div class="container">
    <h1>Topics</h1>
    <div v-if="topics.length > 0">
      <div v-for="(topic, index) in topics" :key="index" class="bg-light mt-5 mb-5" style="padding: 20px;">
        <h3>{{topic.title}}</h3>
        <p class="text-muted" style="font-size: small;">{{topic.created_since}}&nbsp;<strong>By:</strong>&nbsp;{{topic.user.name}}</p>
        <div v-for="(post, key) in topic.posts" :key="key" class="ml-5 content">
          {{post.body}}
          <p class="text-muted" style="font-size: small;">{{post.created_since}}&nbsp;<strong>By:</strong>&nbsp;{{post.user.name}}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <br><br>
      <h5 class="text-center text-danger">There are No Topics Found!!!</h5>
    </div>

    <nav v-if="meta.total > topics.length">
      <ul class="pagination justify-content-center">
        <li v-for="(value, key) in links" :key="key" class="page-item " :class="value.active ? 'active' : ''">
          <button v-if="value.active" class="page-link active" disabled="disabled">{{value.label}}</button>
          <button v-else-if="value.url === null" class="page-link btnDisabled" disabled="disabled">{{value.label}}</button>
          <button v-else class="page-link" @click="loadMore(value.url)" >{{value.label}}</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  async asyncData({$axios}) {
    return await $axios.$get("/topics")
      .then(({data,meta}) => {
        return {
          topics: data,
          links:meta.links,
          meta
        }
      })
      // eslint-disable-next-line node/handle-callback-err
      .catch(err => {
        if (typeof (err.response.data.errors) === 'undefined') {
          // eslint-disable-next-line no-undef
          Notify('error');
        }
      });
  },
  data() {
    return {
      topics: [],
      links: [],
      meta: []
    }
  },
  methods: {
    async loadMore(value) {
      if (value === null){
        return false;
      }else {
        return await this.$axios.$get(value)
          .then(({data,meta}) => {
            // this.topics = [...this.topics, ...data];
            this.topics = data;
            this.links  = meta.links
          })
          // eslint-disable-next-line node/handle-callback-err
          .catch(err => {});
      }
    }
  }
}
</script>

<style scoped>
  .content{
    border-left: 10px solid white;
    padding: 0 10px 0 10px;
  }
  .btnDisabled{
    color: #58595b;
  }
</style>
