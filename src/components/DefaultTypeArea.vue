<script setup lang="ts">
import { type ComponentPublicInstance, onMounted } from 'vue';

const elements: Array<Element> = [];
let index: number = 0;


const props = defineProps<{ word: string, startIndex: number }>();
const emit = defineEmits<{ (e: 'register', element: Element | ComponentPublicInstance | null): void }>();


function update(target: number): void {
    // if (target > index) {
    //     elements.slice(index, target).forEach(e => e.classList.add('pass'));
    // } else {
    //     elements.slice(target, index + 1).forEach(e => e.classList.remove('pass'));
    // }
    elements.slice(index, target).forEach(e => e.classList.add('pass'));
    index = target;
}

function error(target: number): void {
    elements.slice(props.startIndex, index + 1).forEach(e => e.classList.remove('pass'));
    index = props.startIndex;
}

defineExpose({ update, error });
</script>

<template>
    <div>
        <span v-for="c in word" :ref="(e) => {
            emit('register', e);
            elements.push(e as Element);
        }"> {{ c }} </span>
    </div>
</template>

<style scoped>
.pass {
    color: green;
}
</style>