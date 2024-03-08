<script setup lang="ts">
import { useTodoStore } from "../../stores/todo.ts";
import { onMounted } from "vue";

const todoStore = useTodoStore();

const {
  fetch,
  data: todos,
  loading
} = todoStore;

onMounted(async() => {
  await fetch();
});

</script>

<template>
  <div class="p-5 gap-4">
    <h1 class="text-5xl mb-4">TODO</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="todo in todos.value" :key="todo.id">
        <div class="flex justify-between">
          <p class="text-2xl">{{ todo.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>