<template>
  <div>
    <div id="container"></div>
    <button @click="click">下一个</button>
  </div>
</template>

<script>
import { Render } from './three';
let render;

export default {
  name: "ThreeView",
  data() {
     return {
      index: 0,
    };
  },
  methods: {
    click() {
      if (this.index === 2) {
        this.index = -1;
      }
      this.index ++;
      render.loadModel(this.index);
    },
  },
  mounted() {
    const container = document.getElementById('container');
    render = new Render(container);
    render.init();
  }
};
</script>
<style scoped>
#container {
  width: 1000px;
  height: 1000px;
}
</style>