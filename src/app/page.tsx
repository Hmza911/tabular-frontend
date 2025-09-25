"use client";

import Navbar from "@/components/Navbar";
import { useUsersStore } from "@/stores/useUsersStore";
import { Users } from "@/types/data";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/app/utils/debounce";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { isLoading, users, getUsers, deleteUser, addUser } = useUsersStore();
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () => debounce((value: string) => getUsers(value), 1000),
    [getUsers]
  );

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const [newUser, setNewUser] = useState({
    rank: "",
    name: "",
    city: "",
    age: 0,
    friends: 0,
    xp_level: 0,
    badge: "",
  });

  const handleAdd = async () => {
    if (!newUser.name || !newUser.city || !newUser.age) return;

    try {
      await addUser({
        name: newUser.name,
        city: newUser.city,
        age: Number(newUser.age),
        friends: 0,
        xp_level: 0,
        badge: "",
      });

      //  Refresh users after adding
      await getUsers(query);

      setNewUser({
        rank: "",
        name: "",
        city: "",
        age: 0,
        friends: 0,
        xp_level: 0,
        badge: "",
      });
    } catch (err) {
      console.error("Failed to add user", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);

      //  Refresh users after deleting
      await getUsers(query);
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const calculateStats = (user: Users) => {
    const friendCount = user.friends;
    const hobbyCount = user.friends;
    const xp = user.age * 10 + friendCount * 5 + hobbyCount * 2;
    const level = Math.floor(xp / 100);

    let badge = "🥉 Bronze";
    if (level >= 10) badge = "🥇 Gold";
    else if (level >= 5) badge = "🥈 Silver";

    return { xp, level, badge };
  };

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 "></div>
      </div>
    );

  return (
    <div
      className="min-h-screen  p-6 md:p-12"
     style={{ backgroundColor: "#dfebeeeb" }}
    >
      {/* Header */}
      <Navbar />

      {/* Search + Add User */}
      <div className="mb-10 grid md:grid-cols-2 gap-6">
        {/* Search bar */}
        <input
          type="text"
          placeholder="🔍 Search by name..."
          className="p-2 border border-gray-300   bg-white text-white/700 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-border-gray-400 outline-none transition"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />

        {/* Add new user form */}
        <div className="flex flex-wrap gap-3 bg-white shadow-lg p-4 rounded-xl border">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-gray-400 outline-none"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-gray-400 outline-none"
            value={newUser.city}
            onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            className="border border-gray-300 p-2 rounded-lg w-20 focus:ring-2 focus:ring-gray-400 outline-none"
            value={newUser.age}
            onChange={(e) =>
              setNewUser({ ...newUser, age: parseInt(e.target.value) })
            }
          />
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-[#2e4647eb] text-white rounded-lg shadow hover:bg-gray-500 transition"
          >
             Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-[#2e4647eb] text-white sticky top-0 shadow">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Rank</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">City</th>
              <th className="px-4 py-3 text-left font-semibold">Age</th>
              <th className="px-4 py-3 text-left font-semibold">Friends</th>
              <th className="px-4 py-3 text-left font-semibold">XP / Level</th>
              <th className="px-4 py-3 text-left font-semibold">Badge</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((item, index) => {
                const { xp, level, badge } = calculateStats(item);

                return (
                  <motion.tr
                    key={item.rank}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`border-t transition hover:bg-purple-50 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-purple-700">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.city}</td>
                    <td className="px-4 py-3">{item.age}</td>
                    <td className="px-4 py-3">{item.friends}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      {xp} XP | Lvl {level}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          badge.includes("Gold")
                            ? "bg-yellow-100 text-yellow-700"
                            : badge.includes("Silver")
                            ? "bg-gray-200 text-gray-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {badge}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(parseInt(item.rank))}
                        className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
