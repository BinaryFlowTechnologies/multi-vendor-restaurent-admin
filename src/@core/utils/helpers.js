import { isObject } from 'lodash'
import dayJs from 'dayjs'
import Storage from '@core/bits/Storage'
import { reactive } from 'vue'

export const formatError = (err, asPromise = true) => {

  const defaultErrorMessage = 'Something went wrong'

  const error = {
    errors: null,
    message: defaultErrorMessage,
    status: false,
  }


  switch (typeof err) {

  case 'string':
    error.message = err
    break

  case 'object':
    error.message = ( 'message' in err ) ? err.message : defaultErrorMessage
    break
  }

  return asPromise ? Promise.reject(error) : error

}

export const generateQueryParams = (queryParams, asFormData = false) => {

  if (typeof queryParams !== 'object') {
    return queryParams
  }

  let parameters = {}

  for (const key in queryParams) {

    if (Array.isArray(queryParams[key])) {
      queryParams[key].map((item, idx) => parameters[key][idx] = item)
    }

    if (typeof queryParams[key] === 'boolean') {
      parameters[key] = queryParams[key] ? 'true' : 'false'
    }

    if (typeof queryParams[key] === 'string') {
      parameters[key] = queryParams[key]
    }

    if (typeof queryParams[key] === 'object' && isObject(queryParams)) {
      parameters[key] = JSON.stringify(queryParams[key])
    }

    if (queryParams[key] instanceof Blob || queryParams[key] instanceof File) {
      parameters[key] = queryParams[key]
    }

  }

  if (!asFormData) {
    return parameters
  }

  const formData = new FormData()

  for (const itemKey in parameters) {
    formData.append(itemKey, parameters[itemKey])
  }

  return formData
}

export const formatCurrency = (amount, defaultCurrency = '$') => {

  let decimalCount = 2
  let decimal = '.'
  let thousands = ','

  try {
    decimalCount = Math.abs(decimalCount)
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount

    if (parseInt(amount) === amount) {
      decimalCount = 0
    }

    const negativeSign = amount < 0 ? '-' : ''

    const i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()

    const j = (i.length > 3) ? i.length % 3 : 0

    return negativeSign + defaultCurrency + (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '')
  } catch (e) {
    return ''
  }
}

export const formatLocaleNumber = number => {
  const formatNumber = number //parseInt(number);
  const appLocales = 'en-US' //window?.fluentFrameworkAdmin?.locale || 'en-US';
  
  return new Intl.NumberFormat(appLocales).format(formatNumber)
}

export const getRandomString = (length = 5) => {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
}

/**
 *
 * @param text
 * @returns { Promise }
 */
export const copyToClipboard = async text => {

  return new Promise((resolve, reject) => {

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
      
      return resolve(true)
    }

    const textArea = document.createElement('textarea')

    textArea.value = text

    document.body.prepend(textArea)
    textArea.select()

    try {
      document.execCommand('copy')
    } catch (error) {
      return reject(true)
    } finally {
      textArea.remove()
    }

    return resolve(true)

  })
}

/**
 *
 * @param { Date } date
 * @param { String } format - default `DD - MMM - YYYYY`
 * @see https://day.js.org/docs/en/display/format
 * @returns { string }
 */
export const formatDate = (date, format = 'DD MMM YYYY') => {

  if (!dayJs(date).isValid()) {
    return date
  }

  return dayJs(date).format(format)
}

/**
 *
 * @param { Date } date
 * @param { String } format - default `DD - MMM - YYYYY`
 * @see https://day.js.org/docs/en/display/format
 * @returns { string }
 */
export const formatTime = (date, format = 'hh:mm A') => {
  return formatDate(date, format)
}

/**
 *
 * @param { Date } date
 * @param { Object } options
 * @param { String } options.timeFormat
 * @param { String } options.dateFormat
 * @param { String } options.separator
 * @see https://day.js.org/docs/en/display/format
 * @returns { string }
 */
export const formatDateTime = (date, options = {}) => {

  const defaultOptions = {
    timeFormat: undefined,
    dateFormat: undefined,
    separator: 'at',
    ...options,
  }

  const formattedDate = formatDate(date, defaultOptions.dateFormat)
  const formattedTime = formatTime(date, defaultOptions.timeFormat)

  return `${formattedDate} ${defaultOptions.separator} ${formattedTime}`

}

