export function LoadingScreen({ message = 'Loading Inkwell...' }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center font-serif text-lg text-gray-400">
      {message}
    </div>
  )
}
