'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

interface Todo {
  id: string | number;
  name: string;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTodos() {
      try {
        const { data: todos, error } = await supabase.from('todos').select();
        if (error) {
          console.error('Error fetching todos:', error.message);
        } else if (todos) {
          setTodos(todos);
        }
      } catch (err) {
        console.error('Unexpected error fetching todos:', err);
      } finally {
        setLoading(false);
      }
    }

    getTodos();
  }, []);

  if (loading) {
    return <div className="p-8 text-sm text-gray-500 font-medium">Loading todos from Supabase...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Supabase Todos</h1>
      {todos.length === 0 ? (
        <p className="text-xs text-gray-500">No todos found in Supabase database.</p>
      ) : (
        <ul className="space-y-2 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          {todos.map((todo) => (
            <li key={todo.id} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-semibold text-gray-800 dark:text-gray-200">
              {todo.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
