

<template>
  <div class="flex flex-col h-screen w-full min-w-80 bg-cover bg-[#f5f8fa] text-slate-700 text-sm sm:text-base">
    <MainNavBar/>
    <div class=" bg-white rounded p-3 mx-4 mb-2 shadow-sm text-base sm:text-lg xl:text-xl">
      Here you can see your checkout details:
    </div>
    <ShoppingOptions/>
    <PaymentMethod/>
    <CartInfo/>
  </div>
  
</template>

<script setup lang="ts">
import MainNavBar from './components/MainNavBar.vue';
import ShoppingOptions from './components/ShoppingOptions.vue';
import PaymentMethod from './components/PaymentMethod.vue';
import CartInfo from './components/CartInfo.vue';

</script>

