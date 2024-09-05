<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <VSpacer />

        <IconBtn class="me-2">
          <VIcon icon="bx-bell" />
        </IconBtn>

        <!-- 👉 Theme switcher -->
        <NavbarThemeSwitcher class="me-2" />
        <!-- 👉 Theme switcher -->

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Dashboard',
          icon: 'bx-home',
          to: '/dashboard',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Account Settings',
          icon: 'mdi-account-cog-outline',
          to: '/account-settings',
        }"
      />

      <VerticalNavSectionTitle
        :item="{
          heading: 'Menu',
        }"
      />
      <!-- 👉 Pages -->
      <VerticalNavLink
        :item="{
          title: 'Items',
          icon: 'bx-universal-access',
          to: '',
        }"
      />

      <VerticalNavLink
        :item="{
          title: 'Addons',
          icon: 'bx-universal-access',
          to: '',
        }"
      />

      <VerticalNavLink
        :item="{
          title: 'Categories',
          icon: 'bx-universal-access',
          to: '',
        }"
      />

      <VerticalNavSectionTitle
        :item="{
          heading: 'Restaurants',
        }"
      />

      <VerticalNavLink
        :item="{
          title: 'Restaurants',
          icon: 'bx-universal-access',
          to: '',
        }"
      />

      <VerticalNavSectionTitle
        :item="{
          heading: 'Access Control',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Roles',
          icon: 'bx-universal-access',
          to: '/acl/roles',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Permissions',
          icon: 'bx-shield-quarter',
          to: '/acl/permissions',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Users',
          icon: 'bx-user-pin',
          to: '/acl/users',
        }"
      />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import VerticalNavGroup from "@layouts/components/VerticalNavGroup.vue"
</script>

<style lang="scss" scoped>
.meta-key {
    border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 6px;
    block-size: 1.5625rem;
    line-height: 1.3125rem;
    padding-block: 0.125rem;
    padding-inline: 0.25rem;
}
</style>
