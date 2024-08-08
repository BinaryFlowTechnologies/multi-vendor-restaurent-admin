import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatCurrency } from '@core/utils/helpers'

const jQuery = window.jQuery
const $ = jQuery

export function useModelValue(props, context) {
  return computed({
    get: () => props.modelValue,
    set: value => context.emit('update:modelValue', value),
  })
}

/**
 *
 * @param config
 * @returns {{notify: {success: Function, warning: Function, error: Function, notify: Function}}}
 */
export function useNotify(config = {}) {

  //const { appContext } = getCurrentInstance();

  const defaultOptions = {
    duration: 3000,
    showClose: true,
    customClass: 'multi_mart-notification',
    ...config,
  }

  const success = (message, options) => {
    notify(message, {
      ...options,
      type: 'success',
    })
  }

  const error = (message, options) => {
    notify(message, {
      ...options,
      type: 'error',
    })
  }

  const warning = (message, options) => {
    notify(message, {
      ...options,
      type: 'warning',
    })
  }

  const notify = (message, options) => {
    ElMessage({
      ...defaultOptions,
      ...options,
      message,
    })
  }

  return {
    notify: {
      success,
      error,
      warning,
      notify: ElMessage,
    },
  }
}

/**
 *
 * @param { Object } config
 * @returns {{confirm: (function({title: string, message: string, config: Object, onConfirm: Callback, onReject: Callback}): Promise<MessageBoxData>)}}
 */
export function useConfirm(config = {}) {

  const defaultConfig = {
    type: 'warning',
    confirmButtonClass: 'el-button--danger is-plain',
    ...config,
  }

  /**
   * @param { Object } confirm;
   * @param { string } confirm.title
   * @param { string } confirm.message
   * @param { Object } confirm.config
   * @param { Callback } confirm.onConfirm
   * @param { Callback } confirm.onReject
   */
  const confirm = ({
    title = 'Warning',
    message,
    config = {},
    onConfirm = () => ({}),
    onReject = () => ({}),
  }) => {

    const optionalConfig = {
      ...defaultConfig,
      ...config,
    }

    return ElMessageBox
      .confirm(message, title, optionalConfig)
      .then(async r => onConfirm(r))
      .catch(e => onReject(e))
  }

  return {
    confirm,
  }
}

export function useMounted($item) {

  let instance = getCurrentInstance()

  if (!instance) {
    throw new Error('Composable must be called inside composition api')
  }

  let items = []

  if (Array.isArray($item)) {

    $item.forEach(cb => {

      if (typeof cb !== 'function') {
        throw new Error('item must be a function')
      }

      items.push(cb)
    })
  }

  if (typeof $item === 'function') {
    items.push($item)
  }

  if (!items.length) {
    return
  }

  onMounted(() => Promise.all([...items]))

}

/**
 * @param { Object } context
 * @param context.title
 * @param context.message
 * @param context.confirmCallback
 * @param context.rejectCallback
 * @param context.type
 * @returns {Promise<MessageBoxData>}
 */
export async function confirmAndDelete(
  {
    title = 'Are you sure?',
    message = 'Are you sure you want to delete? This action is not recoverable.',
    confirmCallback = () => ({}),
    rejectCallback = () => ({}),
    type = 'danger',
  },
) {

  const { confirm } = useConfirm()

  return confirm({
    title: title,
    type: type,
    message: message,
    onConfirm: confirmCallback,
    onReject: rejectCallback,
  })

}


export async function useAsyncAction(callback, dataFormatter = data => data, errorFormatter = e => e) {

  if (typeof callback !== 'function') {
    throw new Error('callback must be a function')
  }

  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  try {

    loading.value = true

    const response = await callback()

    data.value = dataFormatter(response)

  } catch (err) {

    error.value = errorFormatter(err)

  } finally {

    loading.value = false

  }

  return {
    data,
    error,
    loading,
  }
}


export function useMixin() {

  const formatNumber = (amount, hideEmpty = false) => {

    if (!amount && hideEmpty) {
      return ''
    }

    if (!amount) {
      amount = '0'
    }

    return new Intl.NumberFormat('en-US').format(amount)
  }

  const handleError = response => {

    let errorMessage = ''

    if (typeof response === 'string') {

      errorMessage = response

    } else if (response && response.message) {

      errorMessage = response.message

    } else {
      errorMessage = convertToText(response)
    }

    if (!errorMessage) {
      errorMessage = 'Something is wrong!'
    }

    const { notify } = useNotify()

    notify.error(errorMessage, {
      dangerouslyUseHTMLString: true,
    })
  }

  const convertToText = obj => {

    const string = []

    if (typeof (obj) === 'object' && (obj.join === undefined)) {

      for (const prop in obj) {
        string.push(convertToText(obj[prop]))
      }

    }

    if (typeof (obj) === 'object' && !(obj.join === undefined)) {
      for (const prop in obj) {
        string.push(convertToText(obj[prop]))
      }
    }

    if (typeof (obj) === 'function') {
      //return;
    }

    if (typeof (obj) === 'string') {
      string.push(obj)
    }

    return string.join('<br />')
  }


  const callDebounce = (fn, timeOut = 500) => {

    let timeout

    return function () {
      const functionCall = () => fn.apply(this, arguments)

      clearTimeout(timeout)
      timeout = setTimeout(functionCall, timeOut)
    }

  }

  return {
    formatNumber,
    handleError,
    convertToText,
    callDebounce,
    formatCurrency,
    confirmAndDelete,
    useMounted,
  }
}