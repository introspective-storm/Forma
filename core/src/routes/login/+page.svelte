<div class="card bg-surface-900 ml-170 mr-170 mt-50 pt-10">
  <h1 class="mx-auto w-full max-w-md space-y-4 text-2xl font-semibold text-primary-400 pb-5">Login</h1>
  <form class="mx-auto w-full max-w-md space-y-4" method="POST" action="?/login">
    <label class="label">
      Email
      <input class="input bg-surface-800" name="email" type="email" />
    </label>
    <label class="label">
      Password
      <input class="input bg-surface-800" name="password" type="password" />
    </label>
    <button class="btn preset-filled-primary-500 mt-5">Login</button>
    <button class="btn preset-outlined-primary-500 ml-4 mb-5" formaction="?/signup">Sign up</button>
  </form>
</div>