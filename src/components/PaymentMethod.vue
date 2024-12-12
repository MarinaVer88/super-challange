<template>
    <div class=" bg-white p-3 mx-4 mb-2 shadow-sm ">
        <div class="flex justify-between text-lg sm:text-xl">
            <div class="font-semibold">
                Payment method:
            </div>
            <el-button plain v-on:click="isPaymentMethodSectionOpen = !isPaymentMethodSectionOpen">
                Change it
            </el-button>
        </div>
        <div v-if="isPaymentMethodSectionOpen">
            Here you can see and change a payment method
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const isPaymentMethodSectionOpen = ref(false)
</script>