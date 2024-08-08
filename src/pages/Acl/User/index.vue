<template>
  <div>
    <VRow>
      <VCol cols="12">
        <ElCard class="data-table-wrapper">
          <template #header>
            <div class="card-header">
              <h2>Users</h2>
              <VBtn
                color="primary"
                variant="tonal"
                @click="handleShowCreateForm"
              >
                <ElIcon
                  class="mr-2"
                  :size="14"
                >
                  <Plus />
                </ElIcon>
                Create User
              </VBtn>
            </div>
          </template>
          <ElTable
            v-if="state.users.length"
            v-loading="state.loading"
            class="data-table"
            :data="state.users"
            style="width: 100%;"
          >
            <ElTableColumn
              prop="created_at"
              label="Date"
              :formatter="row => formatDate(row.created_at)"
            />
            <ElTableColumn
              prop="name"
              label="Name"
            />
            <ElTableColumn
              prop="email"
              label="Email"
            />
            <ElTableColumn
              prop="roles"
              label="Role"
            >
              <template #default="{ row }">
                <span
                  v-for="(role, index) in row.roles"
                  :key="index"
                >
                  <ElTag
                    type="primary"
                    size="small"
                  >
                    {{ role.name }}
                  </ElTag>
                  <span v-if="index < row.roles.length - 1">, </span>
                </span>
              </template>
            </ElTableColumn>
            <ElTableColumn
              fixed="right"
              label="Actions"
            >
              <template #default="{ row }">
                <VBtn
                  class="mr-2"
                  type="reset"
                  size="small"
                  color="primary"
                  variant="tonal"
                  @click="handleAction('update', row)"
                >
                  <ElIcon :size="14">
                    <Edit />
                  </ElIcon>
                </VBtn>

                <VBtn
                  v-if="authUser?.id !== row.id"
                  type="reset"
                  size="small"
                  color="error"
                  variant="tonal"
                  @click="handleAction('delete', row)"
                >
                  <ElIcon :size="14">
                    <Delete />
                  </ElIcon>
                </VBtn>
              </template>
            </ElTableColumn>
          </ElTable>
          <ElEmpty
            v-else
            description="No users found"
          />
          <template
            v-if="state.users.length"
            #footer
          >
            <div class="pagination">
              <div class="pagination-status">
                <span>
                  Showing {{ formatNumber(state.paginate.from) }} to {{ formatNumber(state.paginate.to) }} of {{ formatNumber(state.paginate.total) }} entries
                </span>
              </div>
              <Pagination
                :hide-on-single="false"
                class="data-table-pagination"
                background
                layout="prev, pager, next"
                :pagination="state.paginate"
                @fetch="fetchUsers"
              />
            </div>
          </template>
        </ElCard>
      </VCol>
    </VRow>
  </div>
    
  <UserCreateUpdateForm
    v-model="state.showCreateUpdateForm"
    :item="state.selectedItem"
    :roles="roles"
    :on-action="handleActionUpdated"
    @close="handleActionClose"
  />
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Edit, Delete, Plus } from "@element-plus/icons-vue"
import { useStore } from "vuex"
import { formatDate } from "@core/utils/formatters"
import { authUser } from "@core/utils/helpers"
import { useNotify, useMixin } from "@core/composable/composable"
import UserCreateUpdateForm from "@/pages/Acl/User/Action/UserCreateUpdateForm.vue"
import Pagination from "@/components/Pagination.vue"

const store = useStore()
const { notify } = useNotify()

const { formatNumber, handleError, confirmAndDelete } = useMixin()

const pagination = computed(() => store.getters["user/getPagination"])

const state = reactive({
  users: computed(() => store.getters["user/getUsers"]),
  loading: computed(() => store.getters["user/isLoading"]),

  paginate: {
    total: 0,
    current_page: 1,
    per_page: 10,
    from: 0,
    to: 0,
  },
    
  showCreateUpdateForm: false,
  selectedItem: {},
})

const roles = computed(()=>{

  let roles = store.getters["role/allRoles"]

  if (!roles.length) return
    
  return roles.map(role => ({
    label: role.name,
    id: role.id,
  }))

})

const handleShowCreateForm = () => {
  state.showCreateUpdateForm = true
  state.selectedItem = {}
}

const handleActionClose = () => {
  state.showCreateUpdateForm = false
  state.selectedItem = {}
}

const handleUpdate = item => {
  state.selectedItem = item
  state.showCreateUpdateForm = true
}

const populatePaginate = () => {
  state.paginate = {
    total: pagination.value.total,
    current_page: pagination.value.current_page,
    per_page: pagination.value.per_page,
    from: pagination.value.from,
    to: pagination.value.to,
  }
}

const fetchUsers = async () => {
  await store.dispatch('user/fetchUserData', {
    page: state.paginate.current_page,
    per_page: state.paginate.per_page,
  })
  populatePaginate()
}

const fetchRoles = async () => {
  await store.dispatch('role/fetchAllRoles')
}

const handleDelete = async item => {
  await store.dispatch('user/deleteUser', item.id)
    .then(response => {
      notify.success(response.message || 'User deleted successfully')
      fetchUsers()
    })
    .catch(handleError)
}

const handleAction = (action, item) => {

  if (!['update', 'delete'].includes(action)) {
    return
  }

  if (action === 'update') {
    return handleUpdate(item)
  }


  return confirmAndDelete({ confirmCallback: () => handleDelete(item) })
}

const handleActionUpdated = () => {
  state.showCreateUpdateForm = false
  fetchUsers()
}

const mounted = async () => {
  await fetchUsers()
  await fetchRoles()
}

onMounted(mounted)
</script>