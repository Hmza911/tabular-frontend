export default function Navbar() {
  return (
    <section className="flex justify-center mt-2 mb-8">
      <div className="w-full max-w-3xl rounded-4xl bg-[#2e4647eb] backdrop-blur-md p-6 text-center shadow-lg">
        <h1 className="text-4xl text-white bold  font-bold text-transparent">
           Leaderboard Dashboard
        </h1>
        <p className="text-gray-200 mt-2 text-lg">
          A modern, sortable, editable leaderboard built with React + Tailwind
        </p>
      </div>
    </section>
  );
}
