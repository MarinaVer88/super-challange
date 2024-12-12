<template>
    <div class=" bg-white p-3 mx-4 mb-2 shadow-sm">
        <div class="flex justify-between">
            <div class="flex flex-col lg:flex-row">
                <div class="flex flex-col sm:flex-row items-start sm:items-center">
                    <div class="font-semibold text-lg sm:text-xl pe-2">Shopping address:</div>
                    <div>
                        <span v-if="!selectedAddressId" class="text-red-400 text-semibold text-xs sm:text-base pe-2">
                        Don't forget to select your address
                    </span>
                    <span v-else class="text-sm sm:text-base">
                        <span class="pe-1" v-if="selectedAddress?.country">{{ selectedAddress?.country }},</span>
                        <span class="pe-1" v-if="selectedAddress?.state">{{ selectedAddress?.state }},</span>
                        <span class="pe-1" v-if="selectedAddress?.city">{{ selectedAddress?.city }},</span>
                        <span class="pe-1" v-if="selectedAddress?.addressLine1">{{ selectedAddress?.addressLine1 }},</span>
                        <span class="pe-1" v-if="selectedAddress?.addressLine2">{{ selectedAddress?.addressLine2 }},</span>
                        <span class="pe-1" v-if="selectedAddress?.zipCode">{{ selectedAddress?.zipCode }}</span>
                    </span>
                    </div>
                    
                </div>
                
                <div class="mt-2 lg:mt-0" v-if="isShoppingOptionsBtnShown">
                    <el-button color="#626aef" plain class="w-full sm:w-auto ms-3 sm:ms-0">Self pickup</el-button>
                    <el-button color="#626aef" plain class="w-full sm:w-auto mt-2 sm:mt-0" v-on:click="(() => {
                        isAddressListContainerOpen = !isAddressListContainerOpen;

                    })">Select from adrress
                        list
                    </el-button>

                </div>
            </div>


            <div>
                <el-button plain v-if="!isShoppingOptionsBtnShown"
                    v-on:click="isShoppingOptionsBtnShown = !isShoppingOptionsBtnShown">
                    Change it
                </el-button>
                <el-button plain v-else v-on:click="(() => {
                    isShoppingOptionsBtnShown = !isShoppingOptionsBtnShown;
                    isAddressListContainerOpen = false
                })">
                    Close
                </el-button>
            </div>


        </div>
        <div class="px-2 mt-3" v-if="isAddressListContainerOpen">
            <div v-if="isLoadingAddressList">
                <Loader />
            </div>
            <div v-else-if="isLoadingListAddressErrorExist">
                Problem with loading information occurred. Please, try again.
            </div>
            <div v-else v-for="(item, index) in addressList" class=" border rounded-md px-3 py-2 mb-2"
                :class="selectedAddressId === item.id ? 'border-green-300' : ''">
                <div class="flex flex-col sm:flex-row justify-between">
                    <div>
                        <span v-if="item.country !== ''" class="pe-1">{{ item.country }},</span>
                        <span v-if="item.state !== ''" class="pe-1">{{ item.state }},</span>
                        <span v-if="item.city !== ''" class="pe-1">{{ item.city }},</span>
                        <span v-if="item.addressLine1 !== ''" class="pe-1">{{ item.addressLine1 }},</span>
                        <span v-if="item.addressLine2 !== ''" class="pe-1">{{ item.addressLine2 }},</span>
                        <span v-if="item.zipCode !== ''" class="">{{ item.zipCode }}</span>
                    </div>
                    <div class="mt-2 sm:mt-0">
                        <el-button v-if="item.country !== ''" type="danger" size="small"  plain
                            v-on:click="deleteAddressClicked(item.id)">Delete</el-button>
                        <el-button v-if="item.country !== ''" type="warning" size="small" class="ms-3" plain
                            v-on:click="editAddressClicked(item)">Edit</el-button>
                        <el-button v-if="item.country !== ''" type="info" size="small" class="ms-3" plain
                            v-on:click="selectAddressClicked(item.id)">Select</el-button>
                    </div>


                </div>

                <div v-if="item.id === addressIdToEdit" class="max-w-2xl mt-3">
                    <el-form label-position="left" label-width="auto">
                        <el-form-item :label="'Country:'" prop="country">
                            <el-select v-model="countryToEdit" class="w-full" :placeholder="'Select'">
                                <el-option v-for="item in countriesList" :key="item" :label="item" :value="item">
                                    {{ item }}
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="'State:'" prop="state">
                            <el-select v-model="stateToEdit" class="w-full" :placeholder="'Select'"
                                :disabled="isStateDisabled">
                                <el-option v-for="item in statesList" :key="item" :label="item" :value="item">
                                    {{ item }}
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="'City:'" prop="city">
                            <el-input class="w-full" v-model="cityToEdit" />
                        </el-form-item>
                        <el-form-item :label="'Address Line 1:'" prop="addressLine1">
                            <el-input class="w-full" v-model="addressLine1ToEdit" />
                        </el-form-item>
                        <el-form-item :label="'Address Line 2:'" prop="addressLine2">
                            <el-input class="w-full" v-model="addressLine2ToEdit" />
                        </el-form-item>
                        <el-form-item :label="'Zip code:'" prop="zipCode">
                            <el-input class="w-full" v-model="zipCodeToEdit" />
                        </el-form-item>
                    </el-form>

                    <div>
                        <div v-show="isUpdateAddressErrorExist"
                            class="my-4 text-xs sm:text-sm text-red-500 text-center">
                            {{ updateAddressErrorMessage }}
                        </div>
                        <div class="flex">
                            <el-button color="#626aef" size="small" plain class="mb-3 ms-auto w-24"
                                :disabled="isUpdatingAddress" v-on:click="addressIdToEdit = ''">
                                Cancel
                            </el-button>
                            <el-button color="#626aef" size="small" class="mb-3 ms-auto w-24"
                                :loading="isUpdatingAddress"
                                :disabled="isUpdatingAddress || (countryToEdit === item.country && stateToEdit === item.state && cityToEdit === item.city && addressLine1ToEdit === item.addressLine1 && addressLine2ToEdit === item.addressLine2 && zipCodeToEdit === item.zipCode)"
                                v-on:click="onUpdateAddressBtnClicked">
                                Update
                            </el-button>
                        </div>

                    </div>
                </div>
            </div>

            <el-button color="#4ADE80" plain :icon="Plus" class="mt-2 mb-3" v-on:click="onAddNewAddressBtnClicked">
                Add new address
            </el-button>

            <div class="max-w-2xl" v-if="isNewAddressContainerOpen">
                <el-form label-position="left" label-width="auto">
                    <el-form-item :label="'Country:'" prop="country">
                        <el-select v-model="country" class="w-full" :placeholder="'Select'">
                            <el-option v-for="item in countriesList" :key="item" :label="item" :value="item">
                                {{ item }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="'State:'" prop="state">
                        <el-select v-model="state" class="w-full" :placeholder="'Select'" :disabled="isStateDisabled">
                            <el-option v-for="item in statesList" :key="item" :label="item" :value="item">
                                {{ item }}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="'City:'" prop="city">
                        <el-input class="w-full" v-model="city" />
                    </el-form-item>
                    <el-form-item :label="'Address Line 1:'" prop="addressLine1">
                        <el-input class="w-full" v-model="addressLine1" />
                    </el-form-item>
                    <el-form-item :label="'Address Line 2:'" prop="addressLine2">
                        <el-input class="w-full" v-model="addressLine2" />
                    </el-form-item>
                    <el-form-item :label="'Zip code:'" prop="zipCode">
                        <el-input class="w-full" v-model="zipCode" />
                    </el-form-item>
                </el-form>


                <div v-show="isErrorExist" class="my-4 text-xs sm:text-sm text-red-500 text-center">
                    {{ errorMessage }}
                </div>
                <div>
                    <div class="flex">
                        <el-button color="#626aef" size="small" class="mb-3 ms-auto w-24" :loading="isSaving"
                            :disabled="isSaving" v-on:click="onSaveNewAddressBtnClicked">
                            Save
                        </el-button>
                    </div>
                </div>


            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import * as projectsApi from '@/api/globalApi';
import type { AddressDto } from '@/api/models/AddressDto';
import { Plus } from '@element-plus/icons-vue';
import Loader from './Loader.vue';

onMounted(() => {
    loadAddressList();
});

const isShoppingOptionsBtnShown = ref(false);

const isAddressListContainerOpen = ref(false);
const isNewAddressContainerOpen = ref(false);
const id = ref('');
const country = ref('');
const state = ref('');
const city = ref('');
const zipCode = ref('');
const addressLine1 = ref('');
const addressLine2 = ref('');
const saved = ref(true);

const addressList = ref<Array<AddressDto>>([]);
const countriesList = ref<Array<string>>(['']);
const statesList = ref<Array<string>>(['']);
const selectedAddressId = ref('');
const selectedAddress = ref<AddressDto>();
const isStateDisabled = computed(() => {
    return country.value === 'USA' || country.value === 'Canada' ? false : true;
});


const isLoadingAddressList = ref(true);
const isLoadingListAddressErrorExist = ref(false);
const loadAddressList = () => {
    projectsApi
        .getAddressList()
        .then((response) => {
            addressList.value = response!;
        })
        .catch((e) => {
            console.log(e);
            isLoadingListAddressErrorExist.value = true;
        })
        .finally(() => {
            isLoadingAddressList.value = false;
        })
};

const onAddNewAddressBtnClicked = () => {
    isNewAddressContainerOpen.value = !isNewAddressContainerOpen.value;
    loadCountriesList();
}

const loadCountriesList = () => {
    projectsApi
        .getCountriesList()
        .then((response) => {
            countriesList.value = response!;
        })
        .catch((e) => {
            console.log(e);
        })
}

const loadStatesList = (country: string) => {
    projectsApi
        .getStatesList(country)
        .then((response) => {
            statesList.value = response!;
        })
        .catch((e) => {
            console.log(e);
        })
}

const isSaving = ref(false);
const isErrorExist = ref(false);
const errorMessage = ref('');
const onSaveNewAddressBtnClicked = () => {
    errorMessage.value = '';
    if (!country.value || !city.value || !addressLine1.value) {
        isErrorExist.value = true;
        errorMessage.value = "The country, city and address line1 fields are required";
    } else {
        isSaving.value = true;
        projectsApi
            .addAddress(id.value, addressLine1.value, addressLine2.value, city.value, state.value, zipCode.value, country.value, saved.value)
            .then((response) => {
                loadAddressList();
                selectedAddress.value = response;
                selectedAddressId.value = selectedAddress.value.id;
                isAddressListContainerOpen.value = false;
                isNewAddressContainerOpen.value = false;
                initAddressFields();
            })
            .catch((e) => {
                console.log(e);
                isErrorExist.value = true;
                errorMessage.value = "Couldn't complete operation. Please, try again.";
            })
            .finally(() => {
                isSaving.value = false;
            });
    }
}

const initAddressFields = () => {
    country.value = '';
    state.value = '';
    city.value = '';
    zipCode.value = '';
    addressLine1.value = '';
    addressLine2.value = '';
}

const selectAddressClicked = (id: string) => {
    projectsApi
        .selectAddress(id)
        .then((response) => {
            selectedAddressId.value = id;
            showAddressData(id);
        })
        .catch((e) => {
            console.log(e);
        })
        .finally(() => {
            isShoppingOptionsBtnShown.value = false;
            isAddressListContainerOpen.value = false;
        });
}

const showAddressData = (id: string) => {
    projectsApi
        .getAddress(id)
        .then((response) => {
            selectedAddress.value = response;
        })
        .catch((e) => {
            console.log(e);
        })
}

const deleteAddressClicked = (id: string) => {
    projectsApi
        .deleteAddress(id)
        .then((response) => {
            loadAddressList();
        })
        .catch((e) => {
            console.log(e);
        })
}

const addressIdToEdit = ref('');
const countryToEdit = ref('');
const stateToEdit = ref('');
const cityToEdit = ref('');
const addressLine1ToEdit = ref('');
const addressLine2ToEdit = ref('');
const zipCodeToEdit = ref('');
const editAddressClicked = (item: AddressDto) => {
    addressIdToEdit.value = item.id;
    countryToEdit.value = item.country;
    stateToEdit.value = item.state;
    cityToEdit.value = item.city;
    addressLine1ToEdit.value = item.addressLine1;
    addressLine2ToEdit.value = item.addressLine2;
    zipCodeToEdit.value = item.zipCode;
}

const isUpdatingAddress = ref(false);
const isUpdateAddressErrorExist = ref(false);
const updateAddressErrorMessage = ref('');
const onUpdateAddressBtnClicked = () => {
    updateAddressErrorMessage.value = '';
    if (!countryToEdit.value || !cityToEdit.value || !addressLine1ToEdit.value) {
        isUpdateAddressErrorExist.value = true;
        updateAddressErrorMessage.value = "The country, city and address line1 fields are required";
    } else {
        isUpdatingAddress.value = true;
        projectsApi
            .replaceAddress(addressIdToEdit.value, addressLine1ToEdit.value, addressLine2ToEdit.value, cityToEdit.value,
                stateToEdit.value, zipCodeToEdit.value, countryToEdit.value, saved.value)
            .then((response) => {
                addressIdToEdit.value = '';
                loadAddressList();
            })
            .catch((e) => {
                console.log(e);
                isUpdateAddressErrorExist.value = true;
                updateAddressErrorMessage.value = "Couldn't complete operation. Please, try again.";
            })
            .finally(() => {
                isUpdatingAddress.value = false;
            });
    }
}

watch(
    () => country.value,
    () => {
        state.value = '';
        loadStatesList(country.value);
    }
);


</script>