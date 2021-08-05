<template>
  <div class="container">
    <div class="bg-dark mt-5 mb-5" style="padding: 20px;">
      <h3 class="display-5">{{topic.title}}</h3>

      <div v-if="authenticated">
        <div v-if="user.id === topic.user.id" style="padding-bottom: 10px;">
          <nuxt-link :to="{name:'topics-edit-id',params: {id: topic.id}}" style="text-decoration: none;">
            <button class="btn btn-outline-primary fa fa-edit fa-2x pull-right" style="border: none;"></button>
          </nuxt-link>
        </div>
      </div>
      <p class="text-muted" style="font-size: small;">{{topic.created_since}}&nbsp;<strong>By:</strong>&nbsp;{{topic.user.name}}</p>
      <hr>
      <div v-for="(post, key) in topic.posts" :key="key" class="ml-5 mr-5 content">
        <p>{{post.body}}</p>
        <div v-if="authenticated">
          <div v-if="user.id === post.user.id">
            <button class="btn btn-outline-danger fa fa-trash pull-right" style="border: none;" @click="swalDeletePost(post.id)"></button>
            <nuxt-link :to="{name:'topics-id-posts-post',params: {id: topic.id,post: post.id}}" style="text-decoration: none;">
              <button class="btn btn-outline-success fa fa-edit pull-right" style="border: none;"></button>
            </nuxt-link>
          </div>
        </div>
        <p class="text-muted" style="font-size: small;">{{post.created_since}}&nbsp;<strong>By:</strong>&nbsp;{{post.user.name}}</p>
        <div :ref="'like'+post.id" class="btn fa fa-thumbs-up ml-5 " :class="post.liked_by_user ? 'btn-outline-success' : 'btn-outline-secondary'" @click="toggleLike(topic.id, post)">
          <span :ref="'count'+post.id" class="badge">{{post.likes_count}}</span>
        </div>
        <hr>
      </div>
    </div>
    <div v-if="authenticated" class="m-5">
      <form @submit.prevent="createPost">
        <div class="form-group">
          <h4><b>Add New Post</b></h4>
          <textarea v-model="body" rows="10" class="form-control" placeholder="Write Something....."></textarea>
          <small v-if="errors.body" class="form-text text-danger">{{ errors.body[0] }}</small>
        </div>
        <button type="submit" class="btn btn-outline-primary">Create Post</button>
        <nuxt-link to="/topics" class="btn btn-outline-warning">Back to Topics</nuxt-link>
      </form>
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
        if (typeof(err.response) === 'undefined'){
          return error({statusCode: 503, message: `Service Unavailable (${err.message || 'Network Error'})!!!`});
        }
        return error({ statusCode: 404, message: 'The Topic you are Looking for is Not Found!' })
      });
  },
  data() {
    return {
      topic: {},
      body: ''
    }
  },
  head() {
    return {
      title: this.topic.title
    }
  },
  methods: {
    async createPost() {
      await this.$axios.$post(`/topics/${this.$route.params.id}/posts`, {body: this.body})
        .then(res => {
          if (res.status) {
            this.$nuxt.refresh();
            this.body = '';
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
    },
    swalDeletePost(id) {
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
          this.deletePost(id);
        }
      });
    },
    async deletePost(id) {
      return await this.$axios.$delete(`/topics/${this.$route.params.id}/posts/${id}`)
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
            this.$refs['like'+post.id][0].className = `btn fa fa-thumbs-up ml-5 ${res.is_liked ? "btn-outline-success" : "btn-outline-secondary"}`;
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
</style>
