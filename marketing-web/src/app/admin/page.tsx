export default function AdminPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-extrabold text-brand">Admin Login</h1>
      <p className="mt-4 text-gray-600">
        Enter your username, password, and OTP to continue.
      </p>

      <form className="mt-10 space-y-4 bg-white border rounded-2xl p6 shadow-sm">
        <div>
          <label className="block text-sm font-semibold mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">OTP</label>
          <input
            type="text"
            placeholder="Enter OTP code"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <button
          type="Button"
          className="bg-brand text-white px-6 py-3 rounded-lg font-semibold"
        >
          Sign in
        </button>
      </form>
    </section>
  );
}