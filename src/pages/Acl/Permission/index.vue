<template>
  <div>
    <VRow>
      <VCol cols="12">
        <ElCard class="data-table-wrapper">
          <template #header>
            <div class="card-header">
              <h2>Permissions</h2>
            </div>
          </template>
          <ElTable
            v-if="state.permissions.length"
            v-loading="state.loading"
            class="data-table"
            :data="state.permissions"
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
              prop="slug"
              label="Slug"
            />
            <ElTableColumn
              prop="subject"
              label="Subject"
            />
          </ElTable>
          <ElEmpty
            v-else
            description="No users found"
          />
          <template
            v-if="state.permissions.length"
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
                @fetch="fetchPermissions"
              />
            </div>
          </template>
        </ElCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from "vuex"
import { useMixin } from "@core/composable/composable"
import Pagination from "@/components/Pagination.vue"
import { formatDate } from "@core/utils/formatters"

const store = useStore()
const { formatNumber } = useMixin()

const pagination = computed(() => store.getters["permission/getPagination"])

const state = reactive({
  permissions: computed(() => store.getters["permission/getPermissions"]),
  loading: computed(() => store.getters["permission/isLoading"]),

  paginate: {
    total: 0,
    current_page: 1,
    per_page: 10,
    from: 0,
    to: 0,
  },
})

const populatePaginate = pagination => {
  state.paginate = {
    total: pagination.total,
    current_page: pagination.current_page,
    per_page: pagination.per_page,
    from: pagination.from,
    to: pagination.to,
  }
}

const fetchPermissions = async () => {
  await store.dispatch('permission/fetchPermissionData', {
    page: state.paginate.current_page,
    per_page: state.paginate.per_page,
  })
  populatePaginate(pagination.value)
}

const mounted = async () => {
  await fetchPermissions()
}

onMounted(mounted)
</script>