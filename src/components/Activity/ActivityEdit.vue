<template>
    <div>ActivityEdit</div>
</template>

<script>
    export default {
        name: "ActivityEdit",
        mounted(){
          let obj={
            DateB: new Date('2018/8/1').getTime(),
            DateE: new Date('2018/8/30').getTime()
          }
          this.$http.get('Event/GetList',{params:obj}).then()
        }

    }
</script>

<style scoped>

</style>
