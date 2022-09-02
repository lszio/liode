<template>
  <div @click="handleClick">TestVue</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const handleClick = () => {
      console.log(click);
    };

    return { handleClick };
  },
});
</script>
