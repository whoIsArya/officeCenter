<template>
    <div>ActivityEdit</div>
</template>

<script>
    export default {
        name: "ActivityEdit",
        mounted(){
          let obj={
            DateB: 1533052800
          }
          this.$http.get('Event/GetList',{params:obj}).then()
        }

    }
</script>

<style scoped>

</style>
