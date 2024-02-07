<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import TypeBlock from './TypeBlock.vue';


defineProps<{
    wordInfo: WordInfo;
}>();


const typeBlocks: Array<InstanceType<typeof TypeBlock>> = [];
let index: number = 0;


function registerTypeBlock(block: ComponentPublicInstance | Element | null): void {
    typeBlocks.push(block as InstanceType<typeof TypeBlock>);
}

function next(key: string): boolean {
    if (typeBlocks[index].next(key)) {
        typeBlocks[++index]?.ready();
        return index >= typeBlocks.length;
    }
    return false;
}


defineExpose({ next });
</script>

<template>
    <div class="word-block">
        <div id="word">
            <TypeBlock :text="wordInfo.word" :ref="registerTypeBlock" />
        </div>
        <div id="main-tra">
            <div class="zh">
                {{ wordInfo.mainTra.type + wordInfo.mainTra.zh }}
            </div>
            <div class="pys">
                <TypeBlock v-for="py in wordInfo.mainTra.py" :text="py" :ref="registerTypeBlock" />
            </div>
        </div>
        <table id="tras">
            <tr v-for="tra in wordInfo.tras">
                <td>{{ tra.type }}</td>
                <td>{{ tra.tras.join('; ') }}</td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
.word-block {
    display: grid;
    grid-template-rows: 1fr, 1fr, 1fr;
}

#word {
    font-size: 5rem;
}

#main-tra {
    font-size: 3.5rem;

    display: grid;
    grid-template-rows: 1fr 1fr;
}

#main-tra .zh {
    display: inline-block;
    text-align: center;
}

#main-tra .pys {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 为拼音添加空格 */
#main-tra .pys div:not(:last-child) {
    margin-right: 0.25em;
}

#tras .type {
    text-align: right;
}

#tras .zh {
    text-align: left;
}
</style>