export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen sm:p-20 gap-6 text-center">
      <div>
        <h1 className="text-5xl sm:text-6xl font-bold text-foreground">Welcome to ConnectPay</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">Real-time communication platform with messaging, calling, and wallet features</p>
      </div>
      <div className="flex gap-4">
        <a href="/login" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition">
          Login
        </a>
        <a href="/signup" className="px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition">
          Sign Up
        </a>
      </div>
    </div>
  );
}
