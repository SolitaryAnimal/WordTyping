<script setup lang="ts">
import { ref, type ComponentPublicInstance, onMounted } from 'vue';
import { animation } from '../modules/utility';
import type { isLeftHandSideExpression, transform } from 'typescript';


const props = defineProps<{ word: string, startIndex: number }>();
const emit = defineEmits<{ (e: 'register', element: Element | ComponentPublicInstance | null): void }>();


const elements: Array<Element> = [];
const span = ref<ComponentPublicInstance | null>(null);
const xPos = ref(0);
let index: number = 0;


function update(target: number): void {
    elements.slice(index, target).forEach(e => e.classList.add('pass'));
    index = target;
}

function error(target: number): void {
    elements.slice(props.startIndex, index + 1).forEach(e => e.classList.remove('pass'));
    // 显示错误字符
    let errorEle = elements[index];
    errorEle.classList.add('error');
    index = props.startIndex;
    // 播放动画
    animation(300, (time) => {
        xPos.value = Math.pow(1 - time, 2) * Math.sin(time * 15) * 30;
        if (time === 1) {
            xPos.value = 0;
            errorEle.classList.remove('error');
        }
    });
}

defineExpose({ update, error });
</script>

<template>
    <div ref="span" :style="{ position: 'relative', left: xPos + 'px' }">
        <span v-for="c in word" :ref="(e) => {
            emit('register', e);
            elements.push(e as Element);
        }"> {{ c }} </span>
    </div>
</template>

<style scoped>
.error {
    color: red;
}

.pass {
    color: green;
}
</style>