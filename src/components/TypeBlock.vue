<script setup lang="ts">
import { ref, type ComponentPublicInstance, inject, onMounted, mergeProps } from 'vue';
import { typeAreaKey } from '../modules/keys';
import DefaultTypeArea from './DefaultTypeArea.vue';
import { type ITypeArea } from '../modules/typeable'
import { isLowerCaseLetter } from '../modules/utility';


const props = defineProps<{ text: string }>();


const TypeArea = inject(typeAreaKey, DefaultTypeArea);
const wordArray: Array<HTMLElement> = [];
let index: number = 0;
const startIndex: number = skip(0);
let typeArea = ref<ITypeArea | null>(null);


function registerSpan(element: Element | ComponentPublicInstance | null) {
    let buf = element as HTMLElement;
    if (buf && buf.textContent)
        wordArray.push(buf);
}

function ready(): void {
    index = startIndex;
    typeArea.value?.update(index);
}

// 跳过不是字母的字符
function skip(start: number): number {
    while (start < props.text.length && !isLowerCaseLetter(props.text[start])) start++;
    return start;
}

function next(key: string): boolean {
    if (key === wordArray[index].textContent) {
        if (++index >= wordArray.length) {
            typeArea.value?.update(index);
            console.log(index);
            return true;
        }
        index = skip(index);
        typeArea.value?.update(index);
        console.log(index);
        return index >= wordArray.length;
    }
    index = startIndex;
    typeArea.value?.update(index);
    console.log(index);
    return false;
}


defineExpose({ next, ready });
</script>


<template>
    <div class="type-block">
        <TypeArea :word="text" :start-index="startIndex" @register="registerSpan" ref="typeArea" />
    </div>
</template>