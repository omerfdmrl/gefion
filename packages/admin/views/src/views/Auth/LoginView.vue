<template>
  <form style="max-width: 350px" @submit.prevent="onLogin">
    <!-- Email input -->
    <div data-mdb-input-init class="form-outline mb-4">
      <input
        v-model="loginForm.email"
        type="email"
        id="form2Example1"
        class="form-control"
      />
      <label class="form-label" for="form2Example1">Email address</label>
    </div>

    <!-- Password input -->
    <div data-mdb-input-init class="form-outline mb-4">
      <input
        v-model="loginForm.password"
        type="password"
        id="form2Example2"
        class="form-control"
      />
      <label class="form-label" for="form2Example2">Password</label>
    </div>

    <!-- 2 column grid layout for inline styling -->
    <div class="row mb-4">
      <div class="col d-flex">
        <!-- Checkbox -->
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="form2Example31"
            checked
          />
          <label class="form-check-label" for="form2Example31">
            Remember me
          </label>
        </div>
      </div>

      <div class="col">
        <!-- Simple link -->
        <a href="#!">Forgot password?</a>
      </div>
    </div>

    <!-- Submit button -->
    <button type="submit" class="btn btn-primary btn-block mb-4">
      Sign in
    </button>
  </form>
</template>

<script>
import authService from "@/services/auth.service.js";
import { useAuthStore } from "@/store/auth";
export default {
  data() {
    return {
      loginForm: {},
    };
  },
  methods: {
    onLogin() {
      authService
        .login(this.loginForm)
        .then((response) => {
          const auth = useAuthStore();
          auth.login(response);
          this.$router.push({ name: "dashboard" });
        })
        .catch((err) => {
          this.$toast.warn(err);
        });
    },
  },
};
</script>
