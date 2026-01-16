<template>
  <v-app>
    <v-layout>

      <v-navigation-drawer :permanent="true" width="260">
        <v-list density="comfortable" nav>
          <v-list-item
            title="Pure CRM"
            subtitle="Admin Panel"
          />
          <v-divider class="my-2" />

          <v-list-item
            to="/dashboard"
            title="Dashboard"
          />
          <v-list-item
            to="/login"
            title="Login"
          />
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-app-bar flat>
          <v-app-bar-title>Pure CRM</v-app-bar-title>
        </v-app-bar>

        <v-container class="py-6">
          <router-view />
        </v-container>
      </v-main>

    </v-layout>
  </v-app>
</template>
