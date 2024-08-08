<template>
  <ElPagination
    v-model:current-page="pagination.current_page"
    class="data-table-pagination"
    background
    layout="total, sizes, prev, pager, next"
    :hide-on-single-page="hideOnSingle"
    :page-sizes="pageSizes"
    :page-size="pagination.per_page"
    :total="pagination.total"
    @current-change="changePage"
    @size-change="changeSize"
  />
</template>

<script type="text/babel" setup>
import { computed } from 'vue'

const props = defineProps({

  pagination: {
    required: true,
    type: Object,
  },

  extraSizes: {
    required: false,
    type: Array,
    default: () => ([]),
  },

  hideOnSingle: {
    required: false,
    type: Boolean,
    default: () => true,
  },
})

const emit = defineEmits(['update:pagination', 'per_page_change', 'fetch', 'per_page_change'])

// eslint-disable-next-line vue/no-dupe-keys
const pagination = computed({
  get: () => props.pagination,
  set: value => emit('update:pagination', value),
})

const pageSizes = computed(() => {
  const sizes = []

  if (props.pagination.per_page < 10) {
    sizes.push(props.pagination.per_page)
  }

  const defaults = [
    10,
    20,
    50,
    80,
    100,
    120,
    150,
  ]

  return [...sizes, ...defaults, ...props.extraSizes]
})

const changePage = page => {
  pagination.value.current_page = page

  emit('fetch')
}

const changeSize = size => {
  pagination.value.per_page = size
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('per_page_change', size)
  emit('fetch')
}
</script>

<style lang="scss">
.el-pagination {
    padding: 0;
    gap: 5px;
    margin: 0;

    button {
        border-radius: 5px;
        color: #60646B;
        background: #F6F7FA;
        font-size: 14px;
        margin: 0;
    }

    ul {
        li {
            background: none;
            border-radius: 5px;
            font-weight: 400;
            color: #60646B;
            font-size: 14px;
            margin: 0;

            &.is-active {
                background: var(--el-color-primary);
                font-weight: 400;
                color: #ffffff;
            }
        }
    }
}
</style>