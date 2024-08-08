<template>
  <ElDialog
    v-model="actionState"
    modal
    :close-on-click-modal="false"
    class="user-add-form"
    :title="`${state.isUpdating ? 'Update' : 'Add new'} Role`"
  >
    <ElForm
      v-loading="state.isLoading"
      label-width="120px"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <ElFormItem
        label="Name"
        :error="handleError(state.errors?.name)"
      >
        <ElInput
          v-model="state.form.name"
          placeholder="Name"
          @input="state.errors.name = []"
        />
      </ElFormItem>
      <ElFormItem
        label="Description"
        :error="handleError(state.errors?.description)"
      >
        <ElInput
          v-model="state.form.description"
          placeholder="Description"
          @input="state.errors.description = []"
        />
      </ElFormItem>

      <ElFormItem
        label="Permissions"
        :error="handleError(state.errors?.permissions)"
      >
        <TreeSelect
          ref="treeSelect"
          :key="state.treeSelectKey"
          v-model="state.form.permissions"
          multiple
          :options="permissions"
          disable-branch-nodes
          search-nested
          show-count
          placeholder="Select Permissions"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <VBtn
        class="mr-2"
        size="small"
        color="error"
        variant="tonal"
        @click="handleActionClose"
      >
        Cancel
      </VBtn>
      <VBtn
        :disabled="state.isLoading"
        size="small"
        :loading="state.loading"
        color="primary"
        variant="tonal"
        @click="handleSubmit"
      >
        Submit
      </VBtn>
    </template>
  </ElDialog>
</template>

<script setup>
import { onMounted } from "vue"
import { isEmpty } from "lodash"
import { useStore } from "vuex"
import { useNotify } from "@core/composable/composable"
import TreeSelect from "@tkmam1x/vue3-treeselect"
import '@tkmam1x/vue3-treeselect/dist/vue3-treeselect.css'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  isUpdating: {
    type: Boolean,
    default: false,
  },

  item: {
    type: Object,
  },

  permissions: {
    type: Array,
    default: () => [],
  },

  onAction: {
    type: Function,
  },
})

const emit = defineEmits(['update:modelValue'])

const store = useStore()
const { notify } = useNotify()

const formState = {
  id: null,
  name: '',
  description: '',
  permissions: [],
}

const state = reactive({
  isUpdating: false,
  isLoading: false,
  errors: {},
  treeSelectKey: 0,

  form: { ...formState },
})

const actionState = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const handleActionClose = () => {
  actionState.value = false
}

const handleError = error => {
  return error?.length ? error[0] : ''
}

const handleSubmissionSuccess = response => {

  notify.success(response.message || `Role ${state.isUpdating ? 'updated' : 'created'} successfully`)

  if (typeof props.onAction === 'function') {
    return props.onAction(response, state.isUpdating)
  }

  state.form = { ...formState }

  actionState.value = false
}

const createUser = async data => {

  await store.dispatch('role/storeRole', data).then(response => {

    state.isLoading = false
    handleSubmissionSuccess(response)

  }).catch(error => {

    state.isLoading = false
    notify.error('Failed to create Role')
    state.errors = error.response.data.errors

  })
}

const updateUser = async data => {
  await store.dispatch('role/updateRole', { id: data.id, data })
    .then(response => {
      state.isLoading = false
      handleSubmissionSuccess(response)
    })
    .catch(error => {
      state.isLoading = false
      notify.error(error.response.data.message || 'Failed to update Role')
      state.errors = error.response.data.errors
    })
}

const handleSubmit = async () => {
  state.isLoading = true

  if (state.isUpdating) {
    return updateUser(state.form)
  }

  return await createUser(state.form)
}

const populateRoleForm = item => {
  state.isLoading = true

  state.form = {
    id: item.id,
    name: item.name,
    description: item.description,
    permissions: item?.permissions?.map(permission => permission.id) || [],

  }
  state.isUpdating = true
  state.isLoading = false
}

const resetForm = () => {
  state.form = { ...formState }
  state.isUpdating = false
  state.errors = {}
}

watch(() => props.item, newValue => {

  state.errors = {}

  if (!isEmpty(newValue)) {

    return populateRoleForm(newValue)
  }

  resetForm()

}, { immediate: true })

const mounted = async () => {
  state.errors = {}
}

onMounted(mounted)
</script>