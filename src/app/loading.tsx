export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex h-screen items-center justify-center">
      <span className="loader inline-block text-4xl font-bold relative">
        L &nbsp; ading
        <span className="absolute left-8 bottom-2.5 w-7.5 h-7.5 rounded-full border-4  border-b-primary animate-spin"></span>
      </span>
    </div>
  );
}