export const getStatusBadge = status => {
  console.log(status)
}

export const getStatusLabel = status => {

  if (!( status in MAP_STATUS_LAVEL )) {
    return status
  }

  return MAP_STATUS_LAVEL[status]
}


export const isValidURL = str => {

  try {

    new URL(str)
    
    return true

  } catch (_) {

    return false
  }

}

export const getSocialShareButton = link => {
  return [
    {
      title: 'Facebook',
      link: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
      img: 'https://freepngimg.com/thumb/facebook/62487-bluetie-icons-computer-facebook-login-icon-email.png',
    },
    {
      title: 'Twitter',
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Checkout this awesome WordPress plugin for small businesses')}`,
      img: 'https://pngimg.com/uploads/twitter/twitter_PNG95259.png',
    },
    {
      title: 'LinkedIn',
      link: `https://www.linkedin.com/shareArticle?mini=true&url=${link}`,
      img: 'https://pngimg.com/uploads/twitter/twitter_PNG95259.png',
    },
  ]
}

/**
 * Format number using configuration - useful for formatting currency
 * @param { Number } amount
 * @param { Object } config
 * @param { string } config.decimalSeparator
 * @param { string } config.thousandSeparator
 */
export const formatAmount = (amount, config = {}) => {

  const defaultConfig = {
    precision: 2,
    decimalSeparator: '.',
    thousandSeparator: ',',
    ...config,
  }

  if(typeof amount !== 'number') {
    throw new Error(`Invalid amount ${amount}`)
  }

  const { precision, decimalSeparator, thousandSeparator } = defaultConfig

  const number = amount.toFixed(precision)

  const [integer, decimal] = number.split('.')
  const integerFormatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
  const decimalFormatted = decimal ? decimalSeparator + decimal : ''

  return integerFormatted + decimalFormatted

}

/**
 * Format currency using user defined config
 * @param { Number } amount - 0
 * @param { Object } config
 * @param { String } config.thousandSeparator - default `,`
 * @param { String } config.decimalSeparator - default `.`
 * @param { String } config.symbol - default `$`
 * @param { String } config.symbolPosition - default `$`
 */
export const moneyFormatter = (amount, config = {}) => {

  const currencyConfig = {
    currency: 'usd',
    currency_symbol: '$',
    currency_symbol_position: 'left',
    decimal_separator: '.',
    thousand_separator: ',',
  }

  const defaultConfig = {
    currency: 'usd',
    currency_symbol: '$',
    currency_symbol_position: 'left',
    decimal_separator: '.',
    thousand_separator: ',',
    ...currencyConfig,
    ...config,
  }

  amount = Number(amount)

  if (typeof amount !== 'number') {
    throw new Error(`Invalid amount ${amount}`)
  }

  const formattedAmount = formatAmount(amount, defaultConfig)

  return defaultConfig.currency_symbol_position === 'left'
    ? `${defaultConfig.currency_symbol} ${formattedAmount}`
    : `${formattedAmount} ${defaultConfig.currency_symbol}`
    
}

export const stringLimit = (str, limit = 50) => {

  if(!str) {
    return str
  }
  
  return str.length > limit ? str.slice(0, limit) + '...' : str
}

export const showTimeOrDate = date => {

  const now = dayJs()
  const dateToCompare = dayJs(date)

  if (now.diff(dateToCompare, 'days') < 1) {
    return formatTime(date)
  }

  return formatDate(date)
}

export const storage = ()=> Storage

export const exportCsv = (data, fileName = null) => {

  const downloadFileName = !fileName ? 'data.csv' : `${fileName}.csv`

  const rows = [Object.keys(data[0]).join(',')].concat(
    data.map(row =>
      Object.values(row)
        .map(val => `"${val}"`)
        .join(','),
    ))

  let csvContent = rows.join('\n')

  let blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  if (navigator.msSaveBlob) {

    navigator.msSaveBlob(blob, downloadFileName)

  } else {

    let link = document.createElement('a')

    if (link.download !== undefined) {
      let url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', downloadFileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

  }
}

export const authUser = Storage.get('user').user || {}