export default function ({store, route}){
  if (route.fullPath !== '/login' && route.fullPath !== '/register'){
    store.dispatch("redirect/setRedirect", route.fullPath);
  }
}
