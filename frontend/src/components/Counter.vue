<script setup lang="ts">
import { useCounterStore} from "../stores/counter.ts";

const counterStore = useCounterStore();

function increment() {
  counterStore.increment();
}

function resetCounter() {
  counterStore.$reset();
}

function add50() {
  counterStore.$patch({
    count: counterStore.count + 50
  });
}

</script>

<template>
  <h1>Counter</h1>
  <button @click="increment">Increment</button>
  <button @click="add50">+50</button>
  <button @click="resetCounter">Reset</button>
  {{ counterStore.count }}
</template>