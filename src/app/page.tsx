"use client";
import { data } from "@/types/data";
import { useState } from "react";

export default function Home() {
  const [tableData, setTableData] = useState(data);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("desc");
  const [column, setColumn] = useState("xp");

  const [newUser, setNewUser] = useState({
    name: "",
    city: "",
    age: "",
  });

  const handleAdd = () => {
    if (!newUser.name || !newUser.city || !newUser.age) return;
    setTableData([
      ...tableData,
      {
        id: tableData.length + 1,
        ...newUser,
        age: Number(newUser.age),
        friends: [],
      },
    ]);
    setNewUser({ name: "", city: "", age: "" });
  };

  const handleDelete = (id: number) => {
    setTableData(tableData.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: number, field: string, value: string) => {
    setTableData(
      tableData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateStats = (user: any) => {
    const friendCount = user.friends.length;
    const hobbyCount = user.friends.reduce(
      (acc: number, f: any) => acc + f.hobbies.length,
      0
    );
    const xp = user.age * 10 + friendCount * 5 + hobbyCount * 2;
    const level = Math.floor(xp / 100);

    let badge = "🥉 Bronze";
    if (level >= 10) badge = "🥇 Gold";
    else if (level >= 5) badge = "🥈 Silver";

    return { xp, level, badge };
  };

  const filteredData = tableData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const statsA = calculateStats(a);
    const statsB = calculateStats(b);

    if (column === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (column === "age") {
      return order === "asc" ? a.age - b.age : b.age - a.age;
    }

    if (column === "xp") {
      return order === "asc" ? statsA.xp - statsB.xp : statsB.xp - statsA.xp;
    }

    return 0;
  });

  const handleSort = (c: string) => {
    if (column === c) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setColumn(c);
      setOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-purple-700">
          🏆 Leaderboard Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          A sortable, editable leaderboard built with React + Tailwind CSS
        </p>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="🔍 Search by name..."
        className="p-3 border border-gray-300 rounded-xl mb-6 w-full shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Add new user form */}
      <div className="mb-8 flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-purple-400 outline-none"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-purple-400 outline-none"
          value={newUser.city}
          onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          className="border p-2 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-purple-400 outline-none"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        >
          ➕ Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-purple-100 text-purple-800 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Rank</th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-purple-200 transition text-left font-bold"
                onClick={() => handleSort("name")}
              >
                Name {column === "name" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-left font-bold">City</th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-purple-200 transition text-left font-bold"
                onClick={() => handleSort("age")}
              >
                Age {column === "age" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-left font-bold">Friends</th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-purple-200 transition text-left font-bold"
                onClick={() => handleSort("xp")}
              >
                XP / Level {column === "xp" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-left font-bold">Badge</th>
              <th className="px-4 py-3 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => {
              const { xp, level, badge } = calculateStats(item);

              return (
                <tr
                  key={item.id}
                  className={`border-t hover:bg-purple-50 transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-purple-700">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="border p-1 rounded w-full focus:ring-2 focus:ring-purple-400 outline-none"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdate(item.id, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="border p-1 rounded w-full focus:ring-2 focus:ring-purple-400 outline-none"
                      value={item.city}
                      onChange={(e) =>
                        handleUpdate(item.id, "city", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      className="border p-1 rounded w-full focus:ring-2 focus:ring-purple-400 outline-none"
                      value={item.age}
                      onChange={(e) =>
                        handleUpdate(item.id, "age", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.friends.length}
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    {xp} XP | Lvl {level}
                  </td>
                  <td className="px-4 py-3 text-lg">{badge}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
