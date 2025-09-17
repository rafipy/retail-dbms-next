"use client";

import React, { useState } from "react";

export default function LoginForm() {

  const [role, setRole] = useState("employee");
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", { ID, password, role });

    if (!ID || !password) {
      setError(true);
      return;
    }

    setError(false);
     try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    alert("✅ Login successful!");
    console.log("Logged in user:", data.user);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  const IDError = error && !ID;
  const passwordError = error && !password;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-14">

        <h1 className="text-6xl font-[Geist] font-extralight text-center mb-6 text-black">Retail Store</h1>

        <hr className="h-px my-8 bg-gray-400 border-0"></hr>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="ID" className="block text-sm font-medium text-gray-700">
              ID
            </label>
            <input
              type="text"
              id="ID"
              onChange={(e) => setID(e.target.value)}
              className={`
                mt-1 block w-full border px-3 py-2  text-black
                focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 
                ${error && !ID ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="123456789"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className={`
                mt-1 block w-full border px-3 py-2  text-black
                focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 
                ${error && !password ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="••••••••"
            />
          </div>

        
        <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Select Role
            </label>

            <select
                id="role"
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full text-black border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="supplier">Supplier</option>
                <option value="administrator">Administrator</option>
            </select>
          </div>
    

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
          </form>
    </div> 
    </div>
    );
}
