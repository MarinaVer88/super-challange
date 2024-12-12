<template>
    <div class=" bg-white p-3 mx-4 mb-2 shadow-sm ">
        <div class="flex justify-between text-lg sm:text-xl">
            <div class="font-semibold">
                Cart:
            </div>
            <el-button plain v-on:click="isCartInfoSectionOpen = !isCartInfoSectionOpen">
                Open
            </el-button>
        </div>
        <div v-if="isCartInfoSectionOpen">
            Here is your cart information and the sum you need to pay
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const isCartInfoSectionOpen = ref(false)
</script>