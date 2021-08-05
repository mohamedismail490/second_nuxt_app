<template>
  <div class="container">
    <h1>Topics</h1>
    <div v-if="topics.length > 0">
      <div v-for="topic in topics" :key="topic.id" class="bg-dark mt-5 mb-5" style="padding: 20px;">
        <h3><nuxt-link :to="{name:'topics-id',params: {id: topic.id}}" style="text-decoration: none;">{{topic.title}}</nuxt-link></h3>
        <div v-if="authenticated">
          <div v-if="user.id === topic.user.id" style="padding-bottom: 10px;">
            <button class="btn btn-outline-danger fa fa-trash fa-2x pull-right" style="border: none;" @click="swalDeleteTopic(topic.id)"></button>
            <nuxt-link :to="{name:'topics-edit-id',params: {id: topic.id}}" style="text-decoration: none;">
              <button class="btn btn-outline-primary fa fa-edit fa-2x pull-right" style="border: none;"></button>
            </nuxt-link>
          </div>
        </div>
        <p class="text-muted" style="font-size: small;">{{topic.created_since}}&nbsp;<strong>By :</strong>&nbsp;{{topic.user.name}}</p>
        <hr>
        <div v-for="post in topic.posts" :key="post.id" class="ml-5 content">
          <p>{{post.body}}</p>
          <p class="text-muted" style="font-size: small;">{{post.created_since}}&nbsp;<strong>By :</strong>&nbsp;{{post.user.name}}</p>
          <div :ref="'like'+post.id" class="btn fa fa-thumbs-up ml-5 mb-2 " :class="post.liked_by_user ? 'btn-outline-success' : 'btn-outline-secondary'" @click="toggleLike(topic.id, post)">
            <span :ref="'count'+post.id" class="badge">{{post.likes_count}}</span>
          </div>
          <hr>
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
  async asyncData({$axios,error}) {
    return await $axios.$get("/topics")
      .then(({data,meta}) => {
        return {
          topics: data,
          links: meta.links,
          meta
        }
      })
      .catch(err => {
        if (typeof(err.response) === 'undefined'){
          return error({statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
        }
        return error({ statusCode: 404, message: 'The Requested Page is Not Found!' })
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
            this.topics = data;
            this.links  = meta.links
          })
          .catch(err => {
            if (typeof(err.response) === 'undefined'){
              return this.$nuxt.error({statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
            }
          });
      }
    },
    swalDeleteTopic(id) {
      // eslint-disable-next-line no-undef
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
      }).then((result) => {
        if (result.value) {
          this.deleteTopic(id);
        }
      });
    },
    async deleteTopic(id) {
      return await this.$axios.$delete(`/topics/${id}`)
        .then(res => {
          if (res.status) {
            this.$nuxt.refresh()
            // eslint-disable-next-line no-undef
            Swal.fire(
              'Deleted!',
              res.message,
              'success'
            )
          } else {
            // eslint-disable-next-line no-undef
            Swal.fire(
              'Error!',
              res.message,
              'error'
            )
          }
        })
        .catch(err => {
          if ((typeof(err.response) !== 'undefined') && (typeof(err.response.data.errors) === 'undefined')){
            // eslint-disable-next-line no-undef
            Swal.fire(
              'Error!',
              'Something wrong happened! Please, try again.',
              'error'
            )
          }else if (typeof(err.response) === 'undefined'){
            return this.$nuxt.error({statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
          }
        })
    },
    async toggleLike(topicId, post) {
      return await this.$axios.$post(`/topics/${topicId}/posts/${post.id}/likes`)
        .then(res => {
          if (res.status) {
            this.$refs['like'+post.id][0].className = `btn fa fa-thumbs-up ml-5 mb-2 ${res.is_liked ? "btn-outline-success" : "btn-outline-secondary"}`;
            this.$refs['count'+post.id][0].innerHTML = res.likes_count;
          } else {
            // eslint-disable-next-line no-undef
            Notify('error', res.message);
          }
        })
        .catch(err => {
          if ((typeof(err.response) !== 'undefined') && (typeof(err.response.data.errors) === 'undefined')){
            if (err.response.status === 401){
              this.$router.push('/login');
              // eslint-disable-next-line no-undef
              Notify('error', "You Must Login First!");
            }else {
              // eslint-disable-next-line no-undef
              Notify('error');
            }
          }else if (typeof(err.response) === 'undefined'){
            return this.$nuxt.error({statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
          }
        })
    }
  }
}
</script>

<style scoped>
  .content{
    border-left: 10px solid #272c31;
    padding: 0 10px 0 10px;
  }
  .btnDisabled{
    color: #707176 !important;
  }
</style>
