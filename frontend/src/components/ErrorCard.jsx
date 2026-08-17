export default function ErrorCard({ error }) {
  return (
    <div className="w-96 m-auto my-[5rem] p-2 text-red-600 text-center border-red-400 border-2">
      <p className="text-3xl font-bold capitalize">Status: {error.status}</p>
      <p>{error.error}</p>
    </div>
  );
}