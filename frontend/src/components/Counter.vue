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
  <div class="p-5 gap-4">
    <h1 class="text-5xl mb-4">Counter</h1>
    <button class="p-3 bg-blue-100 text-blue-500" @click="increment">Increment</button>
    <button class="p-3 bg-yellow-100 text-yellow-500" @click="add50">+50</button>
    <button class="p-3 bg-gray-100 text-gray-500" @click="resetCounter">Reset</button>
    <p class="text-9xl">{{ counterStore.count }}</p>
  </div>
</template>