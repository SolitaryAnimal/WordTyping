<script setup lang="ts">
import WordBlock from './components/WordBlock.vue';
import { ref, createApp, onMounted, type App } from 'vue';

const mainEle = document.querySelector('#main');

let cutterWordBlock: InstanceType<typeof WordBlock> | null = null;
let wordApp: App<Element> | null = null;

function createWordBlock(wordInof: WordInfo): void {
  wordApp?.unmount();
  wordApp = createApp(WordBlock, { wordInfo: wordInof });
  cutterWordBlock = wordApp.mount('#main') as InstanceType<typeof WordBlock>;
}

onMounted(() => {
  fetch('/words.json').then(r => r.text()).then(t => {
    let data = JSON.parse(t) as Array<WordInfo>;
    createWordBlock(data.shift() as WordInfo);
    document.addEventListener('keypress', e => {
      if (!cutterWordBlock) return;
      if (cutterWordBlock.next(e.key))
        createWordBlock(data.shift() as WordInfo);
    })
  });

});
</script>

<template>
  <div id="main"></div>
</template>

<style scoped></style>