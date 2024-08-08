<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <VCardTitle class="text-2xl font-weight-bold">
          {{ siteInfo.siteName }}
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <p class="mb-0">
          Please sign-in to your account
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="login">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                :error-messages="state.errors.email"
                autofocus
                placeholder="johndoe@email.com"
                label="Email"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                :error-messages="state.errors.password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                />

                <RouterLink
                  class="text-primary ms-2 mb-1"
                  to="javascript:void(0)"
                >
                  Forgot Password?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn
                :loading="state.formSubmit"
                :disabled="state.formSubmit"
                block
                type="submit"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>New on our platform?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                Create an account
              </RouterLink>
            </VCol>

            <VCol
              cols="12"
              class="d-flex align-center"
            />
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { siteInfo } from "@core/utils/siteInfo"
import { ElNotification } from "element-plus"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

const store = useStore()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const state = reactive({
  formSubmit: false,
  errors: {
    email: '',
    password: '',
  },
})

const isPasswordVisible = ref(false)

const login = async () => {
  state.formSubmit = true
    
  return new Promise((resolve, reject) => {
    store.dispatch('auth/login', form.value)
      .then(response => {

        resolve(response)

        ElNotification({
          title: 'Success',
          message: 'Login successful',
          type: 'success',
        })

        router.push({ name: 'dashboard' })
        location.reload()
      })
      .catch(error => {

        reject(error)

        if (error.response.status === 422) {
          populateErrors(error.response.data.errors)
        } else {
          ElNotification({
            title: 'Error',
            message: error.response.data.message || 'Invalid credentials',
            type: 'error',
          })
        }
      })
      .finally(() => {
        state.formSubmit = false
      })
  })
}

const populateErrors = errors => {
  Object.keys(errors).forEach(key => {
    state.errors[key] = errors[key][0]
  })
}

watch(() => form.value.email, () => state.errors.email = '')
watch(() => form.value.password, () => state.errors.password = '')
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
