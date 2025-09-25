"use client";

import { useUsersStore } from "@/stores/useUsersStore";
import React, { useEffect } from "react";

const Page = () => {
  // import types from stores
  const { users, isLoading, getUsers } = useUsersStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]); // only run once on mount

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {users.map((item) => (
            <div key={item.rank}>
              <p>{item.rank}</p>
              <p>{item.name}</p>
              <p>{item.city}</p>
              <p>{item.age}</p>
              <p>{item.friends}</p>
              <p>{item.xp_level}</p>
              <p>{item.badge}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Page;
