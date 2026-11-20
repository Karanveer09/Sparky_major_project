import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

export default function TaskPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First get the logged-in user's email, then fetch their tasks
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user?.email) {
          setLoading(false);
          return;
        }
        return fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        });
      })
      .then((res) => res && res.json())
      .then((data) => {
        if (data) {
          const found = (data.tasks || []).find((t) => t._id === id || t.id === id);
          setTask(found || null);
        }
      })
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading task...</p>;
  }

  if (!task) {
    return (
      <main className="bg-gray-50 min-h-screen p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Task not found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary px-6 py-2 rounded-xl text-xs font-bold">
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-medium mr-2"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold">{task.title || "Task Details"}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-xl font-bold mb-2">{task.title || "Task"}</h2>
        <p className="text-gray-600 text-sm mb-4">{task.description}</p>

        <div className="text-sm space-y-2">
          {task.date && (
            <p>
              <span className="font-medium">Date:</span>{" "}
              {format(new Date(task.date), "MMM dd, yyyy")}
            </p>
          )}
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700">
              {task.status || "Pending"}
            </span>
          </p>
          {task.client && (
            <p>
              <span className="font-medium">Client:</span> {task.client}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

